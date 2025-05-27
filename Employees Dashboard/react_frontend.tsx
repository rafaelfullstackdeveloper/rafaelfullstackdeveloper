import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Briefcase, 
  TrendingUp, 
  Calendar, 
  Archive, 
  Check, 
  Eye, 
  Plus,
  MapPin,
  Globe,
  User,
  Clock,
  Filter,
  Search
} from 'lucide-react';

const JobTracker = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [jobSites, setJobSites] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showNewSiteForm, setShowNewSiteForm] = useState(false);
  const [showNewAppForm, setShowNewAppForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data para demonstração
  const mockJobSites = [
    {
      id: 1,
      name: 'LinkedIn',
      url: 'https://linkedin.com',
      site_type: 'job_board',
      country: 'US',
      language: 'en',
      work_area: 'tech',
      description: 'Maior rede profissional do mundo',
      is_completed: false,
      visited: true,
      applications_count: 5
    },
    {
      id: 2,
      name: 'Programathor',
      url: 'https://programathor.com.br',
      site_type: 'job_board',
      country: 'BR',
      language: 'pt',
      work_area: 'tech',
      description: 'Vagas de tecnologia no Brasil',
      is_completed: false,
      visited: false,
      applications_count: 2
    },
    {
      id: 3,
      name: 'HackerRank',
      url: 'https://hackerrank.com',
      site_type: 'challenge',
      country: 'US',
      language: 'en',
      work_area: 'tech',
      description: 'Desafios de programação e vagas tech',
      is_completed: true,
      visited: true,
      applications_count: 3
    }
  ];

  const mockApplications = [
    {
      id: 1,
      job_site: 1,
      job_site_name: 'LinkedIn',
      position: 'Desenvolvedor Full Stack',
      company: 'Tech Corp',
      job_url: 'https://linkedin.com/jobs/123',
      salary_range: 'R$ 8.000 - R$ 12.000',
      status: 'applied',
      applied_date: '2024-01-15T10:00:00Z',
      notes: 'Vaga interessante com React e Node.js',
      is_archived: false
    },
    {
      id: 2,
      job_site: 2,
      job_site_name: 'Programathor',
      position: 'Frontend Developer',
      company: 'StartupXYZ',
      job_url: 'https://programathor.com.br/vaga/456',
      salary_range: 'R$ 6.000 - R$ 9.000',
      status: 'interview',
      applied_date: '2024-01-10T14:30:00Z',
      notes: 'Entrevista agendada para próxima semana',
      is_archived: false
    }
  ];

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setJobSites(mockJobSites);
      setApplications(mockApplications);
      setStats({
        total_sites: 3,
        visited_sites: 2,
        completed_sites: 1,
        pending_sites: 1,
        total_applications: 2,
        by_status: [
          { status: 'applied', count: 1 },
          { status: 'interview', count: 1 }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const StatusBadge = ({ status }) => {
    const colors = {
      applied: 'bg-blue-100 text-blue-800',
      interview: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      accepted: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      applied: 'Candidatado',
      interview: 'Entrevista',
      rejected: 'Rejeitado',
      accepted: 'Aceito',
      archived: 'Arquivado'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const Dashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Building className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Sites</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_sites || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sites Visitados</p>
              <p className="text-2xl font-bold text-gray-900">{stats.visited_sites || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Check className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Concluídos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed_sites || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Briefcase className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Candidaturas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_applications || 0}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Sites Pendentes</h3>
          <div className="space-y-3">
            {jobSites.filter(site => !site.visited).map(site => (
              <div key={site.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">{site.name}</h4>
                  <p className="text-sm text-gray-600">{site.description}</p>
                </div>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                  Visitar
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Candidaturas Recentes</h3>
          <div className="space-y-3">
            {applications.slice(0, 3).map(app => (
              <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">{app.position}</h4>
                  <p className="text-sm text-gray-600">{app.company}</p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const JobSites = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Sites de Vagas</h2>
        <button 
          onClick={() => setShowNewSiteForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Site
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobSites.map(site => (
          <div key={site.id} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{site.name}</h3>
                <p className="text-sm text-gray-600">{site.description}</p>
              </div>
              <div className="flex space-x-2">
                {site.visited && <Eye className="h-4 w-4 text-green-600" />}
                {site.is_completed && <Check className="h-4 w-4 text-purple-600" />}
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {site.country}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Globe className="h-4 w-4 mr-2" />
                {site.language === 'pt' ? 'Português' : 'Inglês'}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                {site.work_area === 'tech' ? 'Tecnologia' : site.work_area}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {site.applications_count} candidaturas
              </span>
              <div className="flex space-x-2">
                {!site.visited && (
                  <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                    Marcar Visitado
                  </button>
                )}
                {!site.is_completed && (
                  <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700">
                    Concluir
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const Applications = () => {
    const filteredApps = applications.filter(app => {
      const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
      const matchesSearch = app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.company.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch && !app.is_archived;
    });

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Candidaturas</h2>
          <button 
            onClick={() => setShowNewAppForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Candidatura
          </button>
        </div>
        
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por vaga ou empresa..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos os Status</option>
            <option value="applied">Candidatado</option>
            <option value="interview">Entrevista</option>
            <option value="rejected">Rejeitado</option>
            <option value="accepted">Aceito</option>
          </select>
        </div>
        
        <div className="space-y-4">
          {filteredApps.map(app => (
            <div key={app.id} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{app.position}</h3>
                  <p className="text-gray-600">{app.company} • {app.job_site_name}</p>
                  {app.salary_range && (
                    <p className="text-sm text-green-600 font-medium">{app.salary_range}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <StatusBadge status={app.status} />
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Archive className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Calendar className="h-4 w-4 mr-2" />
                Candidatado em {new Date(app.applied_date).toLocaleDateString('pt-BR')}
              </div>
              
              {app.notes && (
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{app.notes}</p>
              )}
              
              <div className="mt-4 flex space-x-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                  Ver Detalhes
                </button>
                {app.job_url && (
                  <a 
                    href={app.job_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                  >
                    Ver Vaga
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const Timeline = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Timeline de Candidaturas</h2>
      
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        <div className="space-y-6">
          {applications.map(app => (
            <div key={app.id} className="relative flex items-start">
              <div className="absolute left-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-white" />
              </div>
              <div className="ml-12 bg-white p-6 rounded-lg shadow-sm border w-full">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{app.position}</h3>
                  <StatusBadge status={app.status} />
                </div>
                <p className="text-gray-600 mb-2">{app.company} • {app.job_site_name}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  {new Date(app.applied_date).toLocaleDateString('pt-BR')} às {new Date(app.applied_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
                {app.notes && (
                  <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{app.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {