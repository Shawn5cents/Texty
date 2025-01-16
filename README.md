# 🚀 Nichols AI Agents

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python Version](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://python.org)
[![Deepseek](https://img.shields.io/badge/Powered%20by-DeepseekAI-blueviolet.svg)](https://deepseek.com)

## 📖 Table of Contents
- [About](#-about)
- [Features](#-features)
- [Getting Started](#-getting-started)
  - [Installation](#-installation)
  - [Quick Start](#-quick-start)
- [Documentation](#-documentation)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Support](#-support)
- [License](#-license)

---

## 🌟 About

Nichols AI Agents is a documentation assistant system built upon foundations from:
- [crawl4ai](https://github.com/unclecode/crawl4ai) - Open source web crawling and document processing
- [ottomator-agents](https://github.com/coleam00/ottomator-agents) - AI agent framework

Originally using OpenAI LLMs, the system now utilizes Deepseek models with enhanced capabilities:

### Core Components:
- Deepseek for natural language processing
- Supabase for document storage and retrieval
- RAG (Retrieval Augmented Generation) architecture
- Structured message handling system
- Modular agent architecture

### Key Features:
- Documentation crawling and indexing
- Context-aware question answering
- Multiple knowledge base support with management UI
- Streaming responses with error handling
- Extensible to new documentation sources
- Knowledge base versioning and updates
- Cross-document reference resolution

### Web Interface:
- Streamlit-based dashboard
- Real-time monitoring and control
- Interactive data visualization
- Knowledge base management
- Documentation source selection
- Chat interface with streaming responses
- Progress tracking for crawls

### Architecture:
- Base model interface (Deepseek implementation)
- Agent system with tool integration
- Structured message types for system/user/assistant communication
- Supabase-backed document storage with vector search
- Modular plugin architecture
- Inherits patterns from crawl4ai and ottomator-agents

---

## ✨ Features

### 🕷️ Advanced Web Crawling
- Extract structured data from complex websites
- Handle JavaScript-heavy pages
- Automatic retry and error handling

### 🤖 AI-Powered Analysis
- Natural Language Processing with Deepseek models
- Content summarization and classification
- Sentiment analysis and entity recognition

### 🚀 Real-time Streaming
- Stream processed data in real-time
- Handle large datasets efficiently
- Built-in rate limiting and queue management

### 🧩 Modular Architecture
- Plugin-based system for easy extension
- Customizable processing pipelines
- Dependency injection for clean code

### 🎨 Beautiful UI
- Streamlit-based dashboard
- Real-time monitoring and control
- Interactive data visualization

---

## 🚀 Getting Started

### 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/Nichols-AI/Nichols-AI-Agents.git

# Navigate to project directory
cd Nichols-AI-Agents

# Install dependencies
pip install -r requirements.txt
```

### 🚦 Quick Start

```python
from ottomator_agents.crawl4AI_agent import CrawlAgent

# Initialize the agent
agent = CrawlAgent()

# Start crawling with AI analysis
results = agent.crawl(
    url="https://example.com",
    analysis=["summary", "sentiment"]
)

# Process results
for result in results:
    print(result.summary)
    print(result.sentiment_score)
```

---

## 📚 Documentation

Explore our comprehensive guides:

- [API Reference](docs/API_REFERENCE.md) 📖
- [Developer Guide](docs/DEVELOPER_GUIDE.md) 🛠️
- [Agent Comparison](docs/COMPARISON.md) ⚖️

---

## 🗺️ Roadmap

- [ ] Add support for additional AI models
- [ ] Implement distributed crawling
- [ ] Add browser automation capabilities
- [ ] Develop mobile app interface

---

## 🤝 Contributing

We welcome contributions! Please see our [Contribution Guidelines](CONTRIBUTING.md) for details.

---

## 💬 Support

For help and support:
- Open an issue on GitHub
- Join our [Discord community](#)
- Email support@nichols-ai.com

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

✨ **Start your AI-powered web operations today!** ✨
