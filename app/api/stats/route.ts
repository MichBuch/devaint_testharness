import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const totalLogs = await sql`
      SELECT COUNT(*) as count FROM test_logs
    `;

    const byStatus = await sql`
      SELECT status, COUNT(*) as count
      FROM test_logs
      GROUP BY status
    `;

    const byService = await sql`
      SELECT service, COUNT(*) as count
      FROM test_logs
      GROUP BY service
      ORDER BY count DESC
    `;

    const recentActivity = await sql`
      SELECT service, action, status, timestamp
      FROM test_logs
      ORDER BY timestamp DESC
      LIMIT 10
    `;

    const totalCount = Array.isArray(totalLogs) && totalLogs.length > 0 
      ? (totalLogs[0] as { count: string | number }).count 
      : 0;

    return NextResponse.json({
      total: typeof totalCount === 'string' ? parseInt(totalCount) : totalCount,
      byStatus: (byStatus as Array<{ status: string; count: string | number }>).reduce((acc: Record<string, number>, row) => {
        acc[row.status] = typeof row.count === 'string' ? parseInt(row.count) : row.count;
        return acc;
      }, {}),
      byService: (byService as Array<{ service: string; count: string | number }>).map((row) => ({
        service: row.service,
        count: typeof row.count === 'string' ? parseInt(row.count) : row.count,
      })),
      recentActivity: (recentActivity as Array<{ service: string; action: string; status: string; timestamp: Date }>).map((row) => ({
        service: row.service,
        action: row.action,
        status: row.status,
        timestamp: row.timestamp,
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
