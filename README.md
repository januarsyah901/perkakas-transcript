# Perkakas YT

**YouTube Transcript Extractor & Converter**

A powerful and easy-to-use tool for extracting, processing, and converting YouTube video transcripts into multiple formats. Built with Node.js backend and modern React frontend.

## Features

- 🎯 Extract transcripts directly from YouTube videos
- 🔄 Support for multiple output formats (TXT, SRT, JSON, VTT)
- ⚡ Fast processing with AI-powered transcription
- 🎨 Modern, user-friendly web interface
- 📱 Responsive design for desktop and mobile
- 🔖 Playlist support for batch processing
- 📊 Transcript viewer with timestamp navigation
- 💾 Export in multiple formats

## Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
git clone https://github.com/januarsyah901/perkakas-transcript.git
cd perkakas-transcript
npm install
```

### Running the Application

**Development Mode** (both client and server):
```bash
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## Project Structure

```
perkakas-yt/
├── client/          # React frontend application
├── server/          # Node.js backend server
├── .scripts/        # Utility scripts including versioning
├── package.json     # Root package configuration
└── README.md        # This file
```

## Versioning & Release Management

This project uses an automated versioning system integrated with git.

### Version Commands

Three commands are available for versioning:

#### 1. Major Version (X.0.0)
For large changes that break backward compatibility.
```bash
npm run version:major -- "Description of breaking change"
```

#### 2. Minor Version (0.X.0)
For new features that maintain backward compatibility.
```bash
npm run version:minor -- "Description of new feature"
```

#### 3. Patch Version (0.0.X)
For bug fixes and minor improvements.
```bash
npm run version:patch -- "Description of fix"
```

### Usage Examples

```bash
# Release bug fix v1.1.1
npm run version:patch -- "Fix: transcript parsing issue"

# Release new feature v1.2.0
npm run version:minor -- "Add: support for playlist transcription"

# Release breaking change v2.0.0
npm run version:major -- "Refactor: new API structure for better performance"
```

### What Happens Automatically

Each versioning command will:
1. ✅ Update version in `package.json`
2. ✅ Create entry in `CHANGELOG.md`
3. ✅ Create release note in `RELEASES.md`
4. ✅ Commit changes with git
5. ✅ Create git tag (v1.0.1, v1.1.0, etc.)

### Pushing to Repository

After running a versioning command, push changes to the repository:

```bash
# Push commits and tags
git push origin main --tags
```

Or push only commits without tags:
```bash
git push origin main
```

### Viewing Release History

- **CHANGELOG.md** - Detailed changelog with dates
- **RELEASES.md** - User-friendly release notes

### Check Current Version

View the current version in `package.json` or run:
```bash
npm pkg get version
```

## Technologies Used

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **JavaScript ES6+** - Latest JavaScript features

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework (if applicable)
- **JavaScript** - Server-side language

### DevTools
- **Concurrently** - Run multiple commands simultaneously
- **ESLint** - Code quality tool
- **PostCSS** - CSS processing

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes using the versioning system
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For issues and questions, please visit:
- **GitHub Issues**: [Create an issue](https://github.com/januarsyah901/perkakas-transcript/issues)
- **Project Repository**: [Perkakas YT](https://github.com/januarsyah901/perkakas-transcript)

---

**Ready to start?** Clone the repository and run `npm run dev` to get started!

Current Version: **v1.1.0** | Last Updated: 2026-04-17
