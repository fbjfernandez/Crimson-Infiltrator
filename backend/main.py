import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from supabase import create_client, Client

# 1. Cargar variables de entorno y conectar a Supabase
load_dotenv()
url: str = os.getenv("SUPABASE_URL", "")
key: str = os.getenv("SUPABASE_KEY", "")
supabase: Client = create_client(url, key)

app = FastAPI(
    title="Crimson Infiltrator API",
    description="Motor lógico y económico para el simulador del sindicato.",
    version="1.0.0"
)

# 2. Definir el modelo de datos (Schema)
class GameSession(BaseModel):
    player_name: str
    credits: int = 10000
    heat: float = 0.05
    current_planet: str = "kessel"

@app.get("/")
def read_root():
    return {"status": "online", "message": "Crimson Intelligence Engine is running."}

# 3. Endpoint para guardar una nueva partida
@app.post("/api/sessions/")
def create_session(session: GameSession):
    try:
        # Convertir el modelo Pydantic a diccionario y enviarlo a Supabase
        response = supabase.table("game_sessions").insert(session.model_dump()).execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))