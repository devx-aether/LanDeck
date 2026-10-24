from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db, AuditLog

router = APIRouter()

@router.get("/api/logs")
def get_audit_logs(db: Session = Depends(get_db)):
    """Returns the 10 most recent system actions"""
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(10).all()
    return {"logs": [{"id": l.id, "action": l.action, "target": l.target, "time": l.timestamp} for l in logs]}