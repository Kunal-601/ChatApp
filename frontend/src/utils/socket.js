import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_RENDER_BACKEND_URL || 'http://localhost:5000';

const socket = io(BACKEND_URL, {
  autoConnect: false,
});

export default socket;