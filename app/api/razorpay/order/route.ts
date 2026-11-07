import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amountInRupees, orderId, customerName, customerEmail } = await request.json();

    if (!amountInRupees || amountInRupees <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid payment amount is required' },
        { status: 400 }
      );
    }

    // Razorpay amounts are measured in subunits (paise for INR, 1 INR = 100 paise)
    const amountInPaise = Math.round(amountInRupees * 100);

    // In production, instantiate Razorpay SDK:
    // const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID!, key_secret: process.env.RAZORPAY_KEY_SECRET! });
    // const rzpOrder = await razorpay.orders.create({ amount: amountInPaise, currency: 'INR', receipt: orderId });

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_cardassist_demo';

    return NextResponse.json({
      success: true,
      razorpayKeyId: keyId,
      order: {
        id: `order_rzp_${Math.random().toString(36).substring(2, 12)}`,
        entity: 'order',
        amount: amountInPaise,
        amount_paid: 0,
        amount_due: amountInPaise,
        currency: 'INR',
        receipt: orderId,
        status: 'created',
        notes: {
          client: customerName,
          email: customerEmail,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error generating Razorpay order' },
      { status: 500 }
    );
  }
}

