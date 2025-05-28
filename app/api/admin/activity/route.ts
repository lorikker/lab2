import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get recent user registrations
    const recentUsers = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    // Get recent trainer applications
    const recentApplications = await prisma.trainerApplications.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        category: true,
        status: true,
        createdAt: true
      }
    });

    // Get recent memberships
    const recentMemberships = await prisma.memberships.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 5,
      select: {
        id: true,
        name: true,
        membershipType: true,
        startDate: true,
        endDate: true,
        createdAt: true
      }
    });

    // Get system stats for the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const monthlyStats = {
      newUsers: await prisma.user.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo
          }
        }
      }),
      newTrainers: await prisma.approvedTrainers.count({
        where: {
          approvedAt: {
            gte: thirtyDaysAgo.toISOString()
          }
        }
      }),
      newMemberships: await prisma.memberships.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo
          }
        }
      }),
      pendingApplications: await prisma.trainerApplications.count({
        where: {
          status: 'PENDING'
        }
      })
    };

    return NextResponse.json({
      success: true,
      recentUsers,
      recentApplications,
      recentMemberships,
      monthlyStats
    });

  } catch (error) {
    console.error('Error fetching admin activity:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch activity data',
        recentUsers: [],
        recentApplications: [],
        recentMemberships: [],
        monthlyStats: {
          newUsers: 0,
          newTrainers: 0,
          newMemberships: 0,
          pendingApplications: 0
        }
      },
      { status: 500 }
    );
  }
}
