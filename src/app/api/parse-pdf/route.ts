import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';

export async function POST(req: NextRequest) {
  try {
    const buffer = await req.arrayBuffer();
    const data = await pdf(Buffer.from(buffer));
    return NextResponse.json({ text: data.text });
  } catch (error) {
    console.error('PDF parsing error in API route:', error);
    return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 });
  }
}
