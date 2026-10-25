from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import all 4 of your routers
from app.routers import system, services, clipboard, logs, apps

app = FastAPI(title="LanDeck Core Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect the routers to the main app
app.include_router(system.router)
app.include_router(services.router)
app.include_router(clipboard.router)
app.include_router(logs.router)
app.include_router(apps.router)

@app.get("/")
def read_root():
    return {"message": "LanDeck Core Engine is Online"}