import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get order from database
    const order = await db.order.findUnique({
      where: {
        id: orderId
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
                images: true
              }
            }
          }
        },
        user: {
          select: {
            name: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Transform order for frontend
    const transformedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      invoiceNumber: order.invoiceNumber,
      total: Number(order.total),
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentIntent: order.paymentIntent,
      createdAt: order.createdAt.toISOString(),
      shippingInfo: order.shippingInfo,
      billingInfo: order.billingInfo,
      user: order.user,
      items: order.items.map(item => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
        product: item.product ? {
          name: item.product.name,
          price: Number(item.product.price),
          image: item.product.images?.[0] || null
        } : null
      }))
    };

    return NextResponse.json({
      success: true,
      order: transformedOrder
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
