import { neon } from '@neondatabase/serverless';

let sqlInstance: ReturnType<typeof neon> | null = null;

function getSql() {
  if (!sqlInstance) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    sqlInstance = neon(process.env.DATABASE_URL);
  }
  return sqlInstance;
}

export const sql = new Proxy({} as ReturnType<typeof neon>, {
  get(_target, prop) {
    const instance = getSql();
    const value = (instance as any)[prop];
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});

export interface TestLog {
  id?: number;
  service: string;
  action: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  timestamp?: Date;
  metadata?: Record<string, any>;
}

export async function initDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS test_logs (
      id SERIAL PRIMARY KEY,
      service VARCHAR(100) NOT NULL,
      action VARCHAR(100) NOT NULL,
      status VARCHAR(20) NOT NULL,
      message TEXT,
      metadata JSONB,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export async function logTest(testLog: Omit<TestLog, 'id' | 'timestamp'>) {
  const result = await sql`
    INSERT INTO test_logs (service, action, status, message, metadata)
    VALUES (${testLog.service}, ${testLog.action}, ${testLog.status}, ${testLog.message}, ${JSON.stringify(testLog.metadata || {})})
    RETURNING *
  `;
  return (result as any)[0] as TestLog;
}

export async function getTestLogs(limit = 50) {
  const result = await sql`
    SELECT * FROM test_logs
    ORDER BY timestamp DESC
    LIMIT ${limit}
  `;
  return result;
}
