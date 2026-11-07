import { NextResponse } from 'next/server';
import { INITIAL_ORDERS } from '@/data/initial-orders';
import { Order } from '@/types/wedding-card';

// In-memory runtime storage for API routes
let apiOrders: Order[] = [...INITIAL_ORDERS];

export async function GET() {
  return NextResponse.json({
    success: true,
    orders: apiOrders,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newOrder: Order = {
      ...body,
      id: body.id || `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: body.status || 'New Order',
    };

    apiOrders.unshift(newOrder);

    return NextResponse.json({
      success: true,
      order: newOrder,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid order payload' },
      { status: 400 }
    );
  }
}

