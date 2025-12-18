from fastapi import FastAPI
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load API Key
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI with Gemini!"}


class PromptRequest(BaseModel):
    topic: str
    mode: str = "text" 
    use_for: str         # e.g. Blog/Article, Social Media Post
    tone: str            # e.g. Casual, Professional, Funny
    platform: str        # e.g. ChatGPT, Gemini, Claude
    format: str = "Plain Text"  # Plain Text, JSON, Markdown
    length: str = "Medium"      # Short, Medium, Long
    strictness: str = "Strict"  # Loose, Normal, Strict

class SmartOptimizeRequest(BaseModel):
    user_prompt: str
    num_variants: int = 3

@app.post("/generate")
async def generate_prompt(req: PromptRequest):
    try:
        # Read instructions template from txt
        with open("instructions/generate_instructions.txt", "r") as f:
            template = f.read()
        
        # Replace placeholders with actual user input
        instruction = template.format(
            topic=req.topic,
            use_for=req.use_for,
            tone=req.tone,
            platform=req.platform,
            length=req.length,
            format=req.format,
            strictness=req.strictness
        )

        # Call Gemini model
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(instruction)
        clean_text = response.text.strip().replace("\n", " ")

        return {"generated_prompt": clean_text}
    
    except Exception as e:
        return {"error": str(e)}

@app.post("/optimize")
async def smart_optimize(req: SmartOptimizeRequest):
    try:
        # Read optimization instructions
        with open("instructions/optimize_instructions.txt", "r") as f:
            template = f.read()
        
        instruction = template.format(
            user_prompt=req.user_prompt,
            num_variants=req.num_variants
        )

        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(instruction)
        raw_text = response.text.strip()

        variants = [line.strip() for line in raw_text.split("\n") if line.strip()]
        scored_variants = [{"prompt": v, "score": 100 - len(v)} for v in variants]
        scored_variants.sort(key=lambda x: x["score"], reverse=True)

        return {"optimized_prompts": scored_variants}
    
    except Exception as e:
        return {"error": str(e)}