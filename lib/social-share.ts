export interface ShareData {
  url: string;
  title: string;
  description?: string;
  hashtags?: string[];
}

// Generate share URLs for different platforms
export const generateShareUrls = (data: ShareData) => {
  const encodedUrl = encodeURIComponent(data.url);
  const encodedTitle = encodeURIComponent(data.title);
  const encodedDescription = encodeURIComponent(data.description || '');
  const hashtags = data.hashtags?.join(',') || '';

  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}${
      hashtags ? `&hashtags=${hashtags}` : ''
    }`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    hackernews: `https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
  };
};

// Open share dialog
export const openShareDialog = (platform: keyof ReturnType<typeof generateShareUrls>, data: ShareData) => {
  const urls = generateShareUrls(data);
  const url = urls[platform];

  if (platform === 'email') {
    window.location.href = url;
  } else {
    const width = 600;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      url,
      'share-dialog',
      `width=${width},height=${height},left=${left},top=${top},toolbar=0,status=0`
    );
  }
};

// Check if Web Share API is available
export const canUseWebShare = (): boolean => {
  return typeof navigator !== 'undefined' && 'share' in navigator;
};

// Use native Web Share API
export const nativeShare = async (data: ShareData): Promise<boolean> => {
  if (!canUseWebShare()) {
    return false;
  }

  try {
    await navigator.share({
      title: data.title,
      text: data.description,
      url: data.url,
    });
    return true;
  } catch (error) {
    // User cancelled or share failed
    return false;
  }
};

// Copy to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!navigator.clipboard) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (error) {
      document.body.removeChild(textArea);
      return false;
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    return false;
  }
};
