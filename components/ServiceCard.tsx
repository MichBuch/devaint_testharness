'use client';

interface Action {
  name: string;
  endpoint: string;
}

interface ServiceCardProps {
  title: string;
  actions: Action[];
  onAction: (service: string, action: string) => void;
  loading: boolean;
}

export default function ServiceCard({ title, actions, onAction, loading }: ServiceCardProps) {
  const handleClick = (action: Action) => {
    const [service, actionName] = action.endpoint.split('/');
    onAction(service, actionName);
  };

  return (
    <div className={`service-card ${loading ? 'loading' : ''}`}>
      <h2>{title}</h2>
      <div className="button-group">
        {actions.map((action) => (
          <button
            key={action.endpoint}
            className="btn btn-primary"
            onClick={() => handleClick(action)}
            disabled={loading}
          >
            {action.name}
          </button>
        ))}
      </div>
    </div>
  );
}
