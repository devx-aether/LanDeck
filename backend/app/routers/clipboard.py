from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db.database import get_db, PersistentClipboard

router = APIRouter()

class ClipboardItem(BaseModel):
    text: str

@router.get("/api/clipboard")
def get_clipboard(db: Session = Depends(get_db)):
    """Fetches the clipboard from the SQLite database"""
    clip = db.query(PersistentClipboard).first()
    if not clip:
        clip = PersistentClipboard(content="")
        db.add(clip)
        db.commit()
    return {"text": clip.content}

@router.post("/api/clipboard")
def update_clipboard(item: ClipboardItem, db: Session = Depends(get_db)):
    """Updates the clipboard in the database"""
    clip = db.query(PersistentClipboard).first()
    if not clip:
        clip = PersistentClipboard(content=item.text)
        db.add(clip)
    else:
        clip.content = item.text
    db.commit()
    return {"status": "success", "text": clip.content}