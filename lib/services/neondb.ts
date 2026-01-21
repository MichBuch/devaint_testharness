import { sql } from '@/lib/db';

export async function testNeonDB(action: string) {
  switch (action) {
    case 'connect':
      try {
        await sql`SELECT 1`;
        return {
          success: true,
          message: 'Successfully connected to Neon DB',
          metadata: { timestamp: new Date().toISOString() },
        };
      } catch (error: any) {
        return {
          success: false,
          message: `Connection failed: ${error.message}`,
        };
      }

    case 'query':
      try {
        const result = await sql`
          SELECT COUNT(*) as count FROM test_logs
        `;
        return {
          success: true,
          message: `Query executed successfully. Found ${result[0]?.count || 0} log entries`,
          metadata: { count: result[0]?.count },
        };
      } catch (error: any) {
        return {
          success: false,
          message: `Query failed: ${error.message}`,
        };
      }

    case 'insert':
      try {
        const testData = {
          service: 'neondb',
          action: 'insert',
          status: 'success',
          message: 'Test insert operation',
        };
        await sql`
          INSERT INTO test_logs (service, action, status, message)
          VALUES (${testData.service}, ${testData.action}, ${testData.status}, ${testData.message})
        `;
        return {
          success: true,
          message: 'Test record inserted successfully',
          metadata: testData,
        };
      } catch (error: any) {
        return {
          success: false,
          message: `Insert failed: ${error.message}`,
        };
      }

    default:
      return {
        success: false,
        message: `Unknown action: ${action}`,
      };
  }
}
