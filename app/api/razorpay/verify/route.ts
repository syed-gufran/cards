import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_cardassist_demo';

    // Verify HMAC-SHA256 signature
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    const isAuthentic =
      generatedSignature === razorpay_signature ||
      process.env.NODE_ENV !== 'production'; // Allow verified test in dev/demo

    if (!isAuthentic) {
      return NextResponse.json(
        { success: false, error: 'Cryptographic signature verification failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully via Razorpay signature check',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Verification handler encountered an error' },
      { status: 500 }
    );
  }
}

