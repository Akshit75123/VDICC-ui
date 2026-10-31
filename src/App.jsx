import { useEffect, useMemo, useState } from 'react'
import AlertSidebar from './components/AlertSidebar'
import CommandBar from './components/CommandBar'
import SpatialMap from './components/SpatialMap'
import TelemetryModal from './components/TelemetryModal'
import TelemetryPanel from './components/TelemetryPanel'
import {
  INITIAL_ALERTS,
  INITIAL_HUDDLES,
  INITIAL_RESPONDERS,
  SELF_ID,
  ZONES,
} from './data/commandCenter'
import { clampPosition, formatElapsed, nearbyResponders, zoneAt } from './lib/spatial'

export default function App() {
  const [responders, setResponders] = useState(INITIAL_RESPONDERS)
  const [huddles, setHuddles] = useState(INITIAL_HUDDLES)
  const [alerts, setAlerts] = useState(INITIAL_ALERTS)
  const [selectedZoneId, setSelectedZoneId] = useState('payments')
  const [modalZoneId, setModalZoneId] = useState(null)
  const [muted, setMuted] = useState(false)
  const [elapsed, setElapsed] = useState(312)

  const self = responders.find((person) => person.id === SELF_ID)
  const nearby = useMemo(() => (self ? nearbyResponders(self, responders) : []), [self, responders])
  const selectedZone = ZONES.find((zone) => zone.id === selectedZoneId) ?? null
  const modalZone = ZONES.find((zone) => zone.id === modalZoneId) ?? null
  const inHuddle = Boolean(self?.huddleId)

  useEffect(() => {
    const timer = setInterval(() => setElapsed((value) => value + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const onDown = (event) => {
      const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', a: 'left', s: 'down', d: 'right' }
      const dir = map[event.key]
      if (!dir) return
      if (event.cancelable) event.preventDefault()
      const speed = event.repeat ? 22 : 28
      setResponders((current) =>
        current.map((person) => {
          if (person.id !== SELF_ID) return person
          let { x, y } = person
          if (dir === 'up') y -= speed
          if (dir === 'down') y += speed
          if (dir === 'left') x -= speed
          if (dir === 'right') x += speed
          const next = clampPosition(x, y)
          const zone = zoneAt(next.x, next.y)
          if (zone) setSelectedZoneId(zone.id)
          return {
            ...person,
            ...next,
            status: person.huddleId ? person.status : zone ? `In ${zone.name}` : 'On the floor',
          }
        }),
      )
    }
    const onKey = (event) => {
      if (event.key === 'Escape') setModalZoneId(null)
      onDown(event)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setResponders((current) =>
        current.map((person) => {
          if (person.isSelf || person.huddleId) return person
          const jitter = (Math.random() - 0.5) * 10
          return {
            ...person,
            ...clampPosition(person.x + jitter, person.y + (Math.random() - 0.5) * 8),
          }
        }),
      )
    }, 2200)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const extra = [
      {
        id: `a-${Date.now()}`,
        source: 'Prometheus',
        severity: 'critical',
        title: 'payments-postgres lock wait spike',
        zoneId: 'db',
        time: new Date().toLocaleTimeString([], { hour12: false }),
        age: 'now',
      },
    ]
    const timer = setTimeout(() => {
      setAlerts((current) => [extra[0], ...current])
    }, 8000)
    return () => clearTimeout(timer)
  }, [])

  function moveSelf(x, y) {
    setResponders((current) =>
      current.map((person) => {
        if (person.id !== SELF_ID) return person
        const next = clampPosition(x, y)
        const zone = zoneAt(next.x, next.y)
        if (zone) setSelectedZoneId(zone.id)
        return {
          ...person,
          ...next,
          status: person.huddleId ? person.status : zone ? `In ${zone.name}` : 'On the floor',
        }
      }),
    )
  }

  function startHuddle() {
    if (!self || nearby.length === 0) return
    const huddleId = `huddle-${Date.now()}`
    const members = [SELF_ID, ...nearby.map((person) => person.id)]
    const zone = zoneAt(self.x, self.y)
    setHuddles((current) => [
      ...current
        .map((huddle) => ({
          ...huddle,
          members: huddle.members.filter((id) => !members.includes(id)),
        }))
        .filter((huddle) => huddle.members.length > 0),
      { id: huddleId, name: zone ? `${zone.name} huddle` : 'Task huddle', zoneId: zone?.id ?? null, members },
    ])
    setResponders((current) =>
      current.map((person) =>
        members.includes(person.id)
          ? { ...person, huddleId, status: 'In private huddle' }
          : person,
      ),
    )
  }

  function leaveHuddle() {
    if (!self?.huddleId) return
    const huddleId = self.huddleId
    setResponders((current) =>
      current.map((person) =>
        person.huddleId === huddleId && person.id === SELF_ID
          ? { ...person, huddleId: null, status: 'Commanding floor' }
          : person,
      ),
    )
    setHuddles((current) =>
      current
        .map((huddle) =>
          huddle.id === huddleId
            ? { ...huddle, members: huddle.members.filter((id) => id !== SELF_ID) }
            : huddle,
        )
        .filter((huddle) => huddle.members.length > 0),
    )
  }

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-[#071018] text-slate-200">
      <CommandBar
        elapsed={formatElapsed(elapsed)}
        muted={muted}
        onToggleMute={() => setMuted((value) => !value)}
        huddleCount={huddles.length}
        nearbyCount={nearby.length}
      />
      <div className="relative flex min-h-0 flex-1">
        <AlertSidebar
          alerts={alerts}
          selectedZoneId={selectedZoneId}
          onSelectAlert={(alert) => {
            setSelectedZoneId(alert.zoneId)
            setModalZoneId(alert.zoneId)
          }}
        />
        <SpatialMap
          responders={responders}
          huddles={huddles}
          selectedZoneId={selectedZoneId}
          nearbyIds={nearby.map((person) => person.id)}
          onSelectZone={(zone) => {
            setSelectedZoneId(zone.id)
            setModalZoneId(zone.id)
          }}
          onMoveSelf={moveSelf}
        />
        <TelemetryPanel
          responders={responders}
          huddles={huddles}
          nearby={nearby}
          inHuddle={inHuddle}
          onStartHuddle={startHuddle}
          onLeaveHuddle={leaveHuddle}
          selectedZone={selectedZone}
          onOpenTelemetry={(zone) => setModalZoneId(zone.id)}
        />
        <TelemetryModal zone={modalZone} onClose={() => setModalZoneId(null)} />
      </div>
    </div>
  )
}
