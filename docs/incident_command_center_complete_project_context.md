# 🛸 Real-Time Spatial DevOps Incident Command Center
> **System Context & Complete Product Documentation**

---

## 1. Executive Summary & Core Value Proposition

The **Real-Time Spatial DevOps Incident Command Center** is a persistent, 2D spatial canvas designed to streamline remote incident management for software engineering and DevOps teams. 

Instead of routing responders to fragmented Zoom calls and noisy Slack threads during critical production outages, the platform renders a 2D interactive floor plan representing the organization's real-world system architecture (e.g., *Database Zone*, *Payment API*, *Frontend CDN*, *Kubernetes Cluster*).

### Primary Objective
Drastically reduce **Mean Time to Resolution (MTTR)** and **Mean Time to Align (MTTA)** during critical software system outages by offering spatial presence, proximity-based WebRTC voice collaboration, isolated task huddles, and real-time telemetry stream integrations directly on a shared canvas.

---

## 2. Problem Statement

When a major production system fails, traditional remote incident response tools introduce severe communication friction:

* **Audio Cross-Talk & Zoom Fatigue:** A single conference call with 25+ responders leads to people talking over each other or staying disengaged while a small sub-team debugs a specific issue.
* **Lack of Spatial & Team Awareness:** Incident Commanders and SRE leads lack visibility into *who* is actively investigating *what*, leading to duplicate work and continuous Slack pings asking for updates.
* **Fragmented Context Switching:** Responders waste critical minutes toggling between chat channels, video calls, log aggregators (Datadog/Grafana), and cloud terminals.

---

## 3. Product Architecture & Tech Stack

The platform is designed around a unified **Full-Stack TypeScript** architecture paired with **Redis** for sub-millisecond ephemeral state calculations and **PostgreSQL** for persistent audit trail storage.

```text
               +----------------------------------+
               |   React + TypeScript Frontend    |
               | - Phaser.js / HTML5 Canvas       |
               | - LiveKit WebRTC Client SDK      |
               | - Tailwind CSS Dashboard Panels  |
               +----------------+-----------------+
                                |
             +------------------+------------------+
             |                                     |
   [WebSocket / Socket.io]                   [WebRTC SFU]
  Movement & Spatial State                  Audio / Video Streams
             |                                     |
             v                                     v
+----------------------------+           +-------------------+
|  Node.js + Express + TS    |           |  LiveKit SFU      |
|  - Socket.io Gateway       |           |  Media Server     |
|  - Webhook Ingestion Engine|           +-------------------+
+-------------+--------------+
              |
       +------+------+
       |             |
       v             v
  +---------+   +---------------+
  | Redis   |   | PostgreSQL    |
  | Cache   |   | Database      |
  +---------+   +---------------+
```

### Stack Components

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | React + TypeScript + Tailwind CSS | Control dashboards, alert sidebars, log viewing modals. |
| **2D Engine** | Phaser.js (or HTML5 Canvas) | Renders grid map, avatar movement, collision boxes, and zones. |
| **Backend API** | Node.js + Express + TypeScript | REST endpoints, webhook ingestion, socket gateway management. |
| **Real-time Sync** | Socket.io | Bi-directional streaming of avatar coordinates and map updates. |
| **Ephemeral State** | Redis (via `ioredis`) | Fast in-memory storage for avatar positions and active room states. |
| **Database** | PostgreSQL | Persistent relational storage for user profiles, map zones, and incident audit logs. |
| **Media Server** | LiveKit SFU (or Mediasoup) | Selective Forwarding Unit for proximity-based WebRTC voice streams. |

---

## 4. Key Product Features & Capabilities

### 1. Interactive 2D System Topology Map
* Maps virtual space directly to actual microservices architecture.
* Real-time avatar movement synced across connected clients via WebSockets.
* Visual status indicators on user avatars (e.g., *Debugging DB Pool*, *In Private Huddle*).

### 2. Proximity-Based Audio & Private Huddle Sub-Rooms
* **Proximity Voice:** Connects responders to low-latency WebRTC audio channels automatically when their avatars enter the same spatial zone or proximity radius.
* **1-Click Task Huddles:** Allows responders to instantiate private sub-room channels for dedicated technical pair-debugging, isolated from general floor audio.
* **Visual Huddle Badges:** Renders visual status badges over avatars participating in private huddles to indicate their specific focus area to the Incident Commander.

### 3. Real-Time Telemetry & Alert Ingestion
* Ingests incoming alerts from monitoring platforms (Prometheus, Datadog, PagerDuty, Grafana) via HTTP Webhooks.
* Triggers visual state updates (such as flashing red floor highlights) on affected infrastructure zones within 2 seconds of alert ingestion.
* Enables interactive map objects that expand into live log streams, APM traces, or metric dashboards upon user interaction.
