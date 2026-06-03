import { useState } from "react";

export function HookActivityPanel({ events }) {
  const [collapsed, setCollapsed] = useState(false);
  const currentEvent = events[0];

  return (
    <aside className={`hook-panel ${collapsed ? "is-collapsed" : ""}`} aria-live="polite">
      <button
        className="hook-panel-toggle"
        type="button"
        onClick={() => setCollapsed((current) => !current)}
      >
        {collapsed ? "Hooks" : "Hide"}
      </button>

      {!collapsed && (
        <>
          <div className="hook-panel-header">
            <span className="eyebrow">Live hook viewer</span>
            <h2>Hook activity</h2>
          </div>

          <div className="hook-current">
            <span className="hook-name">{currentEvent.hook}</span>
            <strong>{currentEvent.title}</strong>
            <p>{currentEvent.detail}</p>
          </div>

          <ol className="hook-history" aria-label="Recent hook activity">
            {events.slice(1).map((event) => (
              <li key={event.id}>
                <span>{event.hook}</span>
                {event.title}
              </li>
            ))}
          </ol>
        </>
      )}
    </aside>
  );
}
