import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Newspaper, 
  Users, 
  UserPlus, 
  LogIn, 
  LogOut, 
  Menu, 
  X,
  Shield,
  Heart,
  Leaf,
  Building
} from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useNews } from './hooks/useNews';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { NewsList } from './components/news/NewsList';
import { ResidentForm } from './components/residents/ResidentForm';
import { ResidentDirectory } from './components/residents/ResidentDirectory';

type ActivePage = 'home' | 'news' | 'residents' | 'profile' | 'login' | 'register';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { news, loading: newsLoading, fetchImportantNews } = useNews();
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [importantNews, setImportantNews] = useState<any[]>([]);

  useEffect(() => {
    const loadImportantNews = async () => {
      const data = await fetchImportantNews();
      setImportantNews(data);
    };
    loadImportantNews();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setActivePage('home');
  };

  const navigation = [
    { id: 'home', name: 'Beranda', icon: Home },
    { id: 'news', name: 'Berita', icon: Newspaper },
    { id: 'residents', name: 'Direktori Warga', icon: Users },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Keamanan Terjamin',
      description: 'Sistem keamanan 24 jam dengan CCTV dan petugas keamanan profesional',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Heart,
      title: 'Komunitas Harmonis',
      description: 'Lingkungan yang ramah dengan berbagai kegiatan sosial dan gotong royong',
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: Leaf,
      title: 'Lingkungan Hijau',
      description: 'Taman yang asri dan udara yang bersih untuk kenyamanan keluarga',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Building,
      title: 'Fasilitas Lengkap',
      description: 'Fasilitas olahraga, taman bermain, dan area komunal yang terawat',
      color: 'from-purple-500 to-indigo-600'
    }
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Memuat...</div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activePage) {
      case 'login':
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
            <LoginForm 
              onSuccess={() => setActivePage('home')}
              onSwitchToRegister={() => setActivePage('register')}
            />
          </div>
        );

      case 'register':
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
            <RegisterForm 
              onSuccess={() => setActivePage('home')}
              onSwitchToLogin={() => setActivePage('login')}
            />
          </div>
        );

      case 'news':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Berita Warga</h1>
                <p className="text-gray-600">Informasi terkini seputar Cluster Kalita</p>
              </div>
              
              {importantNews.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Berita Penting</h2>
                  <NewsList news={importantNews} loading={newsLoading} />
                </div>
              )}
              
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Semua Berita</h2>
                <NewsList news={news} loading={newsLoading} />
              </div>
            </div>
          </div>
        );

      case 'residents':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ResidentDirectory />
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ResidentForm onSuccess={() => setActivePage('residents')} />
            </div>
          </div>
        );

      default:
        return (
          <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-600 text-white py-20">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl md:text-7xl font-bold mb-6 animate-fade-in">
                  Paguyuban Cluster Kalita
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-emerald-100 animate-slide-up">
                  Mewujudkan Lingkungan Harmonis, Aman, dan Nyaman
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
                  <button
                    onClick={() => setActivePage('residents')}
                    className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
                  >
                    Lihat Direktori Warga
                  </button>
                  <button
                    onClick={() => setActivePage('news')}
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                  >
                    Baca Berita Terkini
                  </button>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Mengapa Memilih Cluster Kalita?
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Cluster Kalita menawarkan lingkungan hunian yang ideal dengan berbagai keunggulan
                    untuk kenyamanan dan keamanan keluarga Anda.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Important News Section */}
            {importantNews.length > 0 && (
              <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      Pengumuman Penting
                    </h2>
                    <p className="text-gray-600">
                      Informasi terkini yang perlu diketahui seluruh warga
                    </p>
                  </div>
                  <NewsList 
                    news={importantNews.slice(0, 3)} 
                    loading={newsLoading}
                    onNewsClick={() => setActivePage('news')}
                  />
                  <div className="text-center mt-8">
                    <button
                      onClick={() => setActivePage('news')}
                      className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Lihat Semua Berita
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-emerald-600 to-green-600 text-white">
              <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold mb-4">
                  Bergabunglah dengan Komunitas Kami
                </h2>
                <p className="text-xl mb-8 text-emerald-100">
                  Daftarkan informasi Anda dan jadilah bagian dari direktori warga Cluster Kalita
                </p>
                {user ? (
                  <button
                    onClick={() => setActivePage('profile')}
                    className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
                  >
                    Lengkapi Profil Saya
                  </button>
                ) : (
                  <button
                    onClick={() => setActivePage('login')}
                    className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
                  >
                    Masuk / Daftar
                  </button>
                )}
              </div>
            </section>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setActivePage('home')}
                className="flex items-center space-x-2 text-emerald-600 font-bold text-xl"
              >
                <Home className="w-8 h-8" />
                <span>Cluster Kalita</span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id as ActivePage)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    activePage === item.id
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              ))}

              {user ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setActivePage('profile')}
                    className="flex items-center space-x-1 text-gray-600 hover:text-emerald-600 px-3 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Profil</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Keluar</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setActivePage('login')}
                  className="flex items-center space-x-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Masuk</span>
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-emerald-600 p-2"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-2">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActivePage(item.id as ActivePage);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 w-full px-3 py-2 rounded-lg transition-colors ${
                      activePage === item.id
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                ))}

                {user ? (
                  <>
                    <button
                      onClick={() => {
                        setActivePage('profile');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>Profil</span>
                    </button>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Keluar</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setActivePage('login');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Masuk</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Home className="w-6 h-6 mr-2" />
            <span className="font-semibold">Paguyuban Cluster Kalita</span>
          </div>
          <p className="text-gray-400">
            © 2025 Cluster Kalita. Mewujudkan lingkungan harmonis untuk semua.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;