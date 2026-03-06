export interface LinkedInPost {
  id: string;
  title: string;
  content: string;
  url: string;
  publishedAt: string;
  image?: string;
  likes?: number;
  comments?: number;
  reposts?: number;
}

export async function getLinkedInPosts(): Promise<LinkedInPost[]> {
  try {
    const response = await fetch('/api/linkedin-posts', {
      next: {
        revalidate: 3600, // Revalidate every hour
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch LinkedIn posts');
    }

    const posts: LinkedInPost[] = await response.json();
    return posts;
  } catch (error) {
    console.error('Error fetching LinkedIn posts:', error);
    return [];
  }
}
