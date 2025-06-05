import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const applicationId = params.id;

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    // Get the trainer application with full details
    const application = await db.trainerApplications.findUnique({
      where: { id: applicationId },
      include: {
        // You can include related data here if needed
      }
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      application: application
    });

  } catch (error) {
    console.error('Error fetching trainer application:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trainer application' },
      { status: 500 }
    );
  }
}
