export interface DevToArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  published_at: string;
  cover_image?: string;
  tag_list: string[];
  reading_time_minutes: number;
  public_reactions_count: number;
}

export async function getDevToArticles(username: string): Promise<DevToArticle[]> {
  try {
    const response = await fetch(
      `https://dev.to/api/articles?username=${username}&per_page=6`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: {
          revalidate: 3600, // Revalidate every hour
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Dev.to articles');
    }

    const articles: DevToArticle[] = await response.json();
    return articles;
  } catch (error) {
    console.error('Error fetching Dev.to articles:', error);
    return [];
  }
}
