export interface NewsletterSubscriber {
  email: string;
  name?: string;
  subscribedAt: string;
  tags?: string[];
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
  error?: string;
}

// In-memory storage for development (replace with database in production)
const subscribers: NewsletterSubscriber[] = [];

export async function subscribeToNewsletter(
  email: string,
  name?: string,
  tags?: string[]
): Promise<NewsletterResponse> {
  try {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: 'Please enter a valid email address',
      };
    }

    // Check if already subscribed
    const existingSubscriber = subscribers.find(sub => sub.email.toLowerCase() === email.toLowerCase());
    if (existingSubscriber) {
      return {
        success: false,
        message: 'This email is already subscribed',
      };
    }

    // Add subscriber
    const subscriber: NewsletterSubscriber = {
      email: email.toLowerCase(),
      name,
      subscribedAt: new Date().toISOString(),
      tags: tags || ['general'],
    };

    subscribers.push(subscriber);

    // TODO: Integrate with email service provider (Mailchimp, ConvertKit, etc.)
    // await sendToMailchimp(subscriber);
    // await sendToConvertKit(subscriber);

    return {
      success: true,
      message: 'Successfully subscribed! Check your email for confirmation.',
    };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return {
      success: false,
      message: 'An error occurred. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export function getSubscribers(): NewsletterSubscriber[] {
  return subscribers;
}

export function getSubscriberCount(): number {
  return subscribers.length;
}

// Mailchimp integration (optional)
export async function subscribeToMailchimp(email: string, name?: string): Promise<NewsletterResponse> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const datacenter = apiKey?.split('-')[1];

  if (!apiKey || !audienceId) {
    console.warn('Mailchimp credentials not configured');
    return {
      success: false,
      message: 'Newsletter service not configured',
    };
  }

  try {
    const response = await fetch(
      `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          merge_fields: name ? { FNAME: name } : {},
        }),
      }
    );

    if (response.ok) {
      return {
        success: true,
        message: 'Successfully subscribed to newsletter!',
      };
    }

    const error = await response.json();
    return {
      success: false,
      message: error.title || 'Failed to subscribe',
      error: error.detail,
    };
  } catch (error) {
    console.error('Mailchimp API error:', error);
    return {
      success: false,
      message: 'An error occurred. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ConvertKit integration (optional)
export async function subscribeToConvertKit(email: string, name?: string): Promise<NewsletterResponse> {
  const apiKey = process.env.CONVERTKIT_API_KEY;
  const formId = process.env.CONVERTKIT_FORM_ID;

  if (!apiKey || !formId) {
    console.warn('ConvertKit credentials not configured');
    return {
      success: false,
      message: 'Newsletter service not configured',
    };
  }

  try {
    const response = await fetch(
      `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: apiKey,
          email,
          first_name: name,
        }),
      }
    );

    if (response.ok) {
      return {
        success: true,
        message: 'Successfully subscribed to newsletter!',
      };
    }

    const error = await response.json();
    return {
      success: false,
      message: 'Failed to subscribe',
      error: error.message,
    };
  } catch (error) {
    console.error('ConvertKit API error:', error);
    return {
      success: false,
      message: 'An error occurred. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
