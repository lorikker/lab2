import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get total users count
    const totalUsers = await prisma.user.count();

    // Get active trainers count
    const totalTrainers = await prisma.approvedTrainers.count({
      where: {
        isActive: true
      }
    });

    // Get pending trainer applications count
    const pendingApplications = await prisma.trainerApplications.count({
      where: {
        status: 'PENDING'
      }
    });

    // Get total notifications count for admins
    const totalNotifications = await prisma.notifications.count({
      where: {
        isAdmin: true
      }
    });

    // Get additional stats
    const totalMemberships = await prisma.memberships.count();
    const activeMemberships = await prisma.memberships.count({
      where: {
        endDate: {
          gte: new Date()
        }
      }
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalTrainers,
        pendingApplications,
        totalNotifications,
        totalMemberships,
        activeMemberships
      }
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch admin statistics',
        stats: {
          totalUsers: 0,
          totalTrainers: 0,
          pendingApplications: 0,
          totalNotifications: 0,
          totalMemberships: 0,
          activeMemberships: 0
        }
      },
      { status: 500 }
    );
  }
}
