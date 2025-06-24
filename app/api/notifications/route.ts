import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Notification from '../../../models/Notification';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const query: any = { user: userId };
    if (unreadOnly) query.read = false;

    const notifications = await Notification.find(query)
      .sort('-createdAt')
      .limit(50);

    return NextResponse.json(notifications);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    if (!body.user || !body.type || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const notification = await Notification.create(body);

    // Here you would typically trigger a push notification
    // using the Web Push API or a similar service

    return NextResponse.json(notification, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
