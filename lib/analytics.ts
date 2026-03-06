export interface VisitorStats {
  totalVisits: number;
  uniqueVisitors: number;
  lastVisit: string;
  firstVisit: string;
  pageViews: Record<string, number>;
}

const STORAGE_KEY = 'portfolio_visitor_stats';
const VISITOR_ID_KEY = 'portfolio_visitor_id';

// Generate a unique visitor ID
function generateVisitorId(): string {
  return `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get or create visitor ID
function getVisitorId(): string {
  if (typeof window === 'undefined') return '';

  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = generateVisitorId();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
}

// Get current stats
export function getVisitorStats(): VisitorStats {
  if (typeof window === 'undefined') {
    return {
      totalVisits: 0,
      uniqueVisitors: 0,
      lastVisit: new Date().toISOString(),
      firstVisit: new Date().toISOString(),
      pageViews: {},
    };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return {
      totalVisits: 0,
      uniqueVisitors: 0,
      lastVisit: new Date().toISOString(),
      firstVisit: new Date().toISOString(),
      pageViews: {},
    };
  }

  try {
    return JSON.parse(stored);
  } catch {
    return {
      totalVisits: 0,
      uniqueVisitors: 0,
      lastVisit: new Date().toISOString(),
      firstVisit: new Date().toISOString(),
      pageViews: {},
    };
  }
}

// Track a page view
export function trackPageView(page: string = '/'): VisitorStats {
  if (typeof window === 'undefined') {
    return getVisitorStats();
  }

  const stats = getVisitorStats();
  const now = new Date().toISOString();

  // Update stats
  stats.totalVisits += 1;
  stats.lastVisit = now;

  // Track first visit if not set
  if (!stats.firstVisit || stats.totalVisits === 1) {
    stats.firstVisit = now;
  }

  // Track page views
  if (!stats.pageViews) {
    stats.pageViews = {};
  }
  stats.pageViews[page] = (stats.pageViews[page] || 0) + 1;

  // Simulate unique visitors (in real app, this would be server-side)
  // For demo, we'll estimate based on totalVisits
  stats.uniqueVisitors = Math.ceil(stats.totalVisits * 0.7); // Roughly 70% unique

  // Save to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));

  return stats;
}

// Reset stats (for testing)
export function resetVisitorStats(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(VISITOR_ID_KEY);
  }
}

// Get global stats (simulated - in production, fetch from API)
export function getGlobalStats(): {
  totalVisitors: number;
  totalPageViews: number;
  averageTimeOnSite: string;
  topPages: Array<{ page: string; views: number }>;
} {
  const stats = getVisitorStats();

  // Use consistent seed based on unique visitors for deterministic "random" values
  const seed = stats.uniqueVisitors || 1;
  const pseudoRandom1 = (seed * 9301 + 49297) % 233280;
  const pseudoRandom2 = (seed * 7919 + 36461) % 233280;

  return {
    totalVisitors: stats.totalVisits + (stats.totalVisits > 0 ? Math.floor(pseudoRandom1 / 233) : 1247),
    totalPageViews: stats.totalVisits * 3 + (stats.totalVisits > 0 ? Math.floor(pseudoRandom2 / 47) : 3841),
    averageTimeOnSite: '3m 24s',
    topPages: Object.entries(stats.pageViews || {})
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5),
  };
}

// Format large numbers
export function formatCount(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}
