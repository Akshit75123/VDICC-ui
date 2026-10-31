export default function TelemetryPanel({
  responders,
  huddles,
  nearby,
  inHuddle,
  onStartHuddle,
  onLeaveHuddle,
  selectedZone,
  onOpenTelemetry,
}) {
  return (
    <aside className="flex w-72 shrink-0 flex-col overflow-y-auto border-l border-cyan-900/40 bg-[#07131c] xl:w-80">
      <section className="border-b border-cyan-900/40 px-4 py-3">
        <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Floor awareness</p>
        <h2 className="text-sm font-semibold text-slate-100">Responders</h2>
        <ul className="mt-3 space-y-2">
          {responders.map((person) => (
            <li key={person.id} className="flex items-center gap-2">
              <span
                className="grid h-8 w-8 place-items-center rounded-full text-[11px] font-semibold text-slate-950"
                style={{ backgroundColor: person.color }}
              >
                {person.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-slate-100">
                  {person.name}
                  {person.isSelf ? ' (you)' : ''}
                </p>
                <p className="truncate text-[11px] text-slate-500">{person.status}</p>
              </div>
              {person.huddleId ? (
                <span className="rounded bg-violet-500/20 px-1.5 py-0.5 text-[10px] text-violet-200">Huddle</span>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="border-b border-cyan-900/40 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-100">Proximity & huddles</h2>
        <p className="mt-1 text-xs text-slate-500">
          {nearby.length ? `${nearby.length} responder${nearby.length === 1 ? '' : 's'} in voice range` : 'No one in proximity radius'}
        </p>
        <ul className="mt-2 space-y-1">
          {nearby.map((person) => (
            <li key={person.id} className="text-xs text-cyan-200">
              {person.name} · {person.role}
            </li>
          ))}
        </ul>
        <div className="mt-3 flex gap-2">
          {inHuddle ? (
            <button
              type="button"
              onClick={onLeaveHuddle}
              className="rounded-md bg-violet-500/20 px-3 py-1.5 text-xs text-violet-100 ring-1 ring-violet-400/40"
            >
              Leave huddle
            </button>
          ) : (
            <button
              type="button"
              onClick={onStartHuddle}
              disabled={nearby.length === 0}
              className="rounded-md bg-cyan-500/20 px-3 py-1.5 text-xs text-cyan-100 ring-1 ring-cyan-400/40 disabled:opacity-40"
            >
              Start task huddle
            </button>
          )}
        </div>
        <ul className="mt-3 space-y-2">
          {huddles.map((huddle) => (
            <li key={huddle.id} className="rounded-md border border-violet-500/30 bg-violet-500/10 px-2 py-2 text-xs text-violet-100">
              {huddle.name} · {huddle.members.length} in room
            </li>
          ))}
        </ul>
      </section>

      <section className="flex-1 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-100">Zone telemetry</h2>
        {selectedZone ? (
          <div className="mt-2">
            <p className="text-xs text-slate-400">{selectedZone.name}</p>
            <dl className="mt-2 grid grid-cols-3 gap-2 text-center">
              <Stat label="p99" value={selectedZone.metrics.p99} />
              <Stat label="errors" value={selectedZone.metrics.errorRate} />
              <Stat label="rps" value={selectedZone.metrics.rps} />
            </dl>
            <button
              type="button"
              onClick={() => onOpenTelemetry(selectedZone)}
              className="mt-3 w-full rounded-md bg-slate-800 px-3 py-2 text-xs text-slate-100 ring-1 ring-cyan-800"
            >
              Open logs & APM traces
            </button>
          </div>
        ) : (
          <p className="mt-2 text-xs text-slate-500">Click a map zone or walk onto it to inspect live streams.</p>
        )}
      </section>
    </aside>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-md bg-black/30 py-2">
      <dt className="text-[10px] uppercase text-slate-500">{label}</dt>
      <dd className="font-mono text-xs text-cyan-200">{value}</dd>
    </div>
  )
}
