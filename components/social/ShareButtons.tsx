'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Twitter,
  Linkedin,
  Facebook,
  Mail,
  Link as LinkIcon,
  Share2,
  Check,
  MessageCircle,
  Send,
} from 'lucide-react';
import { openShareDialog, nativeShare, canUseWebShare, copyToClipboard, type ShareData } from '@/lib/social-share';

interface ShareButtonsProps {
  data: ShareData;
  layout?: 'horizontal' | 'vertical';
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function ShareButtons({
  data,
  layout = 'horizontal',
  showLabels = false,
  size = 'md',
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showNativeShare, setShowNativeShare] = useState(false);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(data.url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    const success = await nativeShare(data);
    if (!success) {
      // Fallback to showing other share options
      console.log('Native share not available');
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const shareButtons = [
    {
      name: 'Twitter',
      icon: Twitter,
      platform: 'twitter' as const,
      color: 'hover:bg-blue-500',
      bgColor: 'bg-blue-500/20',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      platform: 'linkedin' as const,
      color: 'hover:bg-blue-700',
      bgColor: 'bg-blue-700/20',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      platform: 'facebook' as const,
      color: 'hover:bg-blue-600',
      bgColor: 'bg-blue-600/20',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      platform: 'whatsapp' as const,
      color: 'hover:bg-green-500',
      bgColor: 'bg-green-500/20',
    },
    {
      name: 'Telegram',
      icon: Send,
      platform: 'telegram' as const,
      color: 'hover:bg-blue-400',
      bgColor: 'bg-blue-400/20',
    },
    {
      name: 'Email',
      icon: Mail,
      platform: 'email' as const,
      color: 'hover:bg-gray-600',
      bgColor: 'bg-gray-600/20',
    },
  ];

  return (
    <div
      className={`flex ${
        layout === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
      } gap-2 items-center`}
    >
      {/* Native Share (Mobile) */}
      {canUseWebShare() && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNativeShare}
          className={`${sizeClasses[size]} glass hover:bg-primary-500 transition-colors rounded-lg flex items-center justify-center group`}
          title="Share"
        >
          <Share2 className={iconSizes[size]} />
        </motion.button>
      )}

      {/* Social Platform Buttons */}
      {shareButtons.map((button, index) => {
        const Icon = button.icon;
        return (
          <motion.button
            key={button.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openShareDialog(button.platform, data)}
            className={`${sizeClasses[size]} glass ${button.color} transition-colors rounded-lg flex items-center justify-center group ${
              showLabels ? 'px-4 gap-2' : ''
            }`}
            title={`Share on ${button.name}`}
          >
            <Icon className={iconSizes[size]} />
            {showLabels && <span className="text-sm">{button.name}</span>}
          </motion.button>
        );
      })}

      {/* Copy Link Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: shareButtons.length * 0.05 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCopyLink}
        className={`${sizeClasses[size]} glass ${
          copied ? 'bg-green-500' : 'hover:bg-dark-600'
        } transition-colors rounded-lg flex items-center justify-center group ${
          showLabels ? 'px-4 gap-2' : ''
        }`}
        title={copied ? 'Copied!' : 'Copy link'}
      >
        {copied ? (
          <Check className={iconSizes[size]} />
        ) : (
          <LinkIcon className={iconSizes[size]} />
        )}
        {showLabels && <span className="text-sm">{copied ? 'Copied!' : 'Copy Link'}</span>}
      </motion.button>
    </div>
  );
}
