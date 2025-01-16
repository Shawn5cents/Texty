from typing import Optional, AsyncGenerator
import os
import httpx
import json
from pydantic_ai.models.base import BaseModel

__all__ = ['DeepseekClient']

class DeepseekClient(BaseModel):
    def __init__(self, model_name: str = "deepseek-chat", api_key: Optional[str] = None):
        self.model_name = model_name
        self.api_key = api_key or os.getenv("DEEPSEEK_API_KEY")
        if not self.api_key:
            raise ValueError("Deepseek API key is required")
            
        self.base_url = "https://api.deepseek.com/v1"
        self.client = httpx.AsyncClient(
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
        )

    async def generate(self, prompt: str, **kwargs) -> str:
        """Generate a single response for the given prompt."""
        response = await self.client.post(
            f"{self.base_url}/chat/completions",
            json={
                "model": self.model_name,
                "messages": [{"role": "user", "content": prompt}],
                **kwargs
            }
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]

    async def stream_chat(self, messages: list[dict], **kwargs) -> str:
        """Stream chat responses from the Deepseek API."""
        async with self.client.stream(
            "POST",
            f"{self.base_url}/chat/completions",
            json={
                "model": self.model_name,
                "messages": messages,
                "stream": True,
                **kwargs
            }
        ) as response:
            response.raise_for_status()
            async for chunk in response.aiter_lines():
                if chunk.startswith("data: "):
                    data = chunk[6:].strip()
                    if data == "[DONE]":
                        break
                    try:
                        chunk_data = json.loads(data)
                        if "choices" in chunk_data:
                            yield chunk_data["choices"][0]["delta"].get("content", "")
                    except json.JSONDecodeError:
                        continue

    async def get_embeddings(self, text: str) -> list[float]:
        response = await self.client.post(
            f"{self.base_url}/embeddings",
            json={
                "model": "text-embedding-v3",
                "input": text
            }
        )
        response.raise_for_status()
        return response.json()["data"][0]["embedding"]
