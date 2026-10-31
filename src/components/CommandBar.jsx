export default function CommandBar({ elapsed, muted, onToggleMute, huddleCount, nearbyCount }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 overflow-hidden border-b border-cyan-900/40 bg-[#08141d]/95 px-4">
      <div className="flex shrink-0 items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-red-500/15 text-sm font-semibold text-red-300">
          IC
        </span>
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-400/80">Spatial command</p>
          <h1 className="whitespace-nowrap text-sm font-semibold text-slate-100">Checkout outage · SEV-1</h1>
        </div>
      </div>

      <div className="ml-4 hidden items-center gap-6 lg:flex">
        <Metric label="Elapsed" value={elapsed} accent="text-amber-300" />
        <Metric label="MTTA" value="01:12" accent="text-cyan-300" />
        <Metric label="Est. MTTR" value="18:40" accent="text-emerald-300" />
        <Metric label="In huddles" value={String(huddleCount)} accent="text-violet-300" />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs text-red-200 sm:inline">
          Live incident
        </span>
        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
          Proximity voice · {nearbyCount} nearby
        </span>
        <button
          type="button"
          onClick={onToggleMute}
          className={`rounded-md px-3 py-1.5 text-xs font-medium ${
            muted
              ? 'bg-slate-700 text-slate-200'
              : 'bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/40'
          }`}
        >
          {muted ? 'Mic muted' : 'Mic live'}
        </button>
      </div>
    </header>
  )
}

function Metric({ label, value, accent }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`font-mono text-sm ${accent}`}>{value}</p>
    </div>
  )
}
