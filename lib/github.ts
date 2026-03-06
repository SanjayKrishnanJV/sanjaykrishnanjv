export interface GitHubContribution {
  date: string;
  count: number;
  level: number;
}

export interface ContributionStats {
  totalContributions: number;
  weeks: {
    contributionDays: {
      date: string;
      contributionCount: number;
      contributionLevel: string;
    }[];
  }[];
}

const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

export async function fetchGitHubContributions(username: string): Promise<GitHubContribution[]> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.warn('GITHUB_TOKEN not found, using mock data');
    return [];
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error('GitHub GraphQL errors:', data.errors);
      return [];
    }

    const calendar = data.data?.user?.contributionsCollection?.contributionCalendar;

    if (!calendar) {
      return [];
    }

    // Flatten weeks into a single array of contributions
    const contributions: GitHubContribution[] = [];
    calendar.weeks.forEach((week: any) => {
      week.contributionDays.forEach((day: any) => {
        const levelMap: { [key: string]: number } = {
          'NONE': 0,
          'FIRST_QUARTILE': 1,
          'SECOND_QUARTILE': 2,
          'THIRD_QUARTILE': 3,
          'FOURTH_QUARTILE': 4,
        };

        contributions.push({
          date: day.date,
          count: day.contributionCount,
          level: levelMap[day.contributionLevel] || 0,
        });
      });
    });

    return contributions;
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    return [];
  }
}

export async function fetchGitHubStats(username: string) {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return null;
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
          }
          restrictedContributionsCount
        }
        repositories(first: 100, ownerAffiliations: OWNER) {
          totalCount
          nodes {
            stargazerCount
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.errors) {
      return null;
    }

    const user = data.data?.user;
    const totalStars = user?.repositories?.nodes?.reduce(
      (acc: number, repo: any) => acc + repo.stargazerCount,
      0
    ) || 0;

    return {
      totalContributions: user?.contributionsCollection?.contributionCalendar?.totalContributions || 0,
      totalRepositories: user?.repositories?.totalCount || 0,
      totalStars,
    };
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    return null;
  }
}
