export const MAP = { width: 1100, height: 720 }

export const ZONES = [
  {
    id: 'cdn',
    name: 'Frontend CDN',
    x: 40,
    y: 40,
    w: 300,
    h: 210,
    status: 'healthy',
    service: 'edge-cache',
    metrics: { p99: '82ms', errorRate: '0.04%', rps: '14.2k' },
  },
  {
    id: 'k8s',
    name: 'Kubernetes Cluster',
    x: 380,
    y: 40,
    w: 340,
    h: 210,
    status: 'degraded',
    service: 'prod-cluster',
    metrics: { p99: '410ms', errorRate: '1.8%', rps: '9.1k' },
  },
  {
    id: 'payments',
    name: 'Payment API',
    x: 760,
    y: 40,
    w: 300,
    h: 210,
    status: 'critical',
    service: 'payments-api',
    metrics: { p99: '2.4s', errorRate: '18.6%', rps: '1.1k' },
  },
  {
    id: 'db',
    name: 'Database Zone',
    x: 40,
    y: 290,
    w: 420,
    h: 240,
    status: 'critical',
    service: 'payments-postgres',
    metrics: { p99: '6.1s', errorRate: '22.0%', rps: '840' },
  },
  {
    id: 'auth',
    name: 'Auth Gateway',
    x: 500,
    y: 290,
    w: 260,
    h: 240,
    status: 'healthy',
    service: 'oidc-gateway',
    metrics: { p99: '64ms', errorRate: '0.01%', rps: '3.4k' },
  },
  {
    id: 'queue',
    name: 'Message Queue',
    x: 800,
    y: 290,
    w: 260,
    h: 240,
    status: 'degraded',
    service: 'checkout-queue',
    metrics: { p99: '920ms', errorRate: '3.2%', rps: '2.0k' },
  },
]

export const SELF_ID = 'you'

export const INITIAL_RESPONDERS = [
  {
    id: SELF_ID,
    name: 'Akshit',
    role: 'Incident Commander',
    initials: 'AK',
    color: '#38bdf8',
    x: 200,
    y: 480,
    status: 'Commanding floor',
    huddleId: null,
    speaking: false,
    isSelf: true,
  },
  {
    id: 'maya',
    name: 'Maya Chen',
    role: 'SRE',
    initials: 'MC',
    color: '#34d399',
    x: 160,
    y: 390,
    status: 'Debugging DB pool',
    huddleId: 'huddle-db',
    speaking: true,
  },
  {
    id: 'jordan',
    name: 'Jordan Hale',
    role: 'DBA',
    initials: 'JH',
    color: '#a78bfa',
    x: 240,
    y: 430,
    status: 'In private huddle',
    huddleId: 'huddle-db',
    speaking: false,
  },
  {
    id: 'priya',
    name: 'Priya Nair',
    role: 'Payments eng',
    initials: 'PN',
    color: '#fb7185',
    x: 910,
    y: 148,
    status: 'Tracing Payment 5xx',
    huddleId: null,
    speaking: false,
  },
  {
    id: 'sam',
    name: 'Sam Ortiz',
    role: 'Frontend',
    initials: 'SO',
    color: '#fbbf24',
    x: 185,
    y: 148,
    status: 'Watching CDN',
    huddleId: null,
    speaking: false,
  },
  {
    id: 'lee',
    name: 'Lee Park',
    role: 'Platform',
    initials: 'LP',
    color: '#22d3ee',
    x: 545,
    y: 148,
    status: 'Checking pod restarts',
    huddleId: null,
    speaking: false,
  },
]

export const INITIAL_HUDDLES = [
  {
    id: 'huddle-db',
    name: 'DB connection pool',
    zoneId: 'db',
    members: ['maya', 'jordan'],
  },
]

export const INITIAL_ALERTS = [
  {
    id: 'a1',
    source: 'PagerDuty',
    severity: 'critical',
    title: 'Payment API error budget exhausted',
    zoneId: 'payments',
    time: '11:42:08',
    age: '4m',
  },
  {
    id: 'a2',
    source: 'Datadog',
    severity: 'critical',
    title: 'Postgres connection pool saturated',
    zoneId: 'db',
    time: '11:41:51',
    age: '5m',
  },
  {
    id: 'a3',
    source: 'Prometheus',
    severity: 'warning',
    title: 'checkout-queue lag > 90s',
    zoneId: 'queue',
    time: '11:40:12',
    age: '6m',
  },
  {
    id: 'a4',
    source: 'Grafana',
    severity: 'warning',
    title: 'k8s node CPU steal on payments-workers',
    zoneId: 'k8s',
    time: '11:39:44',
    age: '7m',
  },
  {
    id: 'a5',
    source: 'Datadog',
    severity: 'info',
    title: 'CDN cache hit ratio recovered to 97%',
    zoneId: 'cdn',
    time: '11:38:02',
    age: '8m',
  },
]

export const LOG_LINES = {
  payments: [
    { t: '11:46:01.102', level: 'ERROR', msg: 'POST /v2/charges 504 upstream timeout db=payments-postgres' },
    { t: '11:46:00.884', level: 'WARN', msg: 'retrying Stripe capture attempt=3 charge_id=ch_9f2a' },
    { t: '11:45:59.441', level: 'ERROR', msg: 'HikariPool-1 - Connection is not available, request timed out after 30000ms' },
    { t: '11:45:58.210', level: 'INFO', msg: 'circuit breaker payments-db HALF_OPEN -> OPEN' },
    { t: '11:45:56.033', level: 'ERROR', msg: 'span payments.authorize duration=2412ms status=error' },
  ],
  db: [
    { t: '11:46:02.441', level: 'ERROR', msg: 'FATAL: remaining connection slots are reserved' },
    { t: '11:46:01.990', level: 'WARN', msg: 'active connections 198/200  waiting=46' },
    { t: '11:45:59.118', level: 'ERROR', msg: 'lock wait timeout on checkout_sessions pk' },
    { t: '11:45:57.702', level: 'INFO', msg: 'autovacuum: checkout_events skipped due to lock' },
    { t: '11:45:54.220', level: 'WARN', msg: 'replication lag replica-b 12.4s' },
  ],
  k8s: [
    { t: '11:45:48.001', level: 'WARN', msg: 'pod payments-api-7f2d restarted reason=OOMKilled' },
    { t: '11:45:41.330', level: 'INFO', msg: 'HPA scale payments-api 8 -> 12' },
    { t: '11:45:22.910', level: 'WARN', msg: 'node ip-10-2-14-8 cpu steal 38%' },
  ],
  queue: [
    { t: '11:45:50.200', level: 'WARN', msg: 'consumer lag checkout.settled 94s' },
    { t: '11:45:44.018', level: 'ERROR', msg: 'nack settlement.job after 5 attempts' },
  ],
  cdn: [
    { t: '11:44:12.100', level: 'INFO', msg: 'purge complete path=/checkout/*' },
    { t: '11:43:01.440', level: 'INFO', msg: 'origin health check 200 64ms' },
  ],
  auth: [
    { t: '11:45:10.002', level: 'INFO', msg: 'token exchange p99=61ms' },
  ],
}

export const TRACES = {
  payments: [
    { span: 'gateway.http', dur: 2412, status: 'error' },
    { span: 'payments.authorize', dur: 2280, status: 'error' },
    { span: 'postgres.query', dur: 2104, status: 'error' },
    { span: 'redis.idempotency', dur: 8, status: 'ok' },
  ],
  db: [
    { span: 'pg.acquire_conn', dur: 30000, status: 'error' },
    { span: 'pg.select checkout_sessions', dur: 6120, status: 'error' },
    { span: 'pg.commit', dur: 0, status: 'error' },
  ],
  k8s: [
    { span: 'kubelet.sync', dur: 410, status: 'ok' },
    { span: 'cAdvisor.scrape', dur: 88, status: 'ok' },
  ],
  queue: [
    { span: 'kafka.poll', dur: 920, status: 'ok' },
    { span: 'worker.settle', dur: 1400, status: 'error' },
  ],
  cdn: [
    { span: 'edge.fetch', dur: 82, status: 'ok' },
  ],
  auth: [
    { span: 'oidc.token', dur: 64, status: 'ok' },
  ],
}

export const PROXIMITY_RADIUS = 120
