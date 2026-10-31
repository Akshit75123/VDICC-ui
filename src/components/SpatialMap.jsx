import { useEffect, useRef, useState } from 'react'
import { MAP, PROXIMITY_RADIUS, ZONES } from '../data/commandCenter'

const statusClass = {
  critical: 'zone-critical border-red-400/70',
  degraded: 'zone-degraded border-amber-400/50 bg-amber-950/20',
  healthy: 'border-emerald-500/30 bg-emerald-950/15',
}

export default function SpatialMap({
  responders,
  huddles,
  selectedZoneId,
  nearbyIds,
  onSelectZone,
  onMoveSelf,
}) {
  const self = responders.find((person) => person.isSelf)
  const wrapRef = useRef(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const node = wrapRef.current
    if (!node) return undefined

    const update = () => {
      const next = Math.min(node.clientWidth / MAP.width, node.clientHeight / MAP.height)
      setScale(Number.isFinite(next) && next > 0 ? next : 1)
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className="relative min-h-0 min-w-0 flex-1 overflow-hidden bg-[#050d13] p-3">
      <div
        className="mx-auto"
        style={{ width: MAP.width * scale, height: MAP.height * scale }}
      >
        <div
          className="floor-grid relative rounded-xl border border-cyan-900/50 shadow-[inset_0_0_80px_rgba(8,47,73,0.45)]"
          style={{
            width: MAP.width,
            height: MAP.height,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
          onMouseDown={(event) => {
            const rect = event.currentTarget.getBoundingClientRect()
            onMoveSelf((event.clientX - rect.left) / scale, (event.clientY - rect.top) / scale)
          }}
        >
          <p className="pointer-events-none absolute bottom-4 left-4 z-10 text-[11px] uppercase tracking-[0.2em] text-cyan-500/70">
            Corridor · WASD / arrows / click empty floor to move
          </p>

          {ZONES.map((zone) => (
            <button
              key={zone.id}
              type="button"
              onMouseDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation()
                onSelectZone(zone)
              }}
              className={`absolute overflow-hidden rounded-lg border text-left ${statusClass[zone.status]} ${
                selectedZoneId === zone.id ? 'ring-2 ring-cyan-300' : ''
              }`}
              style={{ left: zone.x, top: zone.y, width: zone.w, height: zone.h }}
            >
              <div className="flex items-center justify-between gap-2 bg-black/25 px-3 py-1.5">
                <p className="truncate text-sm font-semibold text-slate-100">{zone.name}</p>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] uppercase ${
                    zone.status === 'critical'
                      ? 'bg-red-500/30 text-red-100'
                      : zone.status === 'degraded'
                        ? 'bg-amber-500/30 text-amber-100'
                        : 'bg-emerald-500/20 text-emerald-100'
                  }`}
                >
                  {zone.status}
                </span>
              </div>
              <p className="absolute bottom-2 left-3 font-mono text-[11px] text-slate-300/80">
                {zone.service} · p99 {zone.metrics.p99} · err {zone.metrics.errorRate}
              </p>
            </button>
          ))}

          {self ? (
            <div
              className="pointer-events-none absolute rounded-full border border-cyan-300/30"
              style={{
                left: self.x - PROXIMITY_RADIUS,
                top: self.y - PROXIMITY_RADIUS,
                width: PROXIMITY_RADIUS * 2,
                height: PROXIMITY_RADIUS * 2,
              }}
            >
              <div className="proximity-ring absolute inset-0 rounded-full border border-cyan-300/40" />
            </div>
          ) : null}

          {responders.map((person) => {
            const huddle = huddles.find((item) => item.id === person.huddleId)
            const inRange = nearbyIds.includes(person.id)
            return (
              <div
                key={person.id}
                className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2"
                style={{ left: person.x, top: person.y }}
              >
                <div className="flex flex-col items-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
                  {huddle ? (
                    <span className="mb-1 max-w-28 truncate rounded bg-violet-500 px-1.5 py-0.5 text-[9px] font-medium text-white">
                      {huddle.name}
                    </span>
                  ) : null}
                  <div
                    className={`grid h-10 w-10 place-items-center rounded-full text-xs font-bold text-slate-950 shadow-lg ${
                      person.isSelf ? 'ring-2 ring-white' : ''
                    } ${inRange ? 'ring-2 ring-cyan-300' : ''}`}
                    style={{ backgroundColor: person.color }}
                  >
                    {person.initials}
                  </div>
                  <span className="mt-1 rounded bg-slate-950/80 px-1.5 text-[10px] font-medium text-slate-100">
                    {person.name}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
