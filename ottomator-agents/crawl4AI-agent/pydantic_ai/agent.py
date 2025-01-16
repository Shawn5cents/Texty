from typing import Generic, TypeVar
from dataclasses import dataclass

T = TypeVar('T')

@dataclass
class RunContext(Generic[T]):
    deps: T

from typing import AsyncGenerator
import asyncio
from dataclasses import asdict

class Agent:
    def __init__(self, model, system_prompt=None, deps_type=None, retries=0):
        self.model = model
        self.system_prompt = system_prompt
        self.deps_type = deps_type
        self.retries = retries
        self._tools = {}

    def tool(self, func):
        self._tools[func.__name__] = func
        return func

    async def run(self, input_text: str, context: RunContext) -> AsyncGenerator[str, None]:
        """Run the agent with streaming response support"""
        try:
            # Prepare the initial message
            messages = [{
                "role": "system",
                "content": self.system_prompt
            }] if self.system_prompt else []
            
            messages.append({
                "role": "user",
                "content": input_text
            })

            # Stream the response from the model
            async for chunk in self.model.stream_chat(messages):
                yield chunk

        except Exception as e:
            yield f"Error: {str(e)}"

class ModelRetry:
    def __init__(self, max_retries=3):
        self.max_retries = max_retries
