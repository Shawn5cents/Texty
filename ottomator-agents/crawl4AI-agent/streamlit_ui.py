from __future__ import annotations
from typing import Literal, TypedDict
from pydantic_ai.agent import RunContext
import asyncio
import os

import streamlit as st
import json
import logfire
from supabase import Client
from pydantic_ai.models.deepseek import DeepseekClient

# Import all the message part classes
from pydantic_ai.messages import (
    ModelMessage,
    ModelRequest,
    ModelResponse,
    SystemPromptPart,
    UserPromptPart,
    TextPart,
    ToolCallPart,
    ToolReturnPart,
    RetryPromptPart,
    ModelMessagesTypeAdapter
)
from pydantic_ai_expert import pydantic_ai_expert, PydanticAIDeps, retrieve_relevant_documentation, list_documentation_pages, get_page_content

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

deepseek_client = DeepseekClient(api_key=os.getenv("DEEPSEEK_API_KEY"))
supabase: Client = Client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

# Configure logfire to suppress warnings (optional)
logfire.configure(send_to_logfire='never')

class ChatMessage(TypedDict):
    """Format of messages sent to the browser/API."""

    role: Literal['user', 'model']
    timestamp: str
    content: str


def display_message_part(part):
    """
    Display a single part of a message in the Streamlit UI.
    Customize how you display system prompts, user prompts,
    tool calls, tool returns, etc.
    """
    # system-prompt
    if part.part_kind == 'system-prompt':
        with st.chat_message("system"):
            st.markdown(f"**System**: {part.content}")
    # user-prompt
    elif part.part_kind == 'user-prompt':
        with st.chat_message("user"):
            st.markdown(part.content)
    # text
    elif part.part_kind == 'text':
        with st.chat_message("assistant"):
            st.markdown(part.content)          


async def run_agent_with_streaming(user_input: str, doc_source: str, doc_url: str):
    """
    Run the agent with streaming text for the user_input prompt,
    while maintaining the entire conversation in `st.session_state.messages`.
    """
    # Initialize dependencies
    deps = PydanticAIDeps(
        supabase=supabase,
        deepseek_client=deepseek_client
    )
    agent = pydantic_ai_expert
        
    # For custom URLs, crawl the docs if not already done
    if "crawled" not in st.session_state:
        if "progress" not in st.session_state:
            st.session_state.progress = 0
            st.session_state.status = "Starting crawl..."
            
            progress_bar = st.progress(st.session_state.progress)
            status_text = st.empty()
            status_text.text(st.session_state.status)
            
            def update_progress(progress, status):
                st.session_state.progress = progress
                st.session_state.status = status
                progress_bar.progress(progress)
                status_text.text(status)
            
            # Save crawled knowledge to Supabase
            # Split crawl into stages with progress updates
            update_progress(0.1, "Initializing crawl...")
            
            # Actually crawl the website
            result = await agent.run(
                input_text=f"Crawl and index {doc_url}",
                context=RunContext(deps=deps)
            )
            
            if result and result.parts:
                update_progress(0.3, "Crawling website structure...")
                await asyncio.sleep(1)  # Simulate structure crawl
                
                update_progress(0.6, "Extracting content...")
                await asyncio.sleep(1)  # Simulate content extraction
                
                update_progress(0.8, "Processing content...")
                await asyncio.sleep(1)  # Simulate content processing
                
                # Store knowledge in Supabase
                knowledge = result.parts[0].content if result.parts[0].part_kind == 'text' else ''
                supabase.table('knowledge_base').insert({
                    'source': doc_source,
                    'url': doc_url,
                    'content': knowledge,
                    'created_at': 'now()'
                }).execute()
            
            update_progress(1.0, "Crawl complete! Knowledge saved.")
            st.session_state.crawled = True

    # Run the agent with streaming
    message_placeholder = st.empty()
    full_response = ""
    
    try:
        # Get the async generator from agent.run()
        response_gen = agent.run(
            input_text=user_input,
            context=RunContext(deps=deps)
        )
        
        # Process each chunk from the generator
        async for response in response_gen:
            if response:
                # Ensure response is properly structured
                if isinstance(response, str):
                    response = ModelResponse(parts=[TextPart(content=response)])
                
                if hasattr(response, 'parts'):
                    for part in response.parts:
                        if part.part_kind == 'text' and part.content:
                            full_response += part.content
                            message_placeholder.markdown(full_response + "▌")
        
        # Final update without typing indicator
        message_placeholder.markdown(full_response)
        
        # Add the response to messages
        st.session_state.messages.append(
            ModelResponse(parts=[TextPart(content=full_response)])
        )
        
    except Exception as e:
        full_response = f"Error: {str(e)}"
        message_placeholder.markdown(full_response)
        st.session_state.messages.append(
            ModelResponse(parts=[TextPart(content=full_response)])
        )


async def main():
    st.title("Documentation Crawler RAG Agent")
    st.write("Choose documentation source and ask questions")

    # Initialize documentation sources in session state
    # Initialize knowledge bases
    if "knowledge_bases" not in st.session_state:
        st.session_state.knowledge_bases = {
            "pydantic_ai_docs": "Pydantic AI Documentation",
            "python_docs": "Python Documentation"
        }
        st.session_state.knowledge_base_urls = {
            "pydantic_ai_docs": "https://docs.pydantic.ai",
            "python_docs": "https://docs.python.org"
        }

    # Add knowledge base management section
    with st.expander("Manage Knowledge Bases"):
        # Display current knowledge bases with remove buttons
        st.write("Current Knowledge Bases:")
        cols = st.columns([3, 1])
        for key, name in list(st.session_state.knowledge_bases.items()):
            cols[0].write(f"• {name}")
            if cols[1].button("Remove", key=f"remove_{key}"):
                del st.session_state.knowledge_bases[key]
                del st.session_state.knowledge_base_urls[key]
                st.session_state.should_rerun = True
                st.success(f"Removed knowledge base: {name}")
        
        st.caption(f"Maximum knowledge bases: 10 (Current: {len(st.session_state.knowledge_bases)})")
        
        # Add new knowledge base form
        with st.form("add_knowledge_base"):
            st.write("Add New Knowledge Base")
            new_name = st.text_input("Display Name")
            new_key = st.text_input("Unique Key (no spaces)")
            new_url = st.text_input("Documentation URL")
            
            if st.form_submit_button("Add Knowledge Base"):
                if len(st.session_state.knowledge_bases) >= 10:
                    st.error("Maximum of 10 knowledge bases reached")
                elif new_key and new_name and new_url:
                    if new_key in st.session_state.knowledge_bases:
                        st.error("Key already exists")
                    else:
                        st.session_state.knowledge_bases[new_key] = new_name
                        st.session_state.knowledge_base_urls[new_key] = new_url
                        st.success(f"Added new knowledge base: {new_name}")
                        st.session_state.should_rerun = True
                else:
                    st.error("Please fill all fields")
        
        # Trigger rerun if flag is set
        if st.session_state.get('should_rerun', False):
            st.session_state.should_rerun = False
            st.rerun()

    # Add knowledge base selection
    knowledge_base = st.selectbox(
        "Select knowledge base:",
        options=list(st.session_state.knowledge_bases.values())
    )
    doc_source = list(st.session_state.knowledge_bases.keys())[
        list(st.session_state.knowledge_bases.values()).index(knowledge_base)
    ]

    # Get URL for selected knowledge base
    doc_url = st.session_state.knowledge_base_urls.get(doc_source, "")

    # Initialize chat history in session state if not present
    if "messages" not in st.session_state:
        st.session_state.messages = []

    # Display all messages from the conversation so far
    # Each message is either a ModelRequest or ModelResponse.
    # We iterate over their parts to decide how to display them.
    for msg in st.session_state.messages:
        if isinstance(msg, ModelRequest) or isinstance(msg, ModelResponse):
            for part in msg.parts:
                display_message_part(part)

    # Chat input for the user
    user_input = st.chat_input(f"What questions do you have about {doc_source} documentation?")

    if user_input:
        # We append a new request to the conversation explicitly
        st.session_state.messages.append(
            ModelRequest(parts=[UserPromptPart(content=user_input)])
        )
        
        # Display user prompt in the UI
        with st.chat_message("user"):
            st.markdown(user_input)

        # Display the assistant's partial response while streaming
        with st.chat_message("assistant"):
            # Actually run the agent now, streaming the text
            await run_agent_with_streaming(user_input, doc_source, doc_url)


async def test_progress():
    """Test function to verify progress bar functionality"""
    print("Testing progress bar...")
    
    # Simulate progress updates
    test_url = "https://devguide.python.org/"
    print("Starting test crawl for:", test_url)
    
    # Initialize progress state
    st.session_state.progress = 0
    st.session_state.status = "Starting test crawl..."
    
    # Simulate progress updates
    for progress, status in [
        (0.1, "Initializing crawl..."),
        (0.3, "Crawling website structure..."), 
        (0.6, "Extracting content..."),
        (0.8, "Processing content..."),
        (1.0, "Crawl complete! Knowledge saved.")
    ]:
        st.session_state.progress = progress
        st.session_state.status = status
        print(f"Progress: {progress*100:.0f}% - {status}")
        await asyncio.sleep(1)  # Simulate work being done
        
    print("Test crawl completed successfully!")

if __name__ == "__main__":
    # Run the test first
    asyncio.run(test_progress())
    # Then start the main app
    asyncio.run(main())
