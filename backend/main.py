from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psutil
import platform
import time
import docker

app = FastAPI(title="EdgeDash API")

try:
    docker_client = docker.from_env()
except Exception as e:
    docker_client = None
    print(f"Docker not found in current dev environment: {e}")

# This is crucial: It allows your React frontend (running on a different port) to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, we will lock this down to your local IP later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "EdgeDash Core Engine is Online"}

@app.get("/api/system/stats")
def get_system_stats():
    """Returns the host machine's live CPU and RAM usage"""
    boot_time = psutil.boot_time()
    uptime_seconds = time.time() - boot_time
    return {
        "cpu_percent": psutil.cpu_percent(interval=0.1),
        "ram_percent": psutil.virtual_memory().percent,
        "uptime_seconds": uptime_seconds,
        "os": platform.system() + " " + platform.release(), 
        "status": "online"
    }

@app.get("/api/docker/status")
def get_docker_status():
    """Fetches the live status of all Docker containers"""
    if not docker_client:
        # Returns empty if testing in WSL without Docker Desktop
        return {"status": "error", "containers": []}
    
    try:
        results = []
        # list(all=True) gets running and stopped containers
        for c in docker_client.containers.list(all=True):
            results.append({
                "id": c.short_id,
                "name": c.name,
                "status": c.status, # e.g., 'running', 'exited'
            })
        return {"status": "success", "containers": results}
    except Exception as e:
        return {"status": "error", "containers": [], "error_msg": str(e)}