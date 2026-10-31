import { LOG_LINES, TRACES } from '../data/commandCenter'

export default function TelemetryModal({ zone, onClose }) {
  if (!zone) return null

  const logs = LOG_LINES[zone.id] ?? [{ t: '--', level: 'INFO', msg: 'No recent log lines' }]
  const traces = TRACES[zone.id] ?? []

  return (
    <div className="absolute inset-0 z-30 grid place-items-center bg-black/55 p-6" onClick={onClose}>
      <div
        className="max-h-[80vh] w-full max-w-3xl overflow-hidden rounded-xl border border-cyan-800/60 bg-[#0b1822] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-cyan-900/50 px-5 py-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{zone.service}</p>
            <h2 className="text-lg font-semibold text-slate-50">{zone.name} · live stream</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-md px-2 py-1 text-sm text-slate-400 hover:bg-white/5">
            Close
          </button>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          <section>
            <h3 className="mb-2 text-xs uppercase tracking-wider text-slate-500">APM traces</h3>
            <ul className="space-y-2">
              {traces.map((trace) => (
                <li key={trace.span}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-slate-200">{trace.span}</span>
                    <span className={trace.status === 'error' ? 'text-red-300' : 'text-emerald-300'}>{trace.dur}ms</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded bg-slate-800">
                    <div
                      className={`h-full ${trace.status === 'error' ? 'bg-red-400' : 'bg-cyan-400'}`}
                      style={{ width: `${Math.min(100, (trace.dur / 3000) * 100)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="mb-2 text-xs uppercase tracking-wider text-slate-500">Log stream</h3>
            <pre className="scroll-thin max-h-72 overflow-auto rounded-md bg-black/50 p-3 font-mono text-[11px] leading-5 text-slate-300">
              {logs.map((line) => (
                <div key={`${line.t}-${line.msg}`}>
                  <span className="text-slate-500">{line.t}</span>{' '}
                  <span className={levelColor(line.level)}>{line.level.padEnd(5)}</span> {line.msg}
                </div>
              ))}
            </pre>
          </section>
        </div>
      </div>
    </div>
  )
}

function levelColor(level) {
  if (level === 'ERROR') return 'text-red-400'
  if (level === 'WARN') return 'text-amber-300'
  return 'text-cyan-300'
}
