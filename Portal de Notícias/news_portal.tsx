import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Clock, User, Share2, BookmarkPlus, TrendingUp, Globe, Play, ChevronRight, Eye, MessageCircle } from 'lucide-react';

const NewsPortal = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Últimas');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const categories = [
    'Últimas', 'Política', 'Economia', 'Esportes', 'Entretenimento', 
    'Tecnologia', 'Saúde', 'Mundo', 'Educação', 'Ciência'
  ];

  const breakingNews = [
    "Presidente anuncia novo pacote econômico para 2024",
    "Seleção Brasileira confirma convocação para próximos jogos",
    "Nova descoberta científica revoluciona medicina",
    "Mercado financeiro registra alta histórica"
  ];

  const mainNews = {
    title: "Novas medidas econômicas são anunciadas pelo governo federal",
    summary: "Pacote inclui mudanças na política fiscal e novos investimentos em infraestrutura. Medidas devem impactar diretamente a economia brasileira nos próximos meses.",
    image: "🏛️",
    category: "Política",
    time: "há 15 min",
    author: "João Silva",
    views: "2.3k",
    comments: 45
  };

  const secondaryNews = [
    {
      title: "Brasil avança às semifinais do campeonato mundial",
      summary: "Seleção vence por 3x1 e garante vaga na próxima fase da competição internacional.",
      image: "⚽",
      category: "Esportes",
      time: "há 23 min",
      views: "1.8k"
    },
    {
      title: "Nova tecnologia promete revolucionar telecomunicações",
      summary: "Startup brasileira desenvolve solução inovadora para conectividade rural.",
      image: "📱",
      category: "Tecnologia",
      time: "há 45 min",
      views: "956"
    },
    {
      title: "Mercado de ações registra maior alta do ano",
      summary: "Ibovespa supera expectativas e fecha em alta de 2,8% nesta quinta-feira.",
      image: "📈",
      category: "Economia",
      time: "há 1h",
      views: "1.2k"
    }
  ];

  const sidebarNews = [
    {
      title: "Chuvas intensas atingem região Sul do país",
      time: "há 10 min",
      category: "Brasil"
    },
    {
      title: "Novo filme brasileiro concorre ao Oscar",
      time: "há 25 min",
      category: "Cultura"
    },
    {
      title: "Descoberta arqueológica revela civilização antiga",
      time: "há 35 min",
      category: "Ciência"
    },
    {
      title: "Startup brasileira recebe investimento milionário",
      time: "há 50 min",
      category: "Negócios"
    },
    {
      title: "Nova lei de proteção de dados entra em vigor",
      time: "há 1h",
      category: "Tecnologia"
    }
  ];

  const trendingTopics = [
    "#EconomiaDigital", "#SeleçãoBrasileira", "#InovaçãoTech", 
    "#Sustentabilidade", "#EducaçãoBrasil", "#StartupBrasil"
  ];

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        {/* Top Bar */}
        <div className="bg-red-600 text-white py-1">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formatTime(currentTime)}
              </span>
              <span>{formatDate(currentTime)}</span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <span>Cotações</span>
              <span>Dólar: R$ 5,12</span>
              <span>Euro: R$ 5,54</span>
              <span>Bitcoin: R$ 245.000</span>
            </div>
          </div>
        </div>

        {/* Breaking News */}
        <div className="bg-yellow-400 py-2">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center">
              <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold mr-4">
                URGENTE
              </span>
              <div className="overflow-hidden flex-1">
                <div className="animate-marquee whitespace-nowrap">
                  {breakingNews.join(' • ')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-blue-800">
                <Globe className="inline w-8 h-8 mr-2" />
                NewsPortal
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-6">
              {categories.slice(0, 6).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-2 rounded-md font-medium transition-colors ${
                    activeCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </nav>

            {/* Search and Menu */}
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Buscar notícias..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Buscar notícias..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-7 top-2.5 w-5 h-5 text-gray-400" />
              </div>
              <nav className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setActiveCategory(category);
                      setIsMenuOpen(false);
                    }}
                    className={`px-3 py-2 rounded-md font-medium text-left transition-colors ${
                      activeCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main News Section */}
          <div className="lg:col-span-3">
            {/* Featured Article */}
            <article className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
              <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-6xl">
                {mainNews.image}
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-3">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    {mainNews.category}
                  </span>
                  <span className="text-gray-500 text-sm flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {mainNews.time}
                  </span>
                  <span className="text-gray-500 text-sm flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {mainNews.views}
                  </span>
                  <span className="text-gray-500 text-sm flex items-center">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {mainNews.comments}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  {mainNews.title}
                </h1>
                <p className="text-gray-600 text-lg mb-4">
                  {mainNews.summary}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Por {mainNews.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800">
                      <Share2 className="w-4 h-4" />
                      <span>Compartilhar</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
                      <BookmarkPlus className="w-4 h-4" />
                      <span>Salvar</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Secondary News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
              {secondaryNews.map((news, index) => (
                <article key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white text-4xl">
                    {news.image}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {news.category}
                      </span>
                      <span className="text-gray-500 text-xs flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {news.time}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {news.summary}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {news.views}
                      </span>
                      <button className="text-blue-600 hover:text-blue-800 flex items-center">
                        Ler mais <ChevronRight className="w-3 h-3 ml-1" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Video Section */}
            <section className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Play className="w-5 h-5 mr-2 text-red-600" />
                Vídeos em Destaque
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((video) => (
                  <div key={video} className="relative group cursor-pointer">
                    <div className="aspect-video bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white">
                      <Play className="w-12 h-12 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 rounded-b-lg">
                      <h4 className="text-white font-medium text-sm">
                        Entrevista exclusiva sobre economia brasileira
                      </h4>
                      <span className="text-gray-300 text-xs">5:42</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Trending Topics */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
                Trending Topics
              </h3>
              <div className="space-y-2">
                {trendingTopics.map((topic, index) => (
                  <button
                    key={index}
                    className="block w-full text-left px-3 py-2 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Latest News Sidebar */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Mais Lidas</h3>
              <div className="space-y-4">
                {sidebarNews.map((news, index) => (
                  <article key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                    <div className="flex items-start space-x-3">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-bold min-w-6 text-center">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer mb-1">
                          {news.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {news.category}
                          </span>
                          <span>{news.time}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Weather Widget */}
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-md p-6 text-white mb-6">
              <h3 className="text-lg font-bold mb-3">Clima</h3>
              <div className="text-center">
                <div className="text-4xl mb-2">☀️</div>
                <div className="text-2xl font-bold">28°C</div>
                <div className="text-sm opacity-90">São Paulo</div>
                <div className="text-sm opacity-75 mt-2">
                  Máx: 32° Min: 22°
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gray-900 rounded-lg shadow-md p-6 text-white">
              <h3 className="text-lg font-bold mb-3">Newsletter</h3>
              <p className="text-sm text-gray-300 mb-4">
                Receba as principais notícias direto no seu email
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Seu email"
                  className="w-full px-3 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                  Assinar
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-bold mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                NewsPortal
              </h4>
              <p className="text-gray-400 text-sm">
                Seu portal de notícias confiável, trazendo informações precisas e atualizadas 24 horas por dia.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Seções</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                {categories.slice(0, 5).map((category) => (
                  <li key={category}>
                    <a href="#" className="hover:text-white transition-colors">
                      {category}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Institucional</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Trabalhe Conosco</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Siga-nos</h5>
              <div className="flex space-x-4">
                <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full transition-colors">
                  f
                </button>
                <button className="bg-blue-400 hover:bg-blue-500 p-2 rounded-full transition-colors">
                  t
                </button>
                <button className="bg-pink-600 hover:bg-pink-700 p-2 rounded-full transition-colors">
                  i
                </button>
                <button className="bg-red-600 hover:bg-red-700 p-2 rounded-full transition-colors">
                  y
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 NewsPortal. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translate3d(100%, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NewsPortal;