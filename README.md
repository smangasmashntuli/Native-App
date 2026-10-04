# PC Doctor AI Mobile App

PC Doctor AI is an Expo/React Native mobile application for helping non-technical users understand and troubleshoot laptop problems. It provides authentication, laptop setup, device specifications, AI-assisted chat, component explanations, repair guidance, notifications, and tutorial video search.

This repository contains the mobile frontend. The FastAPI backend is maintained separately in `backend/LearningPython`.

## Features

- Email-based sign-up and login with persisted JWT authentication.
- Laptop registration and setup status tracking.
- Laptop specification and image display from the backend.
- AI troubleshooting chat and chat history.
- Repair guidance, including component explanations and a 3D laptop view where available.
- Maintenance and safety notifications.
- YouTube tutorial search for laptop issues.
- Dark Expo/React Native interface with bottom-tab navigation for Home, Chat, Repair, Alerts, and Profile.

## Technology

- Expo `~49.0.15`
- React Native `0.72.6`
- React `18.2.0`
- React Navigation
- AsyncStorage for the access token and local preferences
- Expo Web support

## Prerequisites

- Node.js and npm
- Expo CLI provided by the project dependencies
- Expo Go for a physical device, or an Android emulator/iOS simulator
- The backend running locally if you want authentication and API-backed features

## Install

From this repository root:

```powershell
npm install
```

## Configure the backend URL

The app reads `EXPO_PUBLIC_API_URL` when it is set. Create a local `.env` file in this repository if the backend is not reachable through the defaults:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.100:8000
```

Use the host machine's LAN IP when testing on a physical phone. For Android emulators, the default is `http://10.0.2.2:8000`; for iOS and web, the default is `http://localhost:8000`. The backend allows the local Expo origins used by this app.

Do not commit local `.env` files or API keys.

## Run the application

Start the Expo development server:

```powershell
npm start
```

Then use the Expo terminal or developer UI to open the app in Expo Go, an emulator, or a browser.

Platform-specific commands:

```powershell
npm run android
npm run ios
npm run web
```

The `ios` command requires macOS/Xcode. Android requires an installed emulator or a connected device with native build tooling configured.

## Typical local workflow

1. Start the backend by following `backend/LearningPython/README.md`.
2. Confirm the backend responds at `http://localhost:8000/ping` or set `EXPO_PUBLIC_API_URL` for another host.
3. Start Expo with `npm start`.
4. Create an account in the app, sign in, and register a laptop.

## Project structure

```text
App.js                    Navigation and provider composition
frontend/api/             Backend API client
frontend/components/      Reusable UI components and styles
frontend/context/         Authentication and dashboard state
frontend/navigation/      Bottom-tab navigation
frontend/screens/         Login, setup, dashboard, chat, repair, alerts, profile
assets/                   App icons and splash assets
```

## API client

The client stores the backend access token as `access_token` in AsyncStorage and sends it as a Bearer token for protected requests. API methods cover sign-up, login, setup, specification ingestion, 3D model metadata, chat, notifications, and YouTube tutorials.

## Troubleshooting

- **Backend server is not available:** start the FastAPI server and verify `EXPO_PUBLIC_API_URL` or the platform default points to the correct machine.
- **Physical Android device cannot connect:** use the computer's LAN IP in `EXPO_PUBLIC_API_URL`, ensure both devices are on the same network, and allow port `8000` through the firewall.
- **Stale JavaScript bundle:** stop Expo and run `npx expo start -c`.
- **Native build problems:** verify the Android emulator/device or Xcode setup, then reinstall dependencies with `npm install`.

## License

See [LICENSE](LICENSE).
