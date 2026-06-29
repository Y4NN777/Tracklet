# C4 Context Diagram — Tracklet

```mermaid
C4Context
  title System Context — Tracklet

  Person(micro_entrepreneur, "Micro-entrepreneur", "Young business owner aged 18-30, Burkina Faso / AOF")

  System(tracklet, "Tracklet", "Financial copilot: pockets, sales, expenses, debts, margin, goals — all offline")

  System_Ext(device_storage, "Device File System", "Exported reports (PDF, image)")

  System_Ext(android_os, "Android OS", "Sandbox, screen lock, storage")

  Rel(micro_entrepreneur, tracklet, "Uses daily on Android", "Tap, form input")
  Rel(tracklet, device_storage, "Writes exports to", "PDF, PNG")
  Rel(tracklet, android_os, "Runs within", "Chrome / PWA sandbox")

  UpdateLayoutConfig($c4ShapeInRow="2", $c4BoundaryInRow="1")
```

## Description

Tracklet has no backend, no API, no cloud, and no network dependencies.
The entire system is the PWA running on the user's Android device.
External systems are limited to the device OS and file system for exports.
