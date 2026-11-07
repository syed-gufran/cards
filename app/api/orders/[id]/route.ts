import { NextResponse } from 'next/server';
import { INITIAL_ORDERS } from '@/data/initial-orders';
import { Order, OrderStatus } from '@/types/wedding-card';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const orderId = params.id;
  const match = INITIAL_ORDERS.find((o) => o.id === orderId);

  if (!match) {
    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, order: match });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    const body = await request.json();
    const { status, note } = body;

    return NextResponse.json({
      success: true,
      message: `Order ${orderId} updated to ${status}`,
      updatedStatus: status,
      note,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid update payload' }, { status: 400 });
  }
}

