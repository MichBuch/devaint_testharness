'use client';

import { LogEntry } from '@/app/page';

interface LogsPanelProps {
  logs: LogEntry[];
  onRefresh: () => void;
}

export default function LogsPanel({ logs, onRefresh }: LogsPanelProps) {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="logs-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Test Logs</h2>
        <button className="btn btn-secondary" onClick={onRefresh}>
          Refresh
        </button>
      </div>
      <div className="logs-list">
        {logs.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
            No logs yet. Click buttons above to test services.
          </p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className={`log-entry ${log.status}`}>
              <div className="log-entry-header">
                <span>
                  <span className={`status-indicator ${log.status}`}></span>
                  <strong>{log.service}</strong> - {log.action}
                </span>
                <span className="log-entry-time">{formatTime(log.timestamp)}</span>
              </div>
              <div className="log-entry-message">{log.message}</div>
              {log.metadata && Object.keys(log.metadata).length > 0 && (
                <details style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                  <summary style={{ cursor: 'pointer', color: '#666' }}>Metadata</summary>
                  <pre style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f0f0f0', borderRadius: '4px', overflow: 'auto' }}>
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
