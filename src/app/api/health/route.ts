import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({ status: 'error', database: 'disconnected', timestamp: new Date().toISOString() }, { status: 500 });
  }
}