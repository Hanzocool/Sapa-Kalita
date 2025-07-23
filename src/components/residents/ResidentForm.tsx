import React, { useState, useEffect } from 'react';
import { User, Phone, Home, Users, Briefcase, AlertTriangle, Car, FileText, Eye, EyeOff } from 'lucide-react';
import { useCurrentResident } from '../../hooks/useResidents';
import { ResidentInfo } from '../../lib/supabase';

interface ResidentFormProps {
  onSuccess?: () => void;
}

export function ResidentForm({ onSuccess }: ResidentFormProps) {
  const { resident, loading, saveResident } = useCurrentResident();
  const [formData, setFormData] = useState<Partial<ResidentInfo>>({
    full_name: '',
    phone: '',
    house_number: '',
    block: '',
    family_members: 1,
    occupation: '',
    emergency_contact: '',
    vehicle_info: '',
    notes: '',
    is_public: true
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (resident) {
      setFormData(resident);
    }
  }, [resident]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const result = await saveResident(formData);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Data warga berhasil disimpan!' });
      onSuccess?.();
    } else {
      setMessage({ type: 'error', text: result.error || 'Gagal menyimpan data' });
    }
    
    setSaving(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : 
               type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse text-gray-500">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {resident ? 'Edit Informasi Warga' : 'Daftar Informasi Warga'}
        </h2>
        <p className="text-gray-600">
          Lengkapi data diri Anda untuk direktori warga Cluster Kalita
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nama Lengkap */}
          <div className="md:col-span-2">
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="full_name"
                name="full_name"
                type="text"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>
          </div>

          {/* Nomor Telepon */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Nomor Telepon
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="08xxxxxxxxxx"
              />
            </div>
          </div>

          {/* Blok */}
          <div>
            <label htmlFor="block" className="block text-sm font-medium text-gray-700 mb-2">
              Blok *
            </label>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                id="block"
                name="block"
                value={formData.block}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Pilih Blok</option>
                <option value="A">Blok A</option>
                <option value="B">Blok B</option>
                <option value="C">Blok C</option>
                <option value="D">Blok D</option>
                <option value="E">Blok E</option>
              </select>
            </div>
          </div>

          {/* Nomor Rumah */}
          <div>
            <label htmlFor="house_number" className="block text-sm font-medium text-gray-700 mb-2">
              Nomor Rumah *
            </label>
            <input
              id="house_number"
              name="house_number"
              type="text"
              value={formData.house_number}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Contoh: 15"
              required
            />
          </div>

          {/* Jumlah Anggota Keluarga */}
          <div>
            <label htmlFor="family_members" className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah Anggota Keluarga
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="family_members"
                name="family_members"
                type="number"
                min="1"
                value={formData.family_members}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Pekerjaan */}
          <div className="md:col-span-2">
            <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-2">
              Pekerjaan
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="occupation"
                name="occupation"
                type="text"
                value={formData.occupation}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Contoh: Karyawan Swasta"
              />
            </div>
          </div>

          {/* Kontak Darurat */}
          <div className="md:col-span-2">
            <label htmlFor="emergency_contact" className="block text-sm font-medium text-gray-700 mb-2">
              Kontak Darurat
            </label>
            <div className="relative">
              <AlertTriangle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="emergency_contact"
                name="emergency_contact"
                type="text"
                value={formData.emergency_contact}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Nama & No. Telp kontak darurat"
              />
            </div>
          </div>

          {/* Informasi Kendaraan */}
          <div className="md:col-span-2">
            <label htmlFor="vehicle_info" className="block text-sm font-medium text-gray-700 mb-2">
              Informasi Kendaraan
            </label>
            <div className="relative">
              <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="vehicle_info"
                name="vehicle_info"
                type="text"
                value={formData.vehicle_info}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Contoh: Mobil Avanza B 1234 XYZ, Motor Vario B 5678 ABC"
              />
            </div>
          </div>

          {/* Catatan */}
          <div className="md:col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Catatan Tambahan
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Catatan atau informasi tambahan..."
              />
            </div>
          </div>

          {/* Tampil ke Publik */}
          <div className="md:col-span-2">
            <div className="flex items-center">
              <input
                id="is_public"
                name="is_public"
                type="checkbox"
                checked={formData.is_public}
                onChange={handleChange}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
              />
              <label htmlFor="is_public" className="ml-3 flex items-center text-sm text-gray-700">
                {formData.is_public ? (
                  <Eye className="w-4 h-4 mr-1 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 mr-1 text-gray-400" />
                )}
                Tampilkan informasi saya di direktori publik warga
              </label>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Jika dicentang, informasi Anda akan terlihat oleh warga lain di direktori
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Menyimpan...' : (resident ? 'Update Data' : 'Simpan Data')}
        </button>
      </form>
    </div>
  );
}