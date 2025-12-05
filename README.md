# RahasChat Mobile (Local Dev)

This is the mobile (Expo/React Native) version of RahasChat. Currently it supports local development only. The full mobile release is planned for future development and deployment.

- Web repo: https://github.com/Nadil-Dulran/rahas
- Live web app: https://rahas.onrender.com

## Prerequisites

- macOS with `zsh` (default shell in this project)
- Node.js and npm installed
- Expo CLI (installed via npm)
- A running local backend server from this repo's `server/`

### Install npm (Node.js)

We recommend using `nvm` to install/manage Node.js and npm.

```zsh
# Install nvm (restart terminal after this if needed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | zsh

# Load nvm (if not already loaded)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Install an LTS version of Node (includes npm)
nvm install --lts
nvm use --lts

# Verify
node -v
npm -v
```

### Install Expo CLI

```zsh
npm install -g expo-cli
```

## Repository Layout

This repo is structured as a simple monorepo:

- `client/` – Expo React Native app
- `server/` – Node.js/Express backend (Socket.io + MongoDB/Mongoose)
- root `package.json` – convenience scripts to run client and server

## Setup

Install dependencies for both client and server:

```zsh
# From repo root
npm run dev:server --silent; true  # creates no deps; just to show script exists

# Install server deps
cd server
npm install

# Install client deps
cd ../client
npm install
```

Ensure the backend has a valid `.env` in `server/` and MongoDB is reachable. See `server/.env.example` for required variables. Make sure `FRONTEND_ORIGIN` matches your Expo dev URL (e.g., `http://localhost:19000`).

## Running

In two terminals:

```zsh
# Terminal 1: start backend from repo root
npm run dev:server

# Terminal 2: start mobile app from repo root
npm run dev:client
```

The client script changes into `client/` and runs Expo. Choose the platform:

- Press `i` to launch iOS simulator (if installed)
- Press `a` to launch Android emulator (if installed)
- Scan the QR code with Expo Go on your device

## Connect Mobile App to Server (Expo)

To connect the Expo app to your local server:

- Set `API_BASE` in `client/src/config.js` to your server URL. For local macOS, this is typically:
  - iOS simulator: `http://localhost:<PORT>`
  - Android emulator: `http://10.0.2.2:<PORT>`
  - Physical device: use your machine’s LAN IP, e.g., `http://192.168.1.10:<PORT>`
- Ensure your server CORS `FRONTEND_ORIGIN` includes the Expo dev URL.
- Start the server first, then start the client.

Presence (Socket.io) and messaging rely on the server being reachable from the device/emulator.

## Current Status

- This is the RahasChat mobile version, focused on local development.
- Planned: full-featured mobile app and production deployment.
- For a working, deployed experience today, use the web app.

## Troubleshooting

- MongoDB connection errors: verify `MONGODB_URI` in `server/.env` and that MongoDB is running/accessible.
- 404/Network errors in chat sending: confirm `API_BASE` and the device/emulator can reach your server.
- CORS issues: check `FRONTEND_ORIGIN` in the backend to match Expo dev origin.

## License

This project is currently private and intended for personal/local development.
