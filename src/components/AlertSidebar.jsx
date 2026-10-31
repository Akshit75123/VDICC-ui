const severityStyles = {
  critical: 'border-red-500/40 bg-red-500/10 text-red-200',
  warning: 'border-amber-500/40 bg-amber-500/10 text-amber-200',
  info: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200',
}

export default function AlertSidebar({ alerts, selectedZoneId, onSelectAlert }) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-cyan-900/40 bg-[#07131c] xl:w-72">
      <div className="border-b border-cyan-900/40 px-4 py-3">
        <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Telemetry ingest</p>
        <h2 className="text-sm font-semibold text-slate-100">Incoming alerts</h2>
      </div>
      <ul className="scroll-thin flex-1 overflow-y-auto p-3">
        {alerts.map((alert) => {
          const active = selectedZoneId === alert.zoneId
          return (
            <li key={alert.id} className="mb-2">
              <button
                type="button"
                onClick={() => onSelectAlert(alert)}
                className={`w-full rounded-lg border p-3 text-left transition ${
                  active ? 'border-cyan-400/60 bg-cyan-400/10' : 'border-white/5 bg-white/2 hover:border-cyan-700/50'
                }`}
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase ${severityStyles[alert.severity]}`}>
                    {alert.source}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">{alert.age}</span>
                </div>
                <p className="text-sm leading-snug text-slate-100">{alert.title}</p>
                <p className="mt-1 text-[11px] text-slate-500">{alert.time} · zone focus</p>
              </button>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
