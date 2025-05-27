-- CreateTable
CREATE TABLE "users_memberships" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "membershipType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "purchaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "daysRemaining" INTEGER NOT NULL DEFAULT 0,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "paymentMethod" TEXT,
    "autoRenew" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders_memberships" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "usersMembershipsId" TEXT,
    "orderNumber" TEXT NOT NULL,
    "membershipType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "paymentMethod" TEXT,
    "paymentIntentId" TEXT,
    "stripeSessionId" TEXT,
    "invoiceNumber" TEXT,
    "billingInfo" JSONB,
    "paymentDate" TIMESTAMP(3),
    "refundDate" TIMESTAMP(3),
    "refundAmount" DECIMAL(10,2),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_memberships_orderNumber_key" ON "orders_memberships"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "orders_memberships_invoiceNumber_key" ON "orders_memberships"("invoiceNumber");

-- AddForeignKey
ALTER TABLE "users_memberships" ADD CONSTRAINT "users_memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders_memberships" ADD CONSTRAINT "orders_memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders_memberships" ADD CONSTRAINT "orders_memberships_usersMembershipsId_fkey" FOREIGN KEY ("usersMembershipsId") REFERENCES "users_memberships"("id") ON DELETE SET NULL ON UPDATE CASCADE;
