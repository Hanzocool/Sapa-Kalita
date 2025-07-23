import React from 'react';
import { Calendar, User, MessageCircle, AlertCircle } from 'lucide-react';
import { News } from '../../lib/supabase';

interface NewsCardProps {
  news: News;
  onClick?: () => void;
  showExcerpt?: boolean;
}

export function NewsCard({ news, onClick, showExcerpt = true }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'important':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'urgent' || priority === 'important') {
      return <AlertCircle className="w-4 h-4" />;
    }
    return null;
  };

  return (
    <article 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      {news.image_url && (
        <div className="aspect-video overflow-hidden">
          <img
            src={news.image_url}
            alt={news.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          {news.category && (
            <span 
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: `${news.category.color}20`,
                color: news.category.color 
              }}
            >
              {news.category.name}
            </span>
          )}
          
          {news.priority !== 'normal' && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getPriorityColor(news.priority)}`}>
              {getPriorityIcon(news.priority)}
              {news.priority === 'urgent' ? 'Mendesak' : 'Penting'}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 hover:text-green-600 transition-colors">
          {news.title}
        </h3>

        {showExcerpt && news.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {news.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(news.published_at || news.created_at)}
            </div>
            
            {news.author && (
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {news.author.full_name || news.author.email}
              </div>
            )}
          </div>

          {news.comments_count !== undefined && (
            <div className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-1" />
              {news.comments_count}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}