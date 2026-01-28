# Start Chat WebApp

Start Chat WebApp is a modern, real-time chat application built with React, TypeScript, and WebSockets. It features a premium "Glassmorphism" UI and robust connection management.

## ✨ Features

- **Real-time Messaging**: Instant message delivery and receipt via WebSockets.
- **Connection Persistence**: Automatic reconnection logic with exponential backoff (up to 10 retries).
- **Persistent Identity**: Use of `localStorage` to remember your chosen username across sessions.
- **Chat History**: Automatically loads previous messages upon connection.
- **Responsive Design**: A sleek, dark-themed interface that adapts to different screen sizes.
- **Visual Feedback**: Real-time connection status indicators and error banners.

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons**: [Lucide-react](https://lucide.dev/)
- **Styling**: Vanilla CSS with modern features (CSS Variables, Flexbox, Backdrop-filter)

## 📂 Project Structure

```bash
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ChatInput.tsx    # Message typing area and username settings
│   │   └── MessageItem.tsx   # Individual message display
│   ├── hooks/            # Custom React hooks
│   │   └── useChatSocket.ts  # Core WebSocket and state management logic
│   ├── App.tsx           # Main application entry point and layout
│   ├── App.css           # Component-specific styles
│   ├── index.css         # Global styles and design system (Glassmorphism)
│   └── main.tsx          # React application mounting
├── public/               # Static assets
└── vite.config.ts        # Vite configuration
```

## 🔌 WebSocket Implementation

The core logic resides in the `useChatSocket` custom hook. It handles:

1.  **Connection Management**: Establishing and closing the WebSocket connection.
2.  **Reconnection Strategy**: If the connection is lost, it attempts to reconnect 10 times with an increasing delay (exponential backoff).
3.  **State Synchronization**:
    -   `history`: Synchronizes the full message history on initial connect.
    -   `message`: Updates the state with new incoming messages.
    -   `error`: Captures and displays server-side or connection errors.

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

Start the application in development mode with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5173`. Make sure the backend server is running on `http://localhost:8081` for full functionality.

### Building for Production

To create an optimized production build:

```bash
npm run build
```

The output will be in the `dist` folder.

