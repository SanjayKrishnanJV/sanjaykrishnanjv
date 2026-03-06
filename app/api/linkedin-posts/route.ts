import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'linkedin-posts.json');

    if (!fs.existsSync(filePath)) {
      return NextResponse.json([]);
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const posts = JSON.parse(fileContent);

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error reading LinkedIn posts:', error);
    return NextResponse.json([]);
  }
}
