import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface NewsCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  created_at: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  category_id: string;
  author_id: string;
  status: 'draft' | 'published' | 'archived';
  priority: 'normal' | 'important' | 'urgent';
  published_at: string | null;
  created_at: string;
  updated_at: string;
  category?: NewsCategory;
  author?: {
    id: string;
    email: string;
    full_name?: string;
  };
  comments_count?: number;
}

export interface NewsComment {
  id: string;
  news_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: {
    id: string;
    email: string;
    full_name?: string;
  };
}

export interface ResidentInfo {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  house_number: string;
  block: string;
  family_members: number;
  occupation: string;
  emergency_contact: string;
  vehicle_info: string;
  notes: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

// Auth helper functions
export const auth = {
  signUp: async (email: string, password: string, fullName: string) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'user'
        }
      }
    });
  },

  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  getCurrentUser: () => {
    return supabase.auth.getUser();
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// News helper functions
export const newsService = {
  // Get all published news with categories
  getPublishedNews: async (limit = 10, offset = 0) => {
    const { data, error } = await supabase
      .from('news')
      .select(`
        *,
        category:news_categories(*),
        author:auth.users(id, email, raw_user_meta_data)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    return { data, error };
  },

  // Get news by category
  getNewsByCategory: async (categoryId: string, limit = 10) => {
    const { data, error } = await supabase
      .from('news')
      .select(`
        *,
        category:news_categories(*),
        author:auth.users(id, email, raw_user_meta_data)
      `)
      .eq('status', 'published')
      .eq('category_id', categoryId)
      .order('published_at', { ascending: false })
      .limit(limit);

    return { data, error };
  },

  // Get single news with comments
  getNewsById: async (id: string) => {
    const { data, error } = await supabase
      .from('news')
      .select(`
        *,
        category:news_categories(*),
        author:auth.users(id, email, raw_user_meta_data),
        comments:news_comments(
          *,
          user:auth.users(id, email, raw_user_meta_data)
        )
      `)
      .eq('id', id)
      .single();

    return { data, error };
  },

  // Create news (admin/author only)
  createNews: async (newsData: Partial<News>) => {
    const { data, error } = await supabase
      .from('news')
      .insert([newsData])
      .select()
      .single();

    return { data, error };
  },

  // Update news
  updateNews: async (id: string, updates: Partial<News>) => {
    const { data, error } = await supabase
      .from('news')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  // Delete news
  deleteNews: async (id: string) => {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);

    return { error };
  },

  // Get urgent/important news
  getImportantNews: async () => {
    const { data, error } = await supabase
      .from('news')
      .select(`
        *,
        category:news_categories(*)
      `)
      .eq('status', 'published')
      .in('priority', ['important', 'urgent'])
      .order('priority', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(5);

    return { data, error };
  }
};

// Categories helper functions
export const categoriesService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('news_categories')
      .select('*')
      .order('name');

    return { data, error };
  },

  create: async (category: Partial<NewsCategory>) => {
    const { data, error } = await supabase
      .from('news_categories')
      .insert([category])
      .select()
      .single();

    return { data, error };
  }
};

// Comments helper functions
export const commentsService = {
  // Add comment to news
  addComment: async (newsId: string, content: string) => {
    const { data, error } = await supabase
      .from('news_comments')
      .insert([{
        news_id: newsId,
        content,
        user_id: (await supabase.auth.getUser()).data.user?.id
      }])
      .select(`
        *,
        user:auth.users(id, email, raw_user_meta_data)
      `)
      .single();

    return { data, error };
  },

  // Get comments for news
  getComments: async (newsId: string) => {
    const { data, error } = await supabase
      .from('news_comments')
      .select(`
        *,
        user:auth.users(id, email, raw_user_meta_data)
      `)
      .eq('news_id', newsId)
      .order('created_at', { ascending: true });

    return { data, error };
  },

  // Delete comment
  deleteComment: async (id: string) => {
    const { error } = await supabase
      .from('news_comments')
      .delete()
      .eq('id', id);

    return { error };
  }
};

// Resident Info helper functions
export const residentService = {
  // Get all public resident info
  getPublicResidents: async () => {
    const { data, error } = await supabase
      .from('resident_info')
      .select('*')
      .eq('is_public', true)
      .order('block', { ascending: true })
      .order('house_number', { ascending: true });

    return { data, error };
  },

  // Get resident info by block
  getResidentsByBlock: async (block: string) => {
    const { data, error } = await supabase
      .from('resident_info')
      .select('*')
      .eq('is_public', true)
      .eq('block', block)
      .order('house_number', { ascending: true });

    return { data, error };
  },

  // Get current user's resident info
  getCurrentUserResident: async () => {
    const { data, error } = await supabase
      .from('resident_info')
      .select('*')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .single();

    return { data, error };
  },

  // Create or update resident info
  upsertResident: async (residentData: Partial<ResidentInfo>) => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');

    const dataWithUserId = {
      ...residentData,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('resident_info')
      .upsert(dataWithUserId, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    return { data, error };
  },

  // Delete resident info
  deleteResident: async (id: string) => {
    const { error } = await supabase
      .from('resident_info')
      .delete()
      .eq('id', id);

    return { error };
  },

  // Get blocks list
  getBlocks: async () => {
    const { data, error } = await supabase
      .from('resident_info')
      .select('block')
      .eq('is_public', true);

    if (error) return { data: [], error };

    const uniqueBlocks = [...new Set(data?.map(item => item.block) || [])].sort();
    return { data: uniqueBlocks, error: null };
  }
};