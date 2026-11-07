import { NextResponse } from 'next/server';
import { SAMPLE_TEMPLATES } from '@/data/sample-templates';
import { DesignTemplate } from '@/types/wedding-card';

let apiTemplates: DesignTemplate[] = [...SAMPLE_TEMPLATES];

export async function GET() {
  return NextResponse.json({
    success: true,
    templates: apiTemplates,
  });
}

export async function POST(request: Request) {
  try {
    const template: DesignTemplate = await request.json();
    apiTemplates.unshift(template);

    return NextResponse.json({
      success: true,
      template,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create template' },
      { status: 400 }
    );
  }
}

