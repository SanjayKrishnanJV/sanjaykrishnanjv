'use client';

import ShareButtons from '@/components/social/ShareButtons';
import { Share2 } from 'lucide-react';

interface BlogShareButtonsProps {
  title: string;
  description: string;
  slug: string;
  tags?: string[];
}

export default function BlogShareButtons({ title, description, slug, tags }: BlogShareButtonsProps) {
  const url = `${typeof window !== 'undefined' ? window.location.origin : 'https://www.sanjaykrishnanjv.com'}/blog/${slug}`;

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Share2 className="w-5 h-5 text-primary-400" />
        <h3 className="text-lg font-semibold">Share this article</h3>
      </div>
      <ShareButtons
        data={{
          url,
          title,
          description,
          hashtags: tags,
        }}
        showLabels
      />
    </div>
  );
}
