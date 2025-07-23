import React from 'react';
import { User, Phone, Home, Users, Briefcase, AlertTriangle, Car, FileText } from 'lucide-react';
import { ResidentInfo } from '../../lib/supabase';

interface ResidentCardProps {
  resident: ResidentInfo;
}

export function ResidentCard({ resident }: ResidentCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-green-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-800">{resident.full_name}</h3>
            <div className="flex items-center text-sm text-gray-600">
              <Home className="w-4 h-4 mr-1" />
              Blok {resident.block} No. {resident.house_number}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {resident.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            <a href={`tel:${resident.phone}`} className="hover:text-green-600 transition-colors">
              {resident.phone}
            </a>
          </div>
        )}

        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2 text-gray-400" />
          {resident.family_members} anggota keluarga
        </div>

        {resident.occupation && (
          <div className="flex items-center text-sm text-gray-600">
            <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
            {resident.occupation}
          </div>
        )}

        {resident.emergency_contact && (
          <div className="flex items-start text-sm text-gray-600">
            <AlertTriangle className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">Kontak Darurat:</div>
              <div>{resident.emergency_contact}</div>
            </div>
          </div>
        )}

        {resident.vehicle_info && (
          <div className="flex items-start text-sm text-gray-600">
            <Car className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">Kendaraan:</div>
              <div>{resident.vehicle_info}</div>
            </div>
          </div>
        )}

        {resident.notes && (
          <div className="flex items-start text-sm text-gray-600">
            <FileText className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">Catatan:</div>
              <div>{resident.notes}</div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-400">
          Terdaftar: {new Date(resident.created_at).toLocaleDateString('id-ID')}
        </div>
      </div>
    </div>
  );
}