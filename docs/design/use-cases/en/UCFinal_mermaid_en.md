# Standardized Final Use Case Diagrams — Mermaid Format

This document compiles the 15 standardized Use Case diagrams (1 general overview diagram and 14 detailed decomposition diagrams `UC01` through `UC14`) modeled according to UML 2.5 standards using **Mermaid `usecase-beta`** syntax.

---

## 1. General Overview Diagram (14 Core Use Cases)

> Source file: [General_en.mermaid](../ucs/en/General_en.mermaid)

```mermaid
usecase-beta
direction LR

actor Visitor("Visitor")
actor Admin("System Administrator (Admin)")
actor GpsSystem("GPS Positioning System")
actor AudioSystem("Audio System")

systemBoundary sys["Museum Multilingual Smart Audio Guide System"]
  UC01("Admin Authentication")
  UC02("Scan QR Code")
  UC03("Listen to Audio Guide")
  UC04("Switch Language")
  UC05("Save Favorite Artifacts")
  UC06("View Museum Information")
  UC07("View Synchronized Subtitles")
  UC08("Search Artifacts")
  UC09("Manage Artifacts")
  UC10("Manage Sessions & QR Codes")
  UC11("Manage Audio Files")
  UC12("View Listening Analytics")
  UC13("Manage Floor Maps")
  UC14("Geofencing & Auto Guide")
end

%% Visitor Actor Associations
Visitor --> UC02
Visitor --> UC03
Visitor --> UC04
Visitor --> UC05
Visitor --> UC06
Visitor --> UC08
Visitor --> UC14

%% Admin Actor Associations
Admin --> UC01
Admin --> UC09
Admin --> UC10
Admin --> UC11
Admin --> UC12
Admin --> UC13

%% External System Actors
GpsSystem --> UC14
AudioSystem --> UC03

%% <<include>> Relationships
UC09 ..> : include UC01
UC10 ..> : include UC01
UC11 ..> : include UC01
UC12 ..> : include UC01
UC13 ..> : include UC01

%% <<extend>> Relationships
UC07 ..> : extend UC03
UC14 ..> : extend UC03
```

---

## 2. Detailed Use Case Decomposition Diagrams (UC01 – UC14)

### UC01 — Admin Authentication
> Source file: [UC01_usecase_en.mermaid](../ucs/en/UC01_usecase_en.mermaid)

```mermaid
usecase-beta
direction LR

actor Admin("System Administrator (Admin)")

systemBoundary sys["Museum Multilingual Smart Audio Guide System"]
  UC01("Admin Authentication")
end

Admin --> UC01
```

### UC02 — Scan QR Code
> Source file: [UC02_usecase_en.mermaid](../ucs/en/UC02_usecase_en.mermaid)

```mermaid
usecase-beta
direction LR

actor Visitor("Visitor")

systemBoundary sys["Museum Multilingual Smart Audio Guide System"]
  UC02("Scan QR Code")
end

Visitor --> UC02
```

### UC03 — Listen to Audio Guide
> Source file: [UC03_usecase_en.mermaid](../ucs/en/UC03_usecase_en.mermaid)

```mermaid
usecase-beta
direction LR

actor Visitor("Visitor")
actor AudioSystem("Audio System")

systemBoundary sys["Museum Multilingual Smart Audio Guide System"]
  UC03("Listen to Audio Guide")
  UC07("View Synchronized Subtitles")
end

Visitor --> UC03
AudioSystem --> UC03
UC07 ..> : extend UC03
```

### UC04 — Switch Language
> Source file: [UC04_usecase_en.mermaid](../ucs/en/UC04_usecase_en.mermaid)

```mermaid
usecase-beta
direction LR

actor Visitor("Visitor")

systemBoundary sys["Museum Multilingual Smart Audio Guide System"]
  UC04("Switch Language")
end

Visitor --> UC04
```

### UC05 — Save Favorite Artifacts
> Source file: [UC05_usecase_en.mermaid](../ucs/en/UC05_usecase_en.mermaid)

```mermaid
usecase-beta
direction LR

actor Visitor("Visitor")

systemBoundary sys["Museum Multilingual Smart Audio Guide System"]
  UC05("Save Favorite Artifacts")
end

Visitor --> UC05
```

### UC06 — View Museum Information
> Source file: [UC06_usecase_en.mermaid](../ucs/en/UC06_usecase_en.mermaid)

```mermaid
usecase-beta
direction LR

actor Visitor("Visitor")

systemBoundary sys["Museum Multilingual Smart Audio Guide System"]
  UC06("View Museum Information")
end

Visitor --> UC06
```

### UC07 — View Synchronized Subtitles
> Source file: [UC07_usecase_en.mermaid](../ucs/en/UC07_usecase_en.mermaid)

```mermaid
usecase-beta
direction LR

actor Visitor("Visitor")

systemBoundary sys["Museum Multilingual Smart Audio Guide System"]
  UC03("Listen to Audio Guide")
  UC07("View Synchronized Subtitles")
end

Visitor --> UC03
UC07 ..> : extend UC03
```

### UC08 — Search Artifacts
> Source file: [UC08_usecase_en.mermaid](../ucs/en/UC08_usecase_en.mermaid)

```mermaid
usecase-beta
direction LR

actor Visitor("Visitor")

systemBoundary sys["Museum Multilingual Smart Audio Guide System"]
  UC08("Search Artifacts")
end

Visitor --> UC08
```

### UC09 — Manage Artifacts
> Source file: [UC09_usecase_en.mermaid](../ucs/en/UC09_usecase_en.mermaid)

```mermaid
usecase-beta
direction LR

actor Admin("System Administrator (Admin)")

systemBoundary sys["Museum Multilingual Smart Audio Guide System"]
  UC09("Manage Artifacts")
  UC01("Admin Authentication")
end

Admin --> UC09
UC09 ..> : include UC01
```

### UC10 — Manage Sessions & QR Codes
> Source file: [UC10_usecase_en.mermaid](../ucs/en/UC10_usecase_en.mermaid)

```mermaid
usecase-beta
direction LR

actor Admin("System Administrator (Admin)")

systemBoundary sys["Museum Multilingual Smart Audio Guide System"]
  UC10("Manage Sessions & QR Codes")
  UC01("Admin Authentication")
end

Admin --> UC10
UC10 ..> : include UC01
```

### UC11 — Manage Audio Files
> Source file: [UC11_usecase_en.mermaid](../ucs/en/UC11_usecase_en.mermaid)

```mermaid
usecase-beta
direction LR

actor Admin("System Administrator (Admin)")

systemBoundary sys["Museum Multilingual Smart Audio Guide System"]
  UC11("Manage Audio Files")
  UC01("Admin Authentication")
end

Admin --> UC11
UC11 ..> : include UC01
```

### UC12 — View Listening Analytics
> Source file: [UC12_usecase_en.mermaid](../ucs/en/UC12_usecase_en.mermaid)

```mermaid
usecase-beta
direction LR

actor Admin("System Administrator (Admin)")

systemBoundary sys["Museum Multilingual Smart Audio Guide System"]
  UC12("View Listening Analytics")
  UC01("Admin Authentication")
end

Admin --> UC12
UC12 ..> : include UC01
```

### UC13 — Manage Floor Maps
> Source file: [UC13_usecase_en.mermaid](../ucs/en/UC13_usecase_en.mermaid)

```mermaid
usecase-beta
direction LR

actor Admin("System Administrator (Admin)")

systemBoundary sys["Museum Multilingual Smart Audio Guide System"]
  UC13("Manage Floor Maps")
  UC01("Admin Authentication")
end

Admin --> UC13
UC13 ..> : include UC01
```

### UC14 — Geofencing & Auto Guide
> Source file: [UC14_usecase_en.mermaid](../ucs/en/UC14_usecase_en.mermaid)

```mermaid
usecase-beta
direction LR

actor Visitor("Visitor")
actor GpsSystem("GPS Positioning System")

systemBoundary sys["Museum Multilingual Smart Audio Guide System"]
  UC14("Geofencing & Auto Guide")
  UC03("Listen to Audio Guide")
end

Visitor --> UC14
GpsSystem --> UC14
UC14 ..> : extend UC03
```
