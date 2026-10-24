from fastapi import APIRouter
import psutil
import platform
import time

router = APIRouter()

@router.get("/api/system/stats")
def get_system_stats():
    boot_time = psutil.boot_time()
    return {
        "cpu_percent": psutil.cpu_percent(interval=0.1),
        "ram_percent": psutil.virtual_memory().percent,
        "uptime_seconds": time.time() - boot_time,
        "os": platform.system() + " " + platform.release(),
        "status": "online"
    }