# Nichols AI Agents Developer Guide

## Project Structure
```
ottomator-agents/
├── crawl4AI-agent/
│   ├── pydantic_ai/            # Core AI framework
│   │   ├── __init__.py
│   │   ├── agent.py            # Main agent implementation
│   │   ├── messages.py         # Message handling
│   │   └── models/             # AI model implementations
│   ├── generic_docs_expert.py  # Documentation expert
│   ├── pydantic_ai_expert.py   # Pydantic AI expert
│   ├── streamlit_ui.py         # Web interface
│   ├── requirements.txt        # Dependencies
│   └── .env.example            # Environment configuration
├── docs/                       # Documentation
└── CHANGES.md                  # Version history
```

## Development Setup
1. Clone the repository
2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```
3. Install dependencies:
```bash
pip install -r requirements.txt
```
4. Create `.env` file from example:
```bash
cp .env.example .env
```

## Coding Standards
- Follow PEP 8 style guide
- Use type hints for all functions
- Write docstrings for all public methods
- Keep functions small and focused
- Use descriptive variable names
- Write unit tests for new features

## Testing
Run tests with:
```bash
pytest tests/
```

Key test files:
- `tests/test_agent.py`: Core functionality tests
- `tests/test_models.py`: Model implementation tests
- `tests/test_ui.py`: UI component tests

## Debugging
Enable debug mode in `.env`:
```env
DEBUG=true
```

Use logging:
```python
import logging
logger = logging.getLogger(__name__)
logger.debug("Debug message")
```

## Contributing
1. Create a new branch:
```bash
git checkout -b feature/new-feature
```
2. Make your changes
3. Run tests and linting:
```bash
pytest && flake8
```
4. Commit changes with descriptive messages
5. Create pull request
