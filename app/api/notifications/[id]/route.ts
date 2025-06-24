import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Notification from '../../../../models/Notification';

// Add this above or near your motion import
// @ts-expect-error: Type is too complex for TS to infer
const MotionFlex = motion(Flex);

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const notification = await Notification.findByIdAndUpdate(
      params.id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(notification);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const notification = await Notification.findByIdAndDelete(params.id);

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Notification deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
