import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // This endpoint can be called to revoke admin access
    // The actual revocation happens on the client side via sessionStorage
    
    return NextResponse.json({
      success: true,
      message: 'Admin access revoked successfully'
    });

  } catch (error) {
    console.error('Error revoking admin access:', error);
    return NextResponse.json(
      {
        error: 'Failed to revoke admin access'
      },
      { status: 500 }
    );
  }
}
