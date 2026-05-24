import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

/**
 * GET /api/health/db
 * Health check endpoint to verify MongoDB connection
 * Returns connection status and database info
 */
export async function GET() {
  const startTime = Date.now();

  try {
    const mongoose = await connectDB();
    const duration = Date.now() - startTime;

    return NextResponse.json({
      ok: true,
      status: 'connected',
      database: mongoose.connection.name,
      readyState: mongoose.connection.readyState,
      readyStateLabel: getReadyStateLabel(mongoose.connection.readyState),
      connectionTime: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorName = error instanceof Error ? error.name : 'Error';

    console.error('Health check failed:', error);

    return NextResponse.json(
      {
        ok: false,
        status: 'disconnected',
        error: {
          name: errorName,
          message: errorMessage,
        },
        connectionTime: `${duration}ms`,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}

function getReadyStateLabel(state: number): string {
  switch (state) {
    case 0:
      return 'disconnected';
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'unknown';
  }
}
