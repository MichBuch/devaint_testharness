'use client';

import { useState, useEffect } from 'react';
import ServiceCard from '@/components/ServiceCard';
import LogsPanel from '@/components/LogsPanel';

export interface LogEntry {
  id: number;
  service: string;
  action: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export default function Home() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs');
      const data = await res.json();
      setLogs(data);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  };

  useEffect(() => {
    // Initialize database on mount
    fetch('/api/init-db', { method: 'POST' }).catch(console.error);
    fetchLogs();
    const interval = setInterval(fetchLogs, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (service: string, action: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/test/${service}/${action}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        await fetchLogs();
      }
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🤖 Deviant Test Harness</h1>
        <p>AI Dev Agent Testing Platform</p>
      </div>

      <div className="dashboard">
        <ServiceCard
          title="Neon DB"
          actions={[
            { name: 'Connect', endpoint: 'neondb/connect' },
            { name: 'Query Data', endpoint: 'neondb/query' },
            { name: 'Insert Test', endpoint: 'neondb/insert' },
          ]}
          onAction={handleAction}
          loading={loading}
        />

        <ServiceCard
          title="AWS S3"
          actions={[
            { name: 'List Buckets', endpoint: 'aws/list-buckets' },
            { name: 'Upload Test', endpoint: 'aws/upload' },
            { name: 'Download Test', endpoint: 'aws/download' },
          ]}
          onAction={handleAction}
          loading={loading}
        />

        <ServiceCard
          title="Azure Blob"
          actions={[
            { name: 'List Containers', endpoint: 'azure/list-containers' },
            { name: 'Upload Blob', endpoint: 'azure/upload' },
            { name: 'Download Blob', endpoint: 'azure/download' },
          ]}
          onAction={handleAction}
          loading={loading}
        />

        <ServiceCard
          title="Stripe"
          actions={[
            { name: 'Create Customer', endpoint: 'stripe/create-customer' },
            { name: 'List Products', endpoint: 'stripe/list-products' },
            { name: 'Create Payment', endpoint: 'stripe/create-payment' },
          ]}
          onAction={handleAction}
          loading={loading}
        />

        <ServiceCard
          title="MCP Server"
          actions={[
            { name: 'List Tools', endpoint: 'mcp/list-tools' },
            { name: 'Call Tool', endpoint: 'mcp/call-tool' },
            { name: 'Get Resources', endpoint: 'mcp/get-resources' },
          ]}
          onAction={handleAction}
          loading={loading}
        />

        <ServiceCard
          title="External APIs"
          actions={[
            { name: 'Fetch JSONPlaceholder', endpoint: 'api/jsonplaceholder' },
            { name: 'Fetch GitHub', endpoint: 'api/github' },
            { name: 'Fetch Weather', endpoint: 'api/weather' },
          ]}
          onAction={handleAction}
          loading={loading}
        />
      </div>

      <LogsPanel logs={logs} onRefresh={fetchLogs} />
    </div>
  );
}
