# LanDeck
LanDeck is a lightweight, self-hosted server telemetry and container management dashboard designed to monitor host health, Docker containers, and specific application metrics in real time through a modern Progressive Web App (PWA) interface

## Features
- Host Telemetry: Real-time system monitoring tracking CPU usage, memory consumption, host uptime, and operating system information.   Container Fleet Management: Live status tracking and orchestration controls for all active and stopped Docker containers on the host.   
- App-Specific Rich Telemetry: Deep integration with applications like qBittorrent and Jellyfin to display active download speeds, torrent progress, and streaming data dynamically.  
- Zero-Trust Security Monitor: Built-in Tailscale mesh network monitoring to track node status, secure IP assignment, and network connectivity.   
- Progressive Web App (PWA): Fully mobile-responsive interface that can be installed directly to a mobile device home screen for on-the-go server management.

## TechStack
- Backend: Python, FastAPI, Uvicorn, Httpx, Psutil, Subprocess   
- Frontend: React, Vite, Tailwind CSS, Lucide Icons, Vite PWA Plugin   
- Interfacing Layer: Docker SDK / CLI integration, application REST APIs, and native socket probing   

## Getting Started
### 1. Backend Setup
Navigate to the backend directory, install the required dependencies, and start the FastAPI server:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```
### 2. Frontend Setup
Navigate to the frontend directory, install the node modules.
```bash
cd frontend
npm install
npm run dev -- --host
```