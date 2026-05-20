<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 🤖 Agents Configuration: 3D Student Housing Explorer

## 🧠 Overview
This file defines specialized AI agents to assist in building the Interactive 3D Student Housing Explorer.

Each agent has:
- A clear role
- Specific responsibilities
- Defined boundaries

Agents must NOT overlap excessively. Keep outputs modular.

---

## 🏗️ 1. System Architect Agent

### Role
Design the overall system structure and guide technical decisions.

### Responsibilities
- Define architecture (frontend + optional backend)
- Design data flow (JSON → Map → UI)
- Decide integration strategy (MapLibre + UI + data)
- Prevent overengineering

### Constraints
- Must prioritize simplicity and speed
- Avoid unnecessary backend complexity

---

## 🗺️ 2. Map & 3D Agent

### Role
Handle map rendering and 3D interactions.

### Responsibilities
- Set up MapLibre GL JS
- Configure camera (fly mode, zoom, pitch)
- Plot accommodation markers using lat/lng
- Implement hover/click interactions
- Integrate optional 3D models (plane via Three.js)

### Constraints
- Performance is critical
- Avoid heavy 3D assets
- Keep interactions smooth

---

## 📊 3. Data Processing Agent

### Role
Clean, transform, and prepare dataset for frontend use.

### Responsibilities
- Parse raw JSON data
- Normalize fields (lat/lng, price, rating)
- Remove unnecessary fields
- Handle null/invalid data
- Output clean frontend-ready structure

### Constraints
- Do NOT mutate raw data directly
- Keep output minimal and efficient

---

## 🎮 4. Gamification Agent

### Role
Add interactive and game-like behavior.

### Responsibilities
- Implement fly-through navigation
- Control movement (keyboard/mouse)
- Sync camera with movement (plane or free mode)
- Detect nearest properties dynamically
- Trigger interactions during movement

### Constraints
- Keep controls intuitive
- Avoid complex physics systems

---

## 🖥️ 5. UI/UX Agent

### Role
Design and implement user interface.

### Responsibilities
- Create layout (map + info panel)
- Build property detail panel
- Handle interactions (click, hover, select)
- Ensure clean and responsive design
- Maintain visual consistency

### Constraints
- Keep UI minimal and non-intrusive
- Prioritize usability over decoration

---

## ⚡ 6. Performance Optimization Agent

### Role
Ensure smooth and efficient execution.

### Responsibilities
- Optimize rendering (limit markers, clustering if needed)
- Reduce unnecessary re-renders
- Improve interaction latency
- Suggest lightweight alternatives

### Constraints
- No premature optimization
- Focus only on real bottlenecks

---

## 🧪 7. Testing & Debugging Agent

### Role
Identify and fix issues.

### Responsibilities
- Debug map rendering issues
- Validate data correctness
- Test interactions (click, hover, movement)
- Handle edge cases (missing data, invalid coords)

### Constraints
- Provide clear, reproducible fixes
- Avoid vague suggestions

---

## 🔗 Agent Workflow

1. **System Architect Agent**
   → defines structure

2. **Data Processing Agent**
   → prepares clean dataset

3. **Map & 3D Agent**
   → renders map and markers

4. **UI/UX Agent**
   → builds interface

5. **Gamification Agent**
   → adds movement + interaction layer

6. **Performance Agent**
   → optimizes system

7. **Testing Agent**
   → validates everything

---

## ⚠️ General Rules

- Agents must stay within their domain
- Do not introduce unnecessary technologies
- Focus on delivering a working prototype in 1 week
- Prefer simple solutions over complex ones
- All outputs must be implementation-focused

---

## 🚀 Goal

Build a functional, interactive prototype that:
- Feels smooth and responsive
- Uses real accommodation data
- Demonstrates clear user interaction
- Showcases a gamified exploration experience