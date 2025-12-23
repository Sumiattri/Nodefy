# Workflow Builder

A visual workflow builder application inspired by Weavy.ai, enabling users to create AI-powered workflows using a node-based canvas interface with Google Gemini integration.

![Workflow Builder](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![React Flow](https://img.shields.io/badge/React_Flow-12-purple?style=flat-square)

## ✨ Features

- **Visual Node-Based Editor** - Drag and drop nodes to build workflows
- **Three Node Types**:
  - 📝 **Text Node** - Input text content
  - 🖼️ **Image Node** - Upload and process images
  - 🤖 **LLM Node** - Run AI prompts with Gemini models
- **Node Connections** - Connect nodes with animated purple edges
- **Gemini AI Integration** - Support for multiple Gemini models with vision capability
- **Input Chaining** - Aggregate inputs from connected nodes
- **Undo/Redo** - Full history support for node operations
- **Workflow Persistence** - Save and load workflows from local storage
- **Import/Export** - Export workflows as JSON files
- **Sample Workflow** - Pre-built Product Listing Generator demo
- **Dark Theme** - Beautiful Weavy-inspired dark UI

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API Key ([Get one free](https://aistudio.google.com/))

### Installation

1. Clone the repository:
```bash
cd workflow-builder
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Add your Gemini API key to `.env.local`:
```
GEMINI_API_KEY=your_api_key_here
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Usage

### Adding Nodes
- Drag node types from the left sidebar onto the canvas
- Click to select nodes, drag to move them

### Connecting Nodes
- Drag from an output handle (right side) to an input handle (left side)
- Connections are animated and show data flow direction

### Running LLM Nodes
1. Connect Text and/or Image nodes to an LLM node
2. Configure the model, system prompt, and user prompt
3. Click "Run" to execute the AI request
4. View the response in the node

### Sample Workflow
Click "Load Sample Workflow" to load the Product Listing Generator demo, which demonstrates:
- Image + Text input to an analyzer
- Chained LLM outputs for Amazon listing, Instagram caption, and SEO meta description

### Keyboard Shortcuts
- `Delete` / `Backspace` - Delete selected nodes
- `Ctrl/Cmd + Z` - Undo (via button)
- `Ctrl/Cmd + Shift + Z` - Redo (via button)

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Flow Editor**: React Flow (@xyflow/react)
- **State Management**: Zustand
- **Validation**: Zod
- **AI**: Google Generative AI SDK
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── app/
│   ├── api/gemini/     # Gemini API route
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main page
├── components/
│   ├── nodes/          # Node components
│   │   ├── TextNode.tsx
│   │   ├── ImageNode.tsx
│   │   └── LLMNode.tsx
│   ├── Canvas.tsx      # React Flow canvas
│   ├── Sidebar.tsx     # Left sidebar
│   └── WorkflowBuilder.tsx
├── lib/
│   ├── gemini.ts       # Gemini client
│   └── schemas.ts      # Zod schemas
├── store/
│   └── workflowStore.ts # Zustand store
└── types/
    └── workflow.ts     # TypeScript types
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add `GEMINI_API_KEY` to environment variables
4. Deploy!

### Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Your Google Gemini API key |

## 📄 License

MIT License - feel free to use this project for learning and development.

---

Built with ❤️ using Next.js and React Flow
