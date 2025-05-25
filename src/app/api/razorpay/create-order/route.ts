import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import prisma from '@/lib/prisma';

// Don't initialize Razorpay at the module level
// Move it inside the POST function to only run at request time

export async function POST(req: NextRequest) {
    // Initialize Razorpay inside the function
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || '',
        key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });

    // Check if credentials are available
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.error('Razorpay credentials are missing');
        return NextResponse.json({ error: 'Payment service configuration error' }, { status: 500 });
    }

    const body = await req.json();

    // 1) Create our Order record (paymentStatus=false)
    const dbOrder = await prisma.order.create({
        data: {
            userId: body.userId,
            name: body.name,
            caseType: body.caseType,
            grievance: body.grievance,
            city: body.city,
            language: body.language,
            callmode: body.callmode,
            callduration: parseInt(body.callduration, 10),
            date: new Date(body.date),
            time: body.time,
            phone: body.phone,
            totalCost: body.totalCost,
            transactionId: '',
            paymentStatus: false,
        }
    });

    // 2) Create Razorpay order
    const rpOrder = await razorpay.orders.create({
        amount: dbOrder.totalCost * 100, // ₹ → paise
        currency: 'INR',
        receipt: dbOrder.id,
        payment_capture: true,  // Using boolean instead of number
    });

    return NextResponse.json({
        razorpayOrderId: rpOrder.id,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
        orderRecordId: dbOrder.id,
    });
}