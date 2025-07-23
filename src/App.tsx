import React, { useState, useEffect } from 'react';
import { 
  Home, Users, Calendar, ShoppingBag, Info, Phone, Menu, X, 
  MapPin, Clock, Star, Wifi, Zap, Shield, Heart, Award,
  Edit, Plus, Trash2, Save, Eye, EyeOff, User, Settings,
  Bell, FileText, DollarSign, Camera, MessageSquare, Mail,
  Building, Car, Lightbulb, Droplets, Recycle, AlertTriangle,
  CheckCircle, XCircle, Clock3, TrendingUp, Users2, Activity,
  ArrowLeft, ArrowRight, Printer
} from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: 'PENTING' | 'KEGIATAN' | 'PENGUMUMAN' | 'INFORMASI' | 'SOSIAL' | 'ACARA';
  date: string;
  author: string;
  priority: 'high' | 'medium' | 'low';
}

interface Resident {
  id: string;
  name: string;
  address: string;
  phone: string;
  status: 'active' | 'inactive';
  dues: number;
  lastPayment: string;
}

interface Activity {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

const App = () => {
  const [activeSection, setActiveSection] = useState('beranda');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [showAllNews, setShowAllNews] = useState(false);

  // Data Management States
  const [news, setNews] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'Perbaikan Jalan Utama Cluster Dimulai Besok',
      content: 'Mulai besok tanggal 15 Januari 2025, akan dilakukan perbaikan jalan utama cluster. Mohon warga untuk berhati-hati dan menggunakan jalur alternatif.',
      category: 'PENTING',
      date: '2025-01-14',
      author: 'Ketua RT 01',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Laporan Gotong Royong Minggu Lalu',
      content: 'Terima kasih kepada 45 warga yang telah berpartisipasi dalam gotong royong pembersihan lingkungan. Lingkungan kita semakin bersih dan asri.',
      category: 'KEGIATAN',
      date: '2025-01-13',
      author: 'Sekretaris RT',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Jadwal Baru Senam Pagi',
      content: 'Mulai minggu depan, senam pagi akan dilaksanakan setiap Selasa dan Jumat pukul 06.00 WIB di lapangan cluster.',
      category: 'PENGUMUMAN',
      date: '2025-01-12',
      author: 'Koordinator Olahraga',
      priority: 'medium'
    }
  ]);

  const [residents, setResidents] = useState<Resident[]>([
    { id: '1', name: 'Budi Santoso', address: 'Blok A No. 1', phone: '081234567890', status: 'active', dues: 50000, lastPayment: '2025-01-01' },
    { id: '2', name: 'Siti Aminah', address: 'Blok A No. 2', phone: '081234567891', status: 'active', dues: 50000, lastPayment: '2025-01-01' },
    { id: '3', name: 'Ahmad Rahman', address: 'Blok B No. 1', phone: '081234567892', status: 'inactive', dues: 100000, lastPayment: '2024-11-01' }
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    { id: '1', name: 'Senam Pagi', date: '2025-01-16', time: '06:00', location: 'Lapangan Cluster', participants: 25, status: 'upcoming' },
    { id: '2', name: 'Rapat RT', date: '2025-01-18', time: '19:00', location: 'Balai Warga', participants: 15, status: 'upcoming' },
    { id: '3', name: 'Gotong Royong', date: '2025-01-20', time: '07:00', location: 'Seluruh Area', participants: 40, status: 'upcoming' }
  ]);

  // Form states for adding/editing
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [newNews, setNewNews] = useState<Partial<NewsItem>>({});

  const handleAdminLogin = () => {
    if (adminPassword === 'admin123') {
      setIsAdminMode(true);
      setShowPasswordInput(false);
      setAdminPassword('');
    } else {
      alert('Password salah!');
    }
  };

  const handleAddNews = () => {
    if (newNews.title && newNews.content && newNews.category) {
      const newsItem: NewsItem = {
        id: Date.now().toString(),
        title: newNews.title,
        content: newNews.content,
        category: newNews.category,
        date: new Date().toISOString().split('T')[0],
        author: 'Admin',
        priority: newNews.priority || 'medium'
      };
      setNews([newsItem, ...news]);
      setNewNews({});
    }
  };

  const handleDeleteNews = (id: string) => {
    if (confirm('Yakin ingin menghapus berita ini?')) {
      setNews(news.filter(item => item.id !== id));
    }
  };

  const handleReadMore = (newsItem) => {
    setSelectedNews(newsItem);
    setActiveSection('detail-berita');
  };

  const handleShowAllNews = () => {
    setShowAllNews(true);
    setActiveSection('semua-berita');
  };

  const handleBackToHome = () => {
    setSelectedNews(null);
    setShowAllNews(false);
    setActiveSection('beranda');
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'PENTING': 'border-red-500 bg-red-50',
      'KEGIATAN': 'border-green-500 bg-green-50',
      'PENGUMUMAN': 'border-purple-500 bg-purple-50',
      'INFORMASI': 'border-yellow-500 bg-yellow-50',
      'SOSIAL': 'border-teal-500 bg-teal-50',
      'ACARA': 'border-pink-500 bg-pink-50'
    };
    return colors[category as keyof typeof colors] || 'border-gray-500 bg-gray-50';
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      'PENTING': 'bg-red-500 text-white',
      'KEGIATAN': 'bg-green-500 text-white',
      'PENGUMUMAN': 'bg-purple-500 text-white',
      'INFORMASI': 'bg-yellow-500 text-white',
      'SOSIAL': 'bg-teal-500 text-white',
      'ACARA': 'bg-pink-500 text-white'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  const renderNavigation = () => (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-xl">
              <Building className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">RT 01 / RW 05</h1>
              <p className="text-xs text-gray-600">Cluster Kalita Harmonis</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { id: 'beranda', label: 'Beranda', icon: Home },
              { id: 'warga', label: 'Data Warga', icon: Users },
              { id: 'kegiatan', label: 'Kegiatan', icon: Calendar },
              { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
              { id: 'informasi', label: 'Informasi', icon: Info },
              { id: 'kontak', label: 'Kontak', icon: Phone }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                  activeSection === id
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
            
            {/* Admin Toggle */}
            <div className="flex items-center space-x-2">
              {!isAdminMode ? (
                <button
                  onClick={() => setShowPasswordInput(!showPasswordInput)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-sm">Admin</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsAdminMode(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors text-red-600"
                >
                  <EyeOff className="h-4 w-4" />
                  <span className="text-sm">Keluar</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-green-600 p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Admin Password Input */}
        {showPasswordInput && !isAdminMode && (
          <div className="py-4 border-t border-gray-200">
            <div className="flex items-center space-x-4 max-w-md">
              <input
                type="password"
                placeholder="Password Admin"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
              <button
                onClick={handleAdminLogin}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {[
                { id: 'beranda', label: 'Beranda', icon: Home },
                { id: 'warga', label: 'Data Warga', icon: Users },
                { id: 'kegiatan', label: 'Kegiatan', icon: Calendar },
                { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
                { id: 'informasi', label: 'Informasi', icon: Info },
                { id: 'kontak', label: 'Kontak', icon: Phone }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveSection(id);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    activeSection === id
                      ? 'bg-green-500 text-white'
                      : 'text-gray-600 hover:bg-green-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );

  const renderAdminNewsPanel = () => (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <Edit className="h-5 w-5 mr-2 text-green-500" />
          Panel Admin - Kelola Berita
        </h3>
        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          Mode Admin Aktif
        </div>
      </div>

      {/* Add News Form */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Berita Baru
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Judul Berita"
            value={newNews.title || ''}
            onChange={(e) => setNewNews({...newNews, title: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <select
            value={newNews.category || ''}
            onChange={(e) => setNewNews({...newNews, category: e.target.value as NewsItem['category']})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Pilih Kategori</option>
            <option value="PENTING">PENTING</option>
            <option value="KEGIATAN">KEGIATAN</option>
            <option value="PENGUMUMAN">PENGUMUMAN</option>
            <option value="INFORMASI">INFORMASI</option>
            <option value="SOSIAL">SOSIAL</option>
            <option value="ACARA">ACARA</option>
          </select>
        </div>
        <textarea
          placeholder="Isi Berita"
          value={newNews.content || ''}
          onChange={(e) => setNewNews({...newNews, content: e.target.value})}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
        />
        <div className="flex items-center space-x-4">
          <select
            value={newNews.priority || 'medium'}
            onChange={(e) => setNewNews({...newNews, priority: e.target.value as NewsItem['priority']})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="low">Prioritas Rendah</option>
            <option value="medium">Prioritas Sedang</option>
            <option value="high">Prioritas Tinggi</option>
          </select>
          <button
            onClick={handleAddNews}
            className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Simpan Berita</span>
          </button>
        </div>
      </div>

      {/* News Management */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800 flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Kelola Berita Existing ({news.length} berita)
        </h4>
        {news.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(item.category)}`}>
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-500">{item.date}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.priority === 'high' ? 'bg-red-100 text-red-800' :
                    item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.priority === 'high' ? 'Tinggi' : item.priority === 'medium' ? 'Sedang' : 'Rendah'}
                  </span>
                </div>
                <h5 className="font-semibold text-gray-800 mb-1">{item.title}</h5>
                <p className="text-gray-600 text-sm line-clamp-2">{item.content}</p>
                <p className="text-xs text-gray-500 mt-1">Oleh: {item.author}</p>
              </div>
              <button
                onClick={() => handleDeleteNews(item.id)}
                className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBeranda = () => (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-white/5 rounded-full animate-bounce-slow"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-white/5 rounded-full animate-bounce-slow" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              RT 01 / RW 05
            </h1>
            <h2 className="text-2xl md:text-4xl font-semibold mb-4 animate-slide-up">
              Cluster Kalita Harmonis
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90 animate-slide-up" style={{animationDelay: '0.3s'}}>
              Mewujudkan Lingkungan yang Aman, Nyaman, dan Harmonis
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{animationDelay: '0.6s'}}>
              <button 
                onClick={() => setActiveSection('warga')}
                className="px-8 py-4 bg-white text-green-600 rounded-full font-semibold hover:bg-green-50 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Lihat Data Warga
              </button>
              <button 
                onClick={() => setActiveSection('kegiatan')}
                className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-green-600 transform hover:scale-105 transition-all duration-300"
              >
                Kegiatan Terbaru
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Admin Panel */}
      {isAdminMode && renderAdminNewsPanel()}

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Data RT/RW
            </h2>
            <p className="text-xl text-gray-600">Statistik terkini lingkungan kita</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users2, label: 'Total Warga', value: '156', color: 'bg-blue-500', desc: 'Kepala Keluarga' },
              { icon: Building, label: 'Rumah', value: '89', color: 'bg-green-500', desc: 'Unit Hunian' },
              { icon: Activity, label: 'Kegiatan Aktif', value: '12', color: 'bg-purple-500', desc: 'Program Rutin' },
              { icon: TrendingUp, label: 'Partisipasi', value: '87%', color: 'bg-orange-500', desc: 'Tingkat Kehadiran' }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl p-6 text-center transform hover:scale-105 transition-all duration-300">
                <div className={`${stat.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</h3>
                <p className="text-lg font-semibold text-gray-700 mb-1">{stat.label}</p>
                <p className="text-sm text-gray-500">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <Bell className="h-8 w-8 mr-3 text-green-500" />
              Info Berita Warga
            </h2>
            <p className="text-xl text-gray-600">Berita dan pengumuman terkini dari RT/RW</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.slice(0, 6).map((item, index) => (
              <div 
                key={item.id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-t-4 ${getCategoryColor(item.category)} animate-fade-in`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeColor(item.category)}`}>
                      {item.category}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(item.date).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {item.content}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                    <User className="w-3 h-3" />
                    <span>Oleh: {item.author}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-1" />
                      {item.author}
                    </div>
                    <button 
                      onClick={() => handleReadMore(item)}
                      className="text-green-600 hover:text-green-700 font-semibold text-sm flex items-center"
                    >
                      Baca selengkapnya
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={handleShowAllNews}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-semibold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Lihat Semua Berita
            </button>
          </div>
        </div>
      </section>

      {/* WiFi Advertisement */}
      <section className="py-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-white/10 rounded-full animate-bounce-slow"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white/5 rounded-full animate-float"></div>
          <div className="absolute bottom-10 right-10 w-20 h-20 bg-white/10 rounded-full animate-wiggle"></div>
          
          {/* WiFi Signal Animation */}
          <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2">
            <div className="relative">
              <div className="w-4 h-4 bg-white/20 rounded-full animate-ping"></div>
              <div className="absolute top-0 left-0 w-4 h-4 bg-white/40 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="absolute top-1/3 right-1/3 transform -translate-y-1/2">
            <div className="relative">
              <div className="w-6 h-6 bg-white/15 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-0 left-0 w-6 h-6 bg-white/30 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl animate-float">
                <Wifi className="h-12 w-12 text-white animate-pulse" />
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Global Enter Network
            </h2>
            
            <p className="text-xl md:text-2xl mb-8 opacity-90 animate-slide-up">
              Internet Super Cepat untuk Warga RT/RW! 🚀
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up" style={{animationDelay: '0.3s'}}>
              {[
                { icon: Zap, title: 'Kecepatan Tinggi', desc: 'Up to 100 Mbps', color: 'from-yellow-400 to-orange-500' },
                { icon: Shield, title: 'Stabil & Aman', desc: '99.9% Uptime', color: 'from-green-400 to-emerald-500' },
                { icon: DollarSign, title: 'Harga Terjangkau', desc: 'Mulai 200rb/bulan', color: 'from-blue-400 to-cyan-500' }
              ].map((feature, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className={`bg-gradient-to-r ${feature.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow`} style={{animationDelay: `${index * 0.2}s`}}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="opacity-90">{feature.desc}</p>
                </div>
              ))}
            </div>

            <div className="animate-slide-up" style={{animationDelay: '0.6s'}}>
              <a
                href="https://gentle-zuccutto-0a5d35.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-white to-blue-50 text-blue-600 rounded-full font-bold text-lg hover:from-blue-50 hover:to-white transform hover:scale-105 transition-all duration-300 shadow-2xl animate-bounce-slow"
              >
                <span>🎯 Daftar Sekarang</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              </a>
              
              <div className="mt-4 flex items-center justify-center space-x-4 text-white/80">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>0821-1234-5678</span>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                <span className="text-sm">Online 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderDataWarga = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Data Warga RT 01 / RW 05</h2>
        <p className="text-xl text-gray-600">Informasi lengkap warga dan status iuran</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Warga</p>
              <p className="text-3xl font-bold">{residents.length}</p>
            </div>
            <Users className="h-12 w-12 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Aktif</p>
              <p className="text-3xl font-bold">{residents.filter(r => r.status === 'active').length}</p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Menunggak</p>
              <p className="text-3xl font-bold">{residents.filter(r => r.status === 'inactive').length}</p>
            </div>
            <XCircle className="h-12 w-12 text-red-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Tunggakan</p>
              <p className="text-2xl font-bold">Rp {residents.filter(r => r.status === 'inactive').reduce((sum, r) => sum + r.dues, 0).toLocaleString()}</p>
            </div>
            <DollarSign className="h-12 w-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Residents Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Daftar Warga</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telepon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Iuran</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terakhir Bayar</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {residents.map((resident) => (
                <tr key={resident.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-semibold">{resident.name.charAt(0)}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{resident.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resident.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resident.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      resident.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {resident.status === 'active' ? 'Aktif' : 'Menunggak'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rp {resident.dues.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(resident.lastPayment).toLocaleDateString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderKegiatan = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Kegiatan RT/RW</h2>
        <p className="text-xl text-gray-600">Jadwal dan laporan kegiatan warga</p>
      </div>

      {/* Activity Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-green-500" />
              Jadwal Kegiatan Mendatang
            </h3>
            
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{activity.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                      activity.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.status === 'upcoming' ? 'Akan Datang' :
                       activity.status === 'ongoing' ? 'Berlangsung' : 'Selesai'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(activity.date).toLocaleDateString('id-ID')}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {activity.time} WIB
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {activity.location}
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {activity.participants} peserta
                    </div>
                    <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                      Detail →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
            <h3 className="font-bold text-lg mb-4">Kegiatan Bulan Ini</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Senam Pagi</span>
                <span className="font-semibold">8x</span>
              </div>
              <div className="flex justify-between">
                <span>Gotong Royong</span>
                <span className="font-semibold">2x</span>
              </div>
              <div className="flex justify-between">
                <span>Rapat RT</span>
                <span className="font-semibold">1x</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-yellow-500" />
              Warga Aktif
            </h3>
            <div className="space-y-3">
              {['Bu Siti Aminah', 'Pak Budi Santoso', 'Bu Rina Wati'].map((name, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                  <span className="text-gray-700">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Regular Activities */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Kegiatan Rutin RT/RW</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              name: 'Senam Pagi', 
              schedule: 'Selasa & Jumat, 06:00 WIB', 
              location: 'Lapangan Cluster',
              icon: Heart,
              color: 'from-pink-500 to-rose-600',
              participants: 25
            },
            { 
              name: 'Gotong Royong', 
              schedule: 'Minggu ke-3, 07:00 WIB', 
              location: 'Seluruh Area',
              icon: Users,
              color: 'from-green-500 to-emerald-600',
              participants: 40
            },
            { 
              name: 'Arisan Ibu-ibu', 
              schedule: 'Minggu ke-2, 15:00 WIB', 
              location: 'Balai Warga',
              icon: Heart,
              color: 'from-purple-500 to-indigo-600',
              participants: 20
            },
            { 
              name: 'Pengajian', 
              schedule: 'Jumat, 19:30 WIB', 
              location: 'Mushola Al-Ikhlas',
              icon: Users,
              color: 'from-teal-500 to-cyan-600',
              participants: 35
            }
          ].map((activity, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className={`bg-gradient-to-r ${activity.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                <activity.icon className="h-8 w-8 text-white" />
              </div>
              
              <h4 className="font-bold text-gray-800 text-center mb-2">{activity.name}</h4>
              <p className="text-sm text-gray-600 text-center mb-3">{activity.schedule}</p>
              
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center justify-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {activity.location}
                </div>
                <div className="flex items-center justify-center">
                  <Users className="h-3 w-3 mr-1" />
                  {activity.participants} peserta
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMarketplace = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Marketplace Warga</h2>
        <p className="text-xl text-gray-600">Jual beli antar warga RT/RW</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            name: 'Nasi Uduk Bu Rina',
            seller: 'Ibu Rina Wati',
            address: 'Blok A No. 15',
            phone: '0821-1111-1111',
            price: 'Rp 8.000',
            rating: 4.8,
            reviews: 45,
            image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
            badge: 'Terlaris',
            badgeColor: 'bg-red-500'
          },
          {
            name: 'Laundry Kilat',
            seller: 'Pak Ahmad Rahman',
            address: 'Blok B No. 8',
            phone: '0821-2222-2222',
            price: 'Rp 5.000/kg',
            rating: 4.9,
            reviews: 32,
            image: 'https://images.pexels.com/photos/963278/pexels-photo-963278.jpeg?auto=compress&cs=tinysrgb&w=400',
            badge: 'Terpercaya',
            badgeColor: 'bg-green-500'
          },
          {
            name: 'Les Privat Kak Dini',
            seller: 'Dini Sari, S.Pd',
            address: 'Blok C No. 12',
            phone: '0821-3333-3333',
            price: 'Rp 75.000/jam',
            rating: 5.0,
            reviews: 28,
            image: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=400',
            badge: 'Favorit',
            badgeColor: 'bg-purple-500'
          },
          {
            name: 'Tukang Servis AC',
            seller: 'Pak Joko Susilo',
            address: 'Blok A No. 7',
            phone: '0821-4444-4444',
            price: 'Rp 100.000',
            rating: 4.7,
            reviews: 18,
            image: 'https://images.pexels.com/photos/8005394/pexels-photo-8005394.jpeg?auto=compress&cs=tinysrgb&w=400',
            badge: 'Profesional',
            badgeColor: 'bg-blue-500'
          },
          {
            name: 'Kue Rumahan Bu Sari',
            seller: 'Ibu Sari Dewi',
            address: 'Blok B No. 20',
            phone: '0821-5555-5555',
            price: 'Rp 25.000/box',
            rating: 4.6,
            reviews: 22,
            image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=400',
            badge: 'Enak',
            badgeColor: 'bg-yellow-500'
          },
          {
            name: 'Taman & Tanaman Hias',
            seller: 'Pak Bambang',
            address: 'Blok C No. 5',
            phone: '0821-6666-6666',
            price: 'Mulai Rp 15.000',
            rating: 4.8,
            reviews: 35,
            image: 'https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg?auto=compress&cs=tinysrgb&w=400',
            badge: 'Hijau',
            badgeColor: 'bg-emerald-500'
          }
        ].map((item, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
            <div className="relative">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className={`absolute top-4 left-4 ${item.badgeColor} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                {item.badge}
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-2">{item.name}</h3>
              
              <div className="flex items-center mb-3">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < Math.floor(item.rating) ? 'fill-current' : ''}`} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {item.rating} ({item.reviews} ulasan)
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {item.seller}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {item.address}
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {item.phone}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">{item.price}</span>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Hubungi</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-semibold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
          Pasang Iklan Gratis
        </button>
      </div>
    </div>
  );

  const renderInformasi = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Informasi RT/RW</h2>
        <p className="text-xl text-gray-600">Informasi penting untuk warga</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Iuran Information */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <DollarSign className="h-6 w-6 mr-2 text-green-500" />
            Iuran Bulanan
          </h3>
          
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">Iuran Kebersihan</span>
                <span className="text-xl font-bold text-green-600">Rp 25.000</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Per bulan, per rumah</p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">Iuran Keamanan</span>
                <span className="text-xl font-bold text-blue-600">Rp 25.000</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Per bulan, per rumah</p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">Total Iuran</span>
                <span className="text-2xl font-bold text-gray-800">Rp 50.000</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Dibayar setiap tanggal 1-10</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-800">Keterlambatan Pembayaran</p>
                <p className="text-sm text-yellow-700">Denda Rp 5.000 setelah tanggal 10</p>
              </div>
            </div>
          </div>
        </div>

        {/* Forms and Links */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-500" />
              Formulir Online
            </h3>
            
            <div className="space-y-4">
              <a 
                href="#" 
                className="block p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800">Surat Keterangan Domisili</h4>
                    <p className="text-sm text-gray-600">Untuk keperluan administrasi</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
              
              <a 
                href="#" 
                className="block p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800">Pengajuan Kegiatan</h4>
                    <p className="text-sm text-gray-600">Untuk acara di lingkungan RT/RW</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
              
              <a 
                href="#" 
                className="block p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800">Laporan Keluhan</h4>
                    <p className="text-sm text-gray-600">Sampaikan keluhan atau saran</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-green-500" />
              Grup WhatsApp
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-2">Grup Utama RT 01/RW 05</h4>
                <p className="text-sm text-gray-600 mb-3">Informasi umum dan pengumuman</p>
                <a 
                  href="https://chat.whatsapp.com/example1" 
                  className="inline-flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Gabung Grup</span>
                </a>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-2">Grup Keamanan</h4>
                <p className="text-sm text-gray-600 mb-3">Koordinasi keamanan lingkungan</p>
                <a 
                  href="https://chat.whatsapp.com/example2" 
                  className="inline-flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Shield className="h-4 w-4" />
                  <span>Gabung Grup</span>
                </a>
              </div>
              
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-2">Grup Ibu-ibu</h4>
                <p className="text-sm text-gray-600 mb-3">Arisan dan kegiatan ibu-ibu</p>
                <a 
                  href="https://chat.whatsapp.com/example3" 
                  className="inline-flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <Heart className="h-4 w-4" />
                  <span>Gabung Grup</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Facilities */}
      <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Fasilitas RT/RW</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Camera, name: 'CCTV', desc: '12 titik pemantauan', color: 'from-blue-500 to-blue-600' },
            { icon: Lightbulb, name: 'Penerangan Jalan', desc: '24 jam aktif', color: 'from-yellow-500 to-orange-600' },
            { icon: Droplets, name: 'Sumur Bor', desc: 'Air bersih 24 jam', color: 'from-cyan-500 to-blue-600' },
            { icon: Recycle, name: 'Bank Sampah', desc: 'Kelola sampah mandiri', color: 'from-green-500 to-emerald-600' }
          ].map((facility, index) => (
            <div key={index} className="text-center">
              <div className={`bg-gradient-to-r ${facility.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <facility.icon className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">{facility.name}</h4>
              <p className="text-sm text-gray-600">{facility.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderKontak = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Kontak RT/RW</h2>
        <p className="text-xl text-gray-600">Hubungi pengurus untuk informasi lebih lanjut</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Cards */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
            <div className="flex items-center mb-6">
              <div className="bg-white/20 p-3 rounded-xl mr-4">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Ketua RT 01</h3>
                <p className="opacity-90">Bapak Budi Santoso</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3" />
                <span>0821-1234-5678</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3" />
                <span>ketua.rt01@gmail.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-3" />
                <span>Blok A No. 1, Cluster Kalita</span>
              </div>
            </div>
            
            <button className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors w-full">
              Hubungi Sekarang
            </button>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white">
            <div className="flex items-center mb-6">
              <div className="bg-white/20 p-3 rounded-xl mr-4">
                <FileText className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Sekretaris RT 01</h3>
                <p className="opacity-90">Ibu Siti Aminah</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3" />
                <span>0821-2345-6789</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3" />
                <span>sekretaris.rt01@gmail.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-3" />
                <span>Blok B No. 5, Cluster Kalita</span>
              </div>
            </div>
            
            <button className="mt-6 bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors w-full">
              Hubungi Sekarang
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-8 text-white">
            <div className="flex items-center mb-6">
              <div className="bg-white/20 p-3 rounded-xl mr-4">
                <DollarSign className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Bendahara RT 01</h3>
                <p className="opacity-90">Bapak Ahmad Rahman</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3" />
                <span>0821-3456-7890</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3" />
                <span>bendahara.rt01@gmail.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-3" />
                <span>Blok C No. 8, Cluster Kalita</span>
              </div>
            </div>
            
            <button className="mt-6 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors w-full">
              Hubungi Sekarang
            </button>
          </div>
        </div>

        {/* Location and Office Hours */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <MapPin className="h-6 w-6 mr-2 text-red-500" />
              Alamat RT/RW
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-2">Kantor RT 01 / RW 05</h4>
                <p className="text-gray-600">
                  Jl. Cluster Kalita Harmonis<br/>
                  RT 01 / RW 05<br/>
                  Kelurahan Kalita<br/>
                  Kecamatan Harmonis<br/>
                  Kota Bahagia 12345
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-2">Jam Pelayanan</h4>
                <div className="space-y-1 text-gray-600">
                  <p>Senin - Jumat: 19:00 - 21:00 WIB</p>
                  <p>Sabtu: 15:00 - 17:00 WIB</p>
                  <p>Minggu: Libur</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <MessageSquare className="h-6 w-6 mr-2 text-green-500" />
              Layanan Darurat
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl">
                <div>
                  <h4 className="font-semibold text-red-800">Keamanan 24 Jam</h4>
                  <p className="text-sm text-red-600">Pos Satpam Cluster</p>
                </div>
                <a 
                  href="tel:0821-9999-9999" 
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Call
                </a>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div>
                  <h4 className="font-semibold text-blue-800">Maintenance</h4>
                  <p className="text-sm text-blue-600">Listrik, Air, Fasilitas</p>
                </div>
                <a 
                  href="tel:0821-8888-8888" 
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Call
                </a>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                <div>
                  <h4 className="font-semibold text-green-800">Kebersihan</h4>
                  <p className="text-sm text-green-600">Sampah, Drainase</p>
                </div>
                <a 
                  href="tel:0821-7777-7777" 
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Call
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Kirim Pesan</h3>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Nama lengkap"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pesan</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Tulis pesan Anda..."
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                Kirim Pesan
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (activeSection === 'detail-berita' && selectedNews) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
          <div className="container mx-auto px-4 py-8">
            <button
              onClick={handleBackToHome}
              className="mb-6 flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Kembali ke Beranda
            </button>
            
            <article className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedNews.category === 'PENTING' ? 'bg-red-500' :
                    selectedNews.category === 'KEGIATAN' ? 'bg-green-500' :
                    selectedNews.category === 'PENGUMUMAN' ? 'bg-purple-500' :
                    selectedNews.category === 'INFORMASI' ? 'bg-yellow-500' :
                    selectedNews.category === 'SOSIAL' ? 'bg-teal-500' :
                    'bg-pink-500'
                  }`}>
                    {selectedNews.category}
                  </span>
                  <span className="text-emerald-100 text-sm">{selectedNews.date}</span>
                </div>
                <h1 className="text-3xl font-bold mb-4">{selectedNews.title}</h1>
                <div className="flex items-center gap-2 text-emerald-100">
                  <User className="w-4 h-4" />
                  <span className="text-sm">Oleh: {selectedNews.author}</span>
                </div>
              </div>
              
              <div className="p-8">
                <div className="prose max-w-none">
                  {selectedNews.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Dipublikasikan: {selectedNews.date}
                    </div>
                    <button className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors">
                      <Printer className="w-4 h-4" />
                      Cetak Berita
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      );
    }

    if (activeSection === 'semua-berita') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
          <div className="container mx-auto px-4 py-8">
            <button
              onClick={handleBackToHome}
              className="mb-6 flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Kembali ke Beranda
            </button>
            
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Semua Berita Warga</h1>
              <p className="text-gray-600">Informasi terkini dari Paguyuban Cluster Kalita</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
                  <div className={`h-2 ${
                    item.category === 'PENTING' ? 'bg-red-500' :
                    item.category === 'KEGIATAN' ? 'bg-green-500' :
                    item.category === 'PENGUMUMAN' ? 'bg-purple-500' :
                    item.category === 'INFORMASI' ? 'bg-yellow-500' :
                    item.category === 'SOSIAL' ? 'bg-teal-500' :
                    'bg-pink-500'
                  }`}></div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.category === 'PENTING' ? 'bg-red-100 text-red-800' :
                        item.category === 'KEGIATAN' ? 'bg-green-100 text-green-800' :
                        item.category === 'PENGUMUMAN' ? 'bg-purple-100 text-purple-800' :
                        item.category === 'INFORMASI' ? 'bg-yellow-100 text-yellow-800' :
                        item.category === 'SOSIAL' ? 'bg-teal-100 text-teal-800' :
                        'bg-pink-100 text-pink-800'
                      }`}>
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-500">{item.date}</span>
                    </div>
                    
                    <h3 className="font-bold text-lg mb-3 text-gray-800 line-clamp-2">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {item.content}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                      <User className="w-3 h-3" />
                      <span>{item.author}</span>
                    </div>
                    
                    <button
                      onClick={() => handleReadMore(item)}
                      className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors text-sm font-medium"
                    >
                      Baca selengkapnya
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case 'beranda':
        return renderBeranda();
      case 'warga':
        return renderDataWarga();
      case 'kegiatan':
        return renderKegiatan();
      case 'marketplace':
        return renderMarketplace();
      case 'informasi':
        return renderInformasi();
      case 'kontak':
        return renderKontak();
      default:
        return renderBeranda();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderNavigation()}
      <main>
        {renderContent()}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-xl">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">RT 01 / RW 05</h3>
                  <p className="text-gray-400">Cluster Kalita Harmonis</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Mewujudkan lingkungan yang aman, nyaman, dan harmonis untuk seluruh warga RT 01 / RW 05 Cluster Kalita.
              </p>
              <div className="flex space-x-4">
                <div className="bg-gray-700 p-2 rounded-lg">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div className="bg-gray-700 p-2 rounded-lg">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="bg-gray-700 p-2 rounded-lg">
                  <Phone className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Menu Utama</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => setActiveSection('beranda')} className="hover:text-white transition-colors">Beranda</button></li>
                <li><button onClick={() => setActiveSection('warga')} className="hover:text-white transition-colors">Data Warga</button></li>
                <li><button onClick={() => setActiveSection('kegiatan')} className="hover:text-white transition-colors">Kegiatan</button></li>
                <li><button onClick={() => setActiveSection('marketplace')} className="hover:text-white transition-colors">Marketplace</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Ketua RT: 0821-1234-5678</li>
                <li>Sekretaris: 0821-2345-6789</li>
                <li>Bendahara: 0821-3456-7890</li>
                <li>rt01rw05@gmail.com</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 RT 01 / RW 05 Cluster Kalita Harmonis. Semua hak dilindungi.</p>
            {isAdminMode && (
              <p className="mt-2 text-green-400 text-sm">
                🔧 Mode Admin Aktif - Anda dapat mengelola konten website
              </p>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;