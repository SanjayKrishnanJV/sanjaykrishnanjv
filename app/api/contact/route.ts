import { NextResponse } from 'next/server';
import { sendContactEmail, type ContactFormData } from '@/lib/contact';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const data: ContactFormData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
      phone: formData.get('phone') as string | undefined,
      company: formData.get('company') as string | undefined,
      projectType: formData.get('projectType') as string | undefined,
      budget: formData.get('budget') as string | undefined,
    };

    // Handle file attachments
    const attachments: File[] = [];
    for (let i = 0; i < 5; i++) {
      const file = formData.get(`attachment_${i}`) as File;
      if (file && file.size > 0) {
        attachments.push(file);
      }
    }
    if (attachments.length > 0) {
      data.attachments = attachments;
    }

    const result = await sendContactEmail(data);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}
