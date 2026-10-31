import { MAP, PROXIMITY_RADIUS, ZONES } from '../data/commandCenter'

export function clampPosition(x, y) {
  return {
    x: Math.max(48, Math.min(MAP.width - 48, x)),
    y: Math.max(48, Math.min(MAP.height - 48, y)),
  }
}

export function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function nearbyResponders(self, responders) {
  return responders.filter(
    (person) => person.id !== self.id && distance(self, person) <= PROXIMITY_RADIUS,
  )
}

export function zoneAt(x, y) {
  return ZONES.find(
    (zone) => x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h,
  )
}

export function formatElapsed(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0')
  const seconds = (totalSeconds % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}
