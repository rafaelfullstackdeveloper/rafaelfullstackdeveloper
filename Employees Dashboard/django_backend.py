# requirements.txt
Django==4.2.0
djangorestframework==3.14.0
django-cors-headers==4.0.0
python-decouple==3.8
Pillow==9.5.0

# myproject/settings.py
import os
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config('SECRET_KEY', default='your-secret-key-here')
DEBUG = config('DEBUG', default=True, cast=bool)

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'job_tracker',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'myproject.urls'

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20
}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Sao_Paulo'
USE_I18N = True
USE_TZ = True

# job_tracker/models.py
from django.db import models
from django.contrib.auth.models import User

class JobSite(models.Model):
    SITE_TYPES = [
        ('job_board', 'Site de Vagas'),
        ('company', 'Site da Empresa'),
        ('challenge', 'Code Challenge'),
        ('freelance', 'Freelance'),
    ]
    
    COUNTRIES = [
        ('BR', 'Brasil'),
        ('US', 'Estados Unidos'),
        ('CA', 'Canadá'),
        ('UK', 'Reino Unido'),
        ('DE', 'Alemanha'),
        ('FR', 'França'),
        ('ES', 'Espanha'),
        ('PT', 'Portugal'),
        ('OTHER', 'Outro'),
    ]
    
    LANGUAGES = [
        ('pt', 'Português'),
        ('en', 'Inglês'),
        ('es', 'Espanhol'),
        ('fr', 'Francês'),
        ('de', 'Alemão'),
        ('other', 'Outro'),
    ]
    
    WORK_AREAS = [
        ('tech', 'Tecnologia'),
        ('design', 'Design'),
        ('marketing', 'Marketing'),
        ('sales', 'Vendas'),
        ('finance', 'Financeiro'),
        ('hr', 'Recursos Humanos'),
        ('general', 'Geral'),
    ]
    
    name = models.CharField(max_length=200)
    url = models.URLField()
    site_type = models.CharField(max_length=20, choices=SITE_TYPES)
    country = models.CharField(max_length=10, choices=COUNTRIES)
    language = models.CharField(max_length=10, choices=LANGUAGES)
    work_area = models.CharField(max_length=20, choices=WORK_AREAS)
    description = models.TextField(blank=True)
    is_completed = models.BooleanField(default=False)
    visited = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['-created_at']

class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('applied', 'Candidatado'),
        ('interview', 'Entrevista'),
        ('rejected', 'Rejeitado'),
        ('accepted', 'Aceito'),
        ('pending', 'Pendente'),
        ('archived', 'Arquivado'),
    ]
    
    job_site = models.ForeignKey(JobSite, on_delete=models.CASCADE, related_name='applications')
    position = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    job_url = models.URLField(blank=True)
    description = models.TextField(blank=True)
    salary_range = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='applied')
    applied_date = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    is_archived = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.position} - {self.company}"
    
    class Meta:
        ordering = ['-applied_date']

class ApplicationTimeline(models.Model):
    EVENT_TYPES = [
        ('applied', 'Candidatura Enviada'),
        ('viewed', 'Currículo Visualizado'),
        ('interview_scheduled', 'Entrevista Agendada'),
        ('interview_completed', 'Entrevista Realizada'),
        ('feedback', 'Feedback Recebido'),
        ('rejected', 'Rejeitado'),
        ('accepted', 'Aceito'),
        ('other', 'Outro'),
    ]
    
    application = models.ForeignKey(JobApplication, on_delete=models.CASCADE, related_name='timeline')
    event_type = models.CharField(max_length=30, choices=EVENT_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.application.position} - {self.title}"
    
    class Meta:
        ordering = ['-date']

# job_tracker/serializers.py
from rest_framework import serializers
from .models import JobSite, JobApplication, ApplicationTimeline

class JobSiteSerializer(serializers.ModelSerializer):
    applications_count = serializers.SerializerMethodField()
    
    class Meta:
        model = JobSite
        fields = '__all__'
    
    def get_applications_count(self, obj):
        return obj.applications.count()

class ApplicationTimelineSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationTimeline
        fields = '__all__'

class JobApplicationSerializer(serializers.ModelSerializer):
    timeline = ApplicationTimelineSerializer(many=True, read_only=True)
    job_site_name = serializers.CharField(source='job_site.name', read_only=True)
    
    class Meta:
        model = JobApplication
        fields = '__all__'

# job_tracker/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from .models import JobSite, JobApplication, ApplicationTimeline
from .serializers import JobSiteSerializer, JobApplicationSerializer, ApplicationTimelineSerializer

class JobSiteViewSet(viewsets.ModelViewSet):
    queryset = JobSite.objects.all()
    serializer_class = JobSiteSerializer
    
    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        total_sites = JobSite.objects.count()
        visited_sites = JobSite.objects.filter(visited=True).count()
        completed_sites = JobSite.objects.filter(is_completed=True).count()
        pending_sites = total_sites - visited_sites
        
        return Response({
            'total_sites': total_sites,
            'visited_sites': visited_sites,
            'completed_sites': completed_sites,
            'pending_sites': pending_sites,
        })
    
    @action(detail=True, methods=['post'])
    def mark_visited(self, request, pk=None):
        site = self.get_object()
        site.visited = True
        site.save()
        return Response({'status': 'marked as visited'})
    
    @action(detail=True, methods=['post'])
    def mark_completed(self, request, pk=None):
        site = self.get_object()
        site.is_completed = True
        site.save()
        return Response({'status': 'marked as completed'})

class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    
    @action(detail=False, methods=['get'])
    def timeline(self, request):
        applications = JobApplication.objects.filter(is_archived=False).order_by('-applied_date')
        serializer = self.get_serializer(applications, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        application = self.get_object()
        application.is_archived = True
        application.save()
        return Response({'status': 'archived'})
    
    @action(detail=True, methods=['post'])
    def unarchive(self, request, pk=None):
        application = self.get_object()
        application.is_archived = False
        application.save()
        return Response({'status': 'unarchived'})
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        total = JobApplication.objects.count()
        by_status = JobApplication.objects.values('status').annotate(count=Count('status'))
        archived = JobApplication.objects.filter(is_archived=True).count()
        
        return Response({
            'total_applications': total,
            'by_status': by_status,
            'archived': archived,
        })

class ApplicationTimelineViewSet(viewsets.ModelViewSet):
    queryset = ApplicationTimeline.objects.all()
    serializer_class = ApplicationTimelineSerializer

# job_tracker/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobSiteViewSet, JobApplicationViewSet, ApplicationTimelineViewSet

router = DefaultRouter()
router.register(r'job-sites', JobSiteViewSet)
router.register(r'applications', JobApplicationViewSet)
router.register(r'timeline', ApplicationTimelineViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]

# myproject/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('job_tracker.urls')),
]