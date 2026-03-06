'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ShareButtons from '@/components/social/ShareButtons';
import type { ShareData } from '@/lib/social-share';

interface FloatingShareSidebarProps {
  data: ShareData;
}

export default function FloatingShareSidebar({ data }: FloatingShareSidebarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
        >
          <div className="glass rounded-xl p-3">
            <ShareButtons data={data} layout="vertical" size="md" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
