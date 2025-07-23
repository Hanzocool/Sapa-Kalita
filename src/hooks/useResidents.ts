import { useState, useEffect } from 'react';
import { ResidentInfo, residentService } from '../lib/supabase';

export function useResidents() {
  const [residents, setResidents] = useState<ResidentInfo[]>([]);
  const [blocks, setBlocks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResidents = async () => {
    try {
      setLoading(true);
      const { data, error } = await residentService.getPublicResidents();
      
      if (error) throw error;
      
      setResidents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const fetchBlocks = async () => {
    try {
      const { data, error } = await residentService.getBlocks();
      
      if (error) throw error;
      
      setBlocks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    }
  };

  const fetchResidentsByBlock = async (block: string) => {
    try {
      setLoading(true);
      const { data, error } = await residentService.getResidentsByBlock(block);
      
      if (error) throw error;
      
      setResidents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents();
    fetchBlocks();
  }, []);

  return {
    residents,
    blocks,
    loading,
    error,
    fetchResidents,
    fetchBlocks,
    fetchResidentsByBlock,
    refetch: () => {
      fetchResidents();
      fetchBlocks();
    }
  };
}

export function useCurrentResident() {
  const [resident, setResident] = useState<ResidentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentResident = async () => {
    try {
      setLoading(true);
      const { data, error } = await residentService.getCurrentUserResident();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }
      
      setResident(data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const saveResident = async (residentData: Partial<ResidentInfo>) => {
    try {
      setLoading(true);
      const { data, error } = await residentService.upsertResident(residentData);
      
      if (error) throw error;
      
      setResident(data);
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentResident();
  }, []);

  return {
    resident,
    loading,
    error,
    saveResident,
    refetch: fetchCurrentResident
  };
}