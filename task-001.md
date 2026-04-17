You are setting up a local fullstack project called "youtube-transcriber".

Create the following structure:
- /client — React + Vite + TailwindCSS
- /server — Node.js + Express

In /server, install these npm packages:
  express, cors, dotenv, axios, youtube-transcript, assemblyai, uuid

In /client, scaffold with Vite (React template) and install TailwindCSS.

Create a root .env file with these keys (empty values):
  YOUTUBE_API_KEY=
  ASSEMBLYAI_API_KEY=
  PORT=3001

In /server/index.js:
- Load dotenv
- Setup Express with cors() and json() middleware
- Mount routes from ./routes/transcript.js on POST /api/transcript
- Listen on process.env.PORT

Add a root package.json with a dev script that runs both client and server concurrently using the "concurrently" package.