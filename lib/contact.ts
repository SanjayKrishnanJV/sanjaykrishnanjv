export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
  projectType?: string;
  budget?: string;
  attachments?: File[];
}

export interface ContactResponse {
  success: boolean;
  message: string;
  error?: string;
}

// Validation rules
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

export function validateContactForm(data: ContactFormData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push('Please enter a valid email address');
  }

  if (!data.subject || data.subject.trim().length < 3) {
    errors.push('Subject must be at least 3 characters long');
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long');
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.push('Please enter a valid phone number');
  }

  if (data.attachments && data.attachments.length > 0) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    for (const file of data.attachments) {
      if (file.size > maxSize) {
        errors.push(`File ${file.name} is too large. Maximum size is 5MB`);
      }
      if (!allowedTypes.includes(file.type)) {
        errors.push(`File ${file.name} has an unsupported type`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Send email using various services
export async function sendContactEmail(data: ContactFormData): Promise<ContactResponse> {
  try {
    const validation = validateContactForm(data);
    if (!validation.valid) {
      return {
        success: false,
        message: validation.errors[0],
        error: validation.errors.join(', '),
      };
    }

    // Try Formspree if configured
    const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;
    if (formspreeId) {
      return await sendViaFormspree(data, formspreeId);
    }

    // Fallback: store locally or use other service
    console.log('Contact form submission:', data);

    return {
      success: true,
      message: 'Thank you for your message! I will get back to you soon.',
    };
  } catch (error) {
    console.error('Contact form error:', error);
    return {
      success: false,
      message: 'An error occurred. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function sendViaFormspree(data: ContactFormData, formId: string): Promise<ContactResponse> {
  try {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('subject', data.subject);
    formData.append('message', data.message);

    if (data.phone) formData.append('phone', data.phone);
    if (data.company) formData.append('company', data.company);
    if (data.projectType) formData.append('projectType', data.projectType);
    if (data.budget) formData.append('budget', data.budget);

    if (data.attachments) {
      data.attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });
    }

    const response = await fetch(`https://formspree.io/f/${formId}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Thank you for your message! I will get back to you soon.',
      };
    }

    const error = await response.json();
    return {
      success: false,
      message: 'Failed to send message',
      error: error.error || 'Unknown error',
    };
  } catch (error) {
    console.error('Formspree error:', error);
    return {
      success: false,
      message: 'An error occurred. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Email templates
export function generateEmailTemplate(data: ContactFormData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #667eea; }
    .value { margin-top: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Contact Form Submission</h2>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Name:</div>
        <div class="value">${data.name}</div>
      </div>
      <div class="field">
        <div class="label">Email:</div>
        <div class="value">${data.email}</div>
      </div>
      ${data.phone ? `
      <div class="field">
        <div class="label">Phone:</div>
        <div class="value">${data.phone}</div>
      </div>
      ` : ''}
      ${data.company ? `
      <div class="field">
        <div class="label">Company:</div>
        <div class="value">${data.company}</div>
      </div>
      ` : ''}
      ${data.projectType ? `
      <div class="field">
        <div class="label">Project Type:</div>
        <div class="value">${data.projectType}</div>
      </div>
      ` : ''}
      ${data.budget ? `
      <div class="field">
        <div class="label">Budget:</div>
        <div class="value">${data.budget}</div>
      </div>
      ` : ''}
      <div class="field">
        <div class="label">Subject:</div>
        <div class="value">${data.subject}</div>
      </div>
      <div class="field">
        <div class="label">Message:</div>
        <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}
