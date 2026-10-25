from fastapi import APIRouter
import httpx

router = APIRouter()

QBITTORRENT_URL = "http://127.0.0.1:8080" 

@router.get("/api/apps/qbittorrent")
async def get_qbit_stats():
    """Fetches live transfer speeds and active torrent progress"""
    try:
        async with httpx.AsyncClient() as client:
            transfer_res = await client.get(f"{QBITTORRENT_URL}/api/v2/transfer/info", timeout=2.0)
            transfer_data = transfer_res.json()

            torrents_res = await client.get(f"{QBITTORRENT_URL}/api/v2/torrents/info?filter=downloading", timeout=2.0)
            torrents_data = torrents_res.json()

            active_torrent = None
            if torrents_data and len(torrents_data) > 0:
                t = torrents_data[0]
                active_torrent = {
                    "name": t.get("name"),
                    "progress": round(t.get("progress", 0) * 100, 1),
                    "speed_mb": round(t.get("dlspeed", 0) / (1024 * 1024), 1)
                }

            return {
                "status": "online",
                "global_dl_mb": round(transfer_data.get("dl_info_speed", 0) / (1024 * 1024), 1),
                "active_torrent": active_torrent
            }
            
    except Exception as e:
        return {"status": "offline", "error": str(e)}