import { NextResponse } from 'next/server';
import { metrics } from '@backend/monitoring/metrics';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'WARDROBE AI API v1',
    version: '1.0.0',
    metrics: metrics.getSummary(),
  });
}
