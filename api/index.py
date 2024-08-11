import requests
import pymongo
from groq import Groq
from datetime import datetime 
# import openai
# import ollama
from dotenv import load_dotenv
import os

from typing import Union, List
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from bson.json_util import dumps
from pymongo import ReturnDocument
import json
from bson import json_util
# from langchain_community.embeddings import HuggingFaceEmbeddings # new embedding method
class Thought(BaseModel):
	idea: str
	time: datetime
# Load environment variables from .env file
load_dotenv(dotenv_path='.env.local')

app = FastAPI()
# Access API key
api_key = os.getenv('HF_TOKEN')

hf_token = api_key
mongo_link = os.getenv('MONGO_LINK')
embedding_url = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"

# this is to allow front end to access api
origins = [
    "http://localhost:3000",  # React development server
    # Your production domain
    "https://smart-thoughts-mmm84xfit-toanminhbuis-projects.vercel.app/",
    "https://smart-thoughts.vercel.app",
    "https://smart-thoughts.vercel.app/brainstore",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


client = pymongo.MongoClient(mongo_link)
db = client.netflix_fast
collection = db.categories

def generate_embedding(text: str) -> list[float]:

	response = requests.post(
		embedding_url,
		headers={"Authorization": f"Bearer {hf_token}"},
		json={"inputs": text})

	if response.status_code != 200:
		raise ValueError(f"Request failed with status code {response.status_code}: {response.text}")

	return response.json()

@app.get("/api/search")
def retrieve_thoughts(question: str):
    info=""
    value=""
    relevant = ""
    try:
        results = collection.aggregate([
        {"$vectorSearch": {
            "queryVector": generate_embedding(question),
            "path": "desc_embedding",
            "numCandidates": 4000,
            "limit": 7,
            "index": "vector_index",
            }},
        ]);	
        # Serialize BSON data to JSON-compatible format
        json_results = dumps(results)  # Convert list to JSON string using bson.json_util
        return JSONResponse(content=json.loads(json_results))  # Return as JSONResponse
    except Exception as e:
        return (f"Error retrieving thought: {e}")


    
