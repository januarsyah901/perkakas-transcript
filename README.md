# Perkakas YT - YouTube Transcript Extractor

**Perkakas YT** is a powerful, user-friendly web application that extracts transcripts from YouTube videos using advanced AI technology. Whether you need captions or audio-based transcripts, this tool handles it all with ease.

## 🎯 What This Project Does

Perkakas YT automates the process of getting accurate transcripts from YouTube videos. Instead of manually watching videos or searching for captions, simply paste a YouTube URL and get instant, high-quality transcripts in multiple formats.

### Key Capabilities

- **YouTube Transcript Extraction** - Automatically fetch video captions when available
- **AI-Powered Transcription** - Use AssemblyAI for accurate audio-based transcription
- **Multiple Export Formats** - Download transcripts as:
  - `.txt` - Plain text format
  - `.srt` - SubRip subtitle format
  - `.json` - JSON data format
  - `.vtt` - WebVTT subtitle format
- **Interactive Viewer** - Browse transcripts with timestamp-based navigation
- **Real-time Progress Tracking** - See the transcription status in real-time

## 🏗️ Project Architecture

This is a **full-stack web application** with separate client and server components:

```
perkakas-yt/
├── client/              # React Frontend (Port 5173)
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── utils/       # Utility functions (formatting, etc.)
│   │   └── App.jsx      # Main application component
│   └── package.json
│
├── server/              # Node.js Backend (Port 3001)
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   ├── index.js         # Express server setup
│   └── package.json
│
└── .scripts/            # Utility scripts (versioning)
```

### Frontend (React)
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS for modern, responsive UI
- **HTTP Client**: Axios for API communication
- **Components**:
  - `UrlInput` - YouTube URL input field
  - `ProgressBar` - Transcription progress indicator
  - `TranscriptViewer` - Display and interact with transcripts
  - `ExportButtons` - Download in multiple formats

### Backend (Node.js + Express)
- **Framework**: Express.js for REST API
- **Transcript Service**: 
  - **YouTube Captions**: `youtube-transcript` library
  - **Audio Transcription**: AssemblyAI API
- **Utilities**: CORS, UUID for session management, Dotenv for configuration

## 📋 Prerequisites

Before you start, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **yt-dlp** (for downloading video audio)
  ```bash
  pip install yt-dlp
  ```
- **AssemblyAI API Key** (sign up at [AssemblyAI](https://www.assemblyai.com/))

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/januarsyah901/perkakas-transcript.git
cd perkakas-transcript
```

### 2. Install Dependencies

Install root-level dependencies:
```bash
npm install
```

Dependencies for client and server are defined in their respective `package.json` files and will be installed automatically.

### 3. Set Up Environment Variables

Create a `.env` file in the root directory with:

```env
# Server Configuration
PORT=3001

# AssemblyAI API Key (get from https://www.assemblyai.com/)
ASSEMBLYAI_API_KEY=your_api_key_here
```

### 4. Start the Application

**Development Mode** (runs both frontend and backend concurrently):

```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

### 5. Use the Application

1. Open http://localhost:5173 in your browser
2. Paste a YouTube URL in the input field
3. Click "Get Transcript"
4. Wait for the transcription to complete
5. View, interact with, or export the transcript

## 💻 How It Works

### Workflow

```
User Input (YouTube URL)
         ↓
   API Request
         ↓
Backend Processing
  ├─ Try: Get YouTube Captions
  │  └─ If available → Return captions
  │
  └─ If no captions: Download audio + Transcribe with AssemblyAI
         ↓
   Return Transcript
         ↓
Frontend Display
  ├─ Show transcript text
  ├─ Display timestamps
  └─ Provide export options
```

### API Endpoint

**POST** `/api/transcript`

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "title": "Video Title",
  "transcript": "Full transcript text...",
  "segments": [
    {
      "text": "Segment text",
      "start": 0,
      "end": 5000
    }
  ]
}
```

## 📝 Usage Examples

### Via Web Interface

1. **Extract YouTube Captions**
   - Paste any YouTube URL with existing captions
   - Click "Get Transcript"
   - Download in your preferred format

2. **Transcribe from Audio**
   - For videos without captions, the app will transcribe the audio
   - Processing time depends on video length
   - Requires AssemblyAI API key

3. **Export Options**
   - **TXT**: Plain text for easy reading
   - **SRT**: For video subtitles
   - **JSON**: For programmatic use
   - **VTT**: Web Video Text Tracks format

### Command Line

Check your application version:
```bash
npm pkg get version
```

## 🔄 Versioning & Release Management

This project uses automated versioning integrated with Git. For detailed instructions, see the [Versioning Guide](#versioning--release-management).

### Quick Commands

```bash
# Bug fix (patch)
npm run version:patch -- "Fix: description"

# New feature (minor)
npm run version:minor -- "Add: description"

# Breaking change (major)
npm run version:major -- "Refactor: description"
```

After versioning, push to GitHub:
```bash
git push origin main --tags
```

## 🛠️ Development

### Project Scripts

```bash
# Start development servers (frontend + backend)
npm run dev

# Version management
npm run version:major -- "Description"
npm run version:minor -- "Description"
npm run version:patch -- "Description"

# Frontend only
cd client
npm run dev     # Development
npm run build   # Production build
npm run lint    # Check code quality

# Backend only
cd server
npm run dev     # Watch mode
```

### Folder Structure Explained

```
client/src/
├── App.jsx              # Main app component
├── components/
│   ├── UrlInput.jsx     # URL input form
│   ├── ProgressBar.jsx  # Loading indicator
│   ├── TranscriptViewer.jsx # Display results
│   └── ExportButtons.jsx    # Download options
├── utils/
│   └── srtFormatter.js  # Convert to SRT format
└── App.css              # Global styles

server/
├── index.js             # Express setup
├── routes/
│   └── transcript.js    # API endpoints
└── services/
    ├── youtubeService.js    # Caption extraction
    └── transcriptionService.js # AssemblyAI integration
```

## 🔐 Security Notes

- **Never commit** your `.env` file with API keys
- Keep your **AssemblyAI API key private**
- Use environment variables for sensitive data
- CORS is configured for local development only

## 🐛 Troubleshooting

### "Module not found" error
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "Cannot find python/yt-dlp"
```bash
# Install yt-dlp globally
pip install yt-dlp
which yt-dlp  # Verify installation
```

### "AssemblyAI API Key invalid"
- Check your `.env` file
- Verify API key at https://www.assemblyai.com/
- Ensure no extra spaces or quotes in the key

### CORS errors
- Ensure backend is running on port 3001
- Check frontend is trying to connect to correct URL
- Verify CORS is enabled in `server/index.js`

## 📚 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 19 + Vite | User interface |
| Styling | Tailwind CSS | Modern, responsive UI |
| Backend | Express.js | REST API server |
| Transcription | AssemblyAI | AI-powered audio transcription |
| Captions | youtube-transcript | YouTube caption extraction |
| Build Tool | Vite | Fast bundling and HMR |
| HTTP | Axios | API communication |

## 📄 Current Version

**Version**: 1.1.0  
**Last Updated**: 2026-04-17

See [CHANGELOG.md](./CHANGELOG.md) for version history and [RELEASES.md](./RELEASES.md) for release notes.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Make changes** and test thoroughly
4. **Commit** using the versioning system (see above)
5. **Push** to your fork
6. **Create** a Pull Request

### Development Guidelines

- Follow the existing code style
- Add comments for complex logic
- Test your changes before submitting
- Update documentation if needed

## 📝 License

This project is licensed under the **ISC License** - see [LICENSE](./LICENSE) for details.

## 🆘 Support & Issues

Found a bug or have a question?

- **Report Issues**: [GitHub Issues](https://github.com/januarsyah901/perkakas-transcript/issues)
- **Discussions**: [GitHub Discussions](https://github.com/januarsyah901/perkakas-transcript/discussions)
- **Repository**: [Perkakas YT on GitHub](https://github.com/januarsyah901/perkakas-transcript)

---

## 🎉 Quick Start Recap

```bash
# 1. Clone and install
git clone https://github.com/januarsyah901/perkakas-transcript.git
cd perkakas-transcript
npm install

# 2. Set up environment
echo 'ASSEMBLYAI_API_KEY=your_key_here' > .env

# 3. Start application
npm run dev

# 4. Open browser
# Frontend: http://localhost:5173
# Backend: http://localhost:3001

# 5. Use it!
# Paste YouTube URL and get transcript
```

**Ready to transcribe?** Start with `npm run dev` and enjoy! 🚀
