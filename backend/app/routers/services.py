from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import docker
from app.db.database import get_db, AuditLog

router = APIRouter()

try:
    docker_client = docker.from_env()
except Exception:
    docker_client = None

@router.get("/api/docker/status")
def get_docker_status():
    if not docker_client:
        return {"status": "error", "containers": []}
    
    results = [{"id": c.short_id, "name": c.name, "status": c.status} 
               for c in docker_client.containers.list(all=True)]
    return {"status": "success", "containers": results}

@router.post("/api/docker/{container_id}/{action}")
def control_docker_container(container_id: str, action: str, db: Session = Depends(get_db)):
    if not docker_client:
        return {"status": "error", "message": "Docker not connected"}
    
    try:
        container = docker_client.containers.get(container_id)
        getattr(container, action)() # Elegantly runs .start(), .stop(), or .restart()
        
        # Log it
        new_log = AuditLog(action=f"{action.upper()}_CONTAINER", target=container.name)
        db.add(new_log)
        db.commit()
            
        return {"status": "success", "action": action, "container": container.name}
    except Exception as e:
        return {"status": "error", "message": str(e)}