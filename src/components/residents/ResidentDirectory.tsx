import React, { useState } from 'react';
import { Search, Filter, Users, Home } from 'lucide-react';
import { useResidents } from '../../hooks/useResidents';
import { ResidentCard } from './ResidentCard';

export function ResidentDirectory() {
  const { residents, blocks, loading, fetchResidentsByBlock, fetchResidents } = useResidents();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');

  const filteredResidents = residents.filter(resident => {
    const matchesSearch = resident.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resident.house_number.includes(searchTerm) ||
                         resident.occupation.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleBlockFilter = async (block: string) => {
    setSelectedBlock(block);
    if (block) {
      await fetchResidentsByBlock(block);
    } else {
      await fetchResidents();
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="ml-3 flex-1">
                  <div className="h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Direktori Warga</h1>
        <p className="text-gray-600">Informasi warga Cluster Kalita</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 text-white">
          <div className="flex items-center">
            <Users className="w-8 h-8 mr-3" />
            <div>
              <div className="text-2xl font-bold">{residents.length}</div>
              <div className="text-green-100">Total Warga</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg p-6 text-white">
          <div className="flex items-center">
            <Home className="w-8 h-8 mr-3" />
            <div>
              <div className="text-2xl font-bold">{blocks.length}</div>
              <div className="text-blue-100">Total Blok</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center">
            <Users className="w-8 h-8 mr-3" />
            <div>
              <div className="text-2xl font-bold">
                {residents.reduce((sum, r) => sum + r.family_members, 0)}
              </div>
              <div className="text-purple-100">Total Jiwa</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari nama, nomor rumah, atau pekerjaan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Block Filter */}
          <div className="md:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedBlock}
                onChange={(e) => handleBlockFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
              >
                <option value="">Semua Blok</option>
                {blocks.map(block => (
                  <option key={block} value={block}>Blok {block}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredResidents.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Users className="w-16 h-16 mx-auto" />
          </div>
          <p className="text-gray-500 text-lg">
            {searchTerm || selectedBlock ? 'Tidak ada warga yang sesuai dengan pencarian' : 'Belum ada data warga'}
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Menampilkan {filteredResidents.length} dari {residents.length} warga
              {selectedBlock && ` di Blok ${selectedBlock}`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResidents.map((resident) => (
              <ResidentCard key={resident.id} resident={resident} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}