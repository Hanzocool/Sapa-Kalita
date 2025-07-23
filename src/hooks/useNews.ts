import { useState, useEffect } from 'react';
import { News, NewsCategory, newsService, categoriesService } from '../lib/supabase';

export function useNews() {
  const [news, setNews] = useState<News[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async (limit = 10, offset = 0) => {
    try {
      setLoading(true);
      const { data, error } = await newsService.getPublishedNews(limit, offset);
      
      if (error) throw error;
      
      setNews(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await categoriesService.getAll();
      
      if (error) throw error;
      
      setCategories(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    }
  };

  const fetchImportantNews = async () => {
    try {
      const { data, error } = await newsService.getImportantNews();
      
      if (error) throw error;
      
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      return [];
    }
  };

  const fetchNewsByCategory = async (categoryId: string, limit = 10) => {
    try {
      setLoading(true);
      const { data, error } = await newsService.getNewsByCategory(categoryId, limit);
      
      if (error) throw error;
      
      setNews(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    fetchCategories();
  }, []);

  return {
    news,
    categories,
    loading,
    error,
    fetchNews,
    fetchCategories,
    fetchImportantNews,
    fetchNewsByCategory,
    refetch: () => {
      fetchNews();
      fetchCategories();
    }
  };
}

export function useNewsDetail(newsId: string) {
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNewsDetail = async () => {
    try {
      setLoading(true);
      const { data, error } = await newsService.getNewsById(newsId);
      
      if (error) throw error;
      
      setNews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (newsId) {
      fetchNewsDetail();
    }
  }, [newsId]);

  return {
    news,
    loading,
    error,
    refetch: fetchNewsDetail
  };
}