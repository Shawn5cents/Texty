from typing import Literal, Optional, List
from pydantic import BaseModel, Field

class ModelMessage(BaseModel):
    role: Literal['system', 'user', 'assistant']
    content: str
    timestamp: Optional[str] = None

class ModelRequest(BaseModel):
    parts: List['MessagePart']
    
class ModelResponse(BaseModel):
    parts: List['MessagePart']

class SystemPromptPart(BaseModel):
    part_kind: Literal['system-prompt'] = 'system-prompt'
    content: str

class UserPromptPart(BaseModel):
    part_kind: Literal['user-prompt'] = 'user-prompt'
    content: str

class TextPart(BaseModel):
    part_kind: Literal['text'] = 'text'
    content: str

class ToolCallPart(BaseModel):
    part_kind: Literal['tool-call'] = 'tool-call'
    name: str
    arguments: dict

class ToolReturnPart(BaseModel):
    part_kind: Literal['tool-return'] = 'tool-return'
    name: str
    content: str

class RetryPromptPart(BaseModel):
    part_kind: Literal['retry-prompt'] = 'retry-prompt'
    content: str

class ModelMessagesTypeAdapter(BaseModel):
    messages: List[ModelMessage]

MessagePart = SystemPromptPart | UserPromptPart | TextPart | ToolCallPart | ToolReturnPart | RetryPromptPart
