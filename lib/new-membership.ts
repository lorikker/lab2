import { db } from '@/db';

export type MembershipType = 'basic' | 'premium' | 'elite';
export type MembershipStatus = 'active' | 'expired' | 'cancelled' | 'suspended';

// Calculate membership end date based on type
export function calculateMembershipEndDate(membershipType: MembershipType, startDate: Date = new Date()): Date {
  const endDate = new Date(startDate);

  switch (membershipType) {
    case 'basic':
      endDate.setMonth(endDate.getMonth() + 1); // 1 month
      break;
    case 'premium':
      endDate.setMonth(endDate.getMonth() + 1); // 1 month
      break;
    case 'elite':
      endDate.setMonth(endDate.getMonth() + 1); // 1 month
      break;
    default:
      endDate.setMonth(endDate.getMonth() + 1); // Default 1 month
  }

  return endDate;
}

// Calculate days remaining and days active
export function calculateMembershipDays(startDate: Date, endDate: Date) {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Days active (from start to now, or from start to end if membership ended)
  const activeUntil = now > end ? end : now;
  const daysActive = Math.max(0, Math.ceil((activeUntil.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

  // Days remaining (from now to end)
  const daysRemaining = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return { daysActive, daysRemaining };
}

// Generate unique order number
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// Get number of days for a membership type
function getMembershipDays(membershipType: MembershipType): number {
  switch (membershipType) {
    case 'basic':
      return 30; // 1 month
    case 'premium':
      return 30; // 1 month
    case 'elite':
      return 30; // 1 month
    default:
      return 30;
  }
}

// Get the higher tier membership type
function getHigherMembershipTier(current: string, new_type: string): string {
  const tiers = { 'basic': 1, 'premium': 2, 'elite': 3 };
  const currentTier = tiers[current as keyof typeof tiers] || 1;
  const newTier = tiers[new_type as keyof typeof tiers] || 1;

  // Return the higher tier
  if (newTier > currentTier) {
    return new_type;
  }
  return current;
}

// Create a new membership when payment is successful
export async function createNewMembership(data: {
  userId: string;
  userName?: string;
  membershipType: MembershipType;
  price: number;
  currency?: string;
  paymentMethod?: string;
  paymentIntentId?: string;
  invoiceNumber?: string;
  billingInfo?: any;
}) {
  const orderNumber = generateOrderNumber();

  // Check if user has an existing active membership
  const existingMembership = await db.memberships.findFirst({
    where: {
      userId: data.userId,
      status: 'active',
    },
    orderBy: {
      endDate: 'desc', // Get the latest membership
    },
  });

  let membership;
  let startDate: Date;
  let endDate: Date;

  if (existingMembership) {
    // User has active membership - extend it
    console.log('User has existing active membership, extending it...');

    // Calculate new end date based on existing membership's end date
    const currentEndDate = existingMembership.endDate;
    const additionalDays = getMembershipDays(data.membershipType);

    // New end date = current end date + additional days
    endDate = new Date(currentEndDate);
    endDate.setDate(endDate.getDate() + additionalDays);

    // Start date remains the same as the original membership
    startDate = existingMembership.startDate;

    // Calculate updated days
    const { daysActive, daysRemaining } = calculateMembershipDays(startDate, endDate);

    // Update existing membership
    membership = await db.memberships.update({
      where: { id: existingMembership.id },
      data: {
        endDate,
        daysActive,
        daysRemaining,
        // Keep the higher tier membership type if upgrading
        membershipType: getHigherMembershipTier(existingMembership.membershipType, data.membershipType),
        updatedAt: new Date(),
      },
      include: {
        user: true,
      },
    });

    console.log(`Extended membership until ${endDate.toISOString()}, total days remaining: ${daysRemaining}`);
  } else {
    // User doesn't have active membership - create new one
    console.log('User has no active membership, creating new one...');

    startDate = new Date();
    endDate = calculateMembershipEndDate(data.membershipType, startDate);
    const { daysActive, daysRemaining } = calculateMembershipDays(startDate, endDate);

    // Create new membership
    membership = await db.memberships.create({
      data: {
        userId: data.userId,
        name: data.userName,
        membershipType: data.membershipType,
        status: 'active',
        startDate,
        endDate,
        daysActive,
        daysRemaining,
        price: data.price,
        currency: data.currency || 'USD',
        paymentMethod: data.paymentMethod,
        autoRenew: false,
      },
      include: {
        user: true,
      },
    });
  }

  // Always create a record in paidmemberships table (payment history)
  const paidMembership = await db.paidMemberships.create({
    data: {
      userId: data.userId,
      name: data.userName,
      orderNumber,
      membershipType: data.membershipType,
      status: 'completed',
      amount: data.price,
      currency: data.currency || 'USD',
      paymentMethod: data.paymentMethod,
      paymentIntentId: data.paymentIntentId,
      invoiceNumber: data.invoiceNumber,
      billingInfo: data.billingInfo,
      paymentDate: new Date(),
      membershipStartDate: startDate,
      membershipEndDate: endDate,
    },
    include: {
      user: true,
    },
  });

  return { membership, paidMembership, isExtension: !!existingMembership };
}

// Get user's active membership
export async function getUserActiveMembership(userId: string) {
  return await db.memberships.findFirst({
    where: {
      userId,
      status: 'active',
      endDate: {
        gt: new Date(),
      },
    },
    include: {
      user: true,
    },
  });
}

// Get user's membership history
export async function getUserMembershipHistory(userId: string) {
  return await db.memberships.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
    },
  });
}

// Get user's payment history
export async function getUserPaymentHistory(userId: string) {
  return await db.paidMemberships.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
    },
  });
}

// Update membership days (should be run daily)
export async function updateAllMembershipDays() {
  const activeMemberships = await db.memberships.findMany({
    where: {
      status: 'active',
    },
  });

  for (const membership of activeMemberships) {
    const { daysActive, daysRemaining } = calculateMembershipDays(
      membership.startDate,
      membership.endDate
    );

    const newStatus = daysRemaining <= 0 ? 'expired' : 'active';

    await db.memberships.update({
      where: { id: membership.id },
      data: {
        daysActive,
        daysRemaining,
        status: newStatus,
      },
    });
  }
}

// Get payment by invoice number
export async function getPaymentByInvoiceNumber(invoiceNumber: string) {
  return await db.paidMemberships.findUnique({
    where: { invoiceNumber },
    include: {
      user: true,
    },
  });
}
