# 🚀 Nichols AI Agents - Modern Documentation Assistant

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python Version](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://python.org)
[![Deepseek](https://img.shields.io/badge/Powered%20by-DeepseekAI-blueviolet.svg)](https://deepseek.com)
[![Streamlit](https://img.shields.io/badge/UI-Streamlit-FF4B4B.svg)](https://streamlit.io)
[![CI/CD](https://github.com/Nichols-AI/Nichols-AI-Agents/actions/workflows/ci.yml/badge.svg)](https://github.com/Nichols-AI/Nichols-AI-Agents/actions)
[![Documentation](https://img.shields.io/badge/Docs-Read%20Now-blue)](https://nichols-ai.github.io/Nichols-AI-Agents)

![Streamlit UI Screenshot](screenshots/Screenshot%202025-01-16%20042918.png)

## 🎯 Features at a Glance

## 📸 Screenshots

| | |
|-|-|
| ![Main UI](screenshots/Screenshot%202025-01-16%20042918.png) | ![Crawl Progress](screenshots/Screenshot%202025-01-16%20043438.png) |
| ![Crawl Results](screenshots/Screenshot%202025-01-16%20043520.png) | ![Knowledge Storage](screenshots/Screenshot%202025-01-16%20043619.png) |

| Feature | Description | Status |
|---------|-------------|--------|
| 🕷️ Advanced Crawling | Multi-threaded, JS-enabled crawling | ✅ Live |
| 🤖 AI Analysis | Deepseek-powered NLP and insights | ✅ Live |
| 🎨 Beautiful UI | Streamlit-based interactive dashboard | ✅ Live |
| 🧩 Modular Design | Plugin-based extensible architecture | ✅ Live |
| 🌐 Multi-language | Support for 50+ languages | ✅ Live |
| 🔍 Semantic Search | Context-aware document retrieval | ✅ Live |
| 📚 Document Management | Advanced URL/document storage with metadata | ✅ Live |
| 🗃️ Persistent Storage | Supabase integration for document persistence | ✅ Live |
| 🔗 URL Tracking | Multi-threaded URL processing with deduplication | ✅ Live |

## 🛠️ Tech Stack

**Core Technologies**
- **AI Engine**: Deepseek Models
- **Web Framework**: Streamlit
- **Database**: Supabase (Document storage and metadata)
- **Vector Storage**: Weaviate (Semantic search)
- **Document Management**: Advanced URL tracking and processing
- **CI/CD**: GitHub Actions

**Development Tools**
- Python 3.9+
- Poetry (Dependency Management)
- Pytest (Testing)
- Black (Code Formatting)
- MyPy (Type Checking)

## 🚀 Quick Start

```bash
# Clone and setup
git clone https://github.com/Nichols-AI/Nichols-AI-Agents.git
cd Nichols-AI-Agents
poetry install

# Launch the UI
poetry run streamlit run ottomator-agents/crawl4AI-agent/streamlit_ui.py
```

## 🏗️ Project Structure

```
Nichols-AI-Agents/
├── ottomator-agents/
│   ├── crawl4AI-agent/
│   │   ├── pydantic_ai/          # Core AI models and logic
│   │   ├── streamlit_ui.py       # Main UI interface
│   │   ├── requirements.txt      # Python dependencies
│   │   └── .env                  # Environment configuration
│   ├── docs/                     # Documentation
│   └── CHANGES.md                # Version history
├── tests/                        # Unit and integration tests
└── README.md                     # Project documentation
```

## 🌟 Why Choose Nichols AI Agents?

- **Cutting-edge AI**: Powered by Deepseek's latest models
- **Advanced Document Handling**: Robust URL/document management with metadata support
- **Enterprise-ready**: Scalable architecture for large deployments
- **Developer-friendly**: Comprehensive API and documentation
- **Open Ecosystem**: Extensible through plugins and integrations

## 🤝 Contributors

### Primary Developer
- **Shawn Nichols**
  - Architecture Design
  - AI Model Integration
  - System Optimization
  - UI/UX Development
  - Documentation

### Special Thanks
- [Cole Ammons](https://github.com/coleam00) for the original [ottomator-agents](https://github.com/coleam00/ottomator-agents) project that served as inspiration and foundation
- Louisce Nichols for their ongoing support and encouragement
- Michael Nichols for their valuable feedback and assistance

## 📜 License

MIT License - See [LICENSE](LICENSE) for details.

---

✨ **Experience the future of documentation assistance today!** ✨
