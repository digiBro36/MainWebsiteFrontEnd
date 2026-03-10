'use client';

const events = [
  { time: '2m ago', label: 'New lead added (Samantha)' },
  { time: '15m ago', label: 'Service "SEO Optimization" published' },
  { time: '1h ago', label: 'Project "Brand Refresh" added' },
  { time: '3h ago', label: 'Lead deleted (internal cleanup)' },
];

export function ActivityTimeline() {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.time} className="flex items-start gap-3">
          <div className="mt-1 h-2 w-2 rounded-full bg-primary-500" />
          <div>
            <p className="text-sm font-semibold text-white">{event.label}</p>
            <p className="text-xs text-neutral-text_muted">{event.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
