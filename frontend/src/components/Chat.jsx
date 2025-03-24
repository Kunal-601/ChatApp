import { useState, useEffect } from 'react';
import axios from 'axios';
import socket from '../utils/socket';
import { FaPaperclip, FaPaperPlane } from 'react-icons/fa';
// import './Chat.css';

const BASE_URL = import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : 'http://localhost:5000/api';

const Chat = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [image, setImage] = useState(null);
  const [user] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      socket.auth = { token };
      socket.connect();

      socket.on('connect', () => console.log('Socket connected'));
      socket.on('newMessage', (message) => {
        setMessages((prev) => [message, ...prev]);
      });

      return () => {
        socket.off('connect');
        socket.off('newMessage');
        socket.disconnect();
      };
    }
  }, [token]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser]);

  const fetchMessages = async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/messages/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.data.success) setMessages(response.data.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if ((!messageText && !image) || !selectedUser) return;

    try {
      const formData = new FormData();
      if (messageText) formData.append('text', messageText);
      if (image) formData.append('image', image);

      const response = await axios.post(
        `${BASE_URL}/messages/send/${selectedUser._id}`,
        formData,
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      if (response.data.success) {
        setMessages((prev) => [response.data.data, ...prev]);
        setMessageText('');
        setImage(null);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 font-sans overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gray-900 bg-opacity-80 backdrop-blur-md border-b border-gray-700 shadow-md">
        <h2 className="text-xl font-medium text-gray-100 tracking-tight">
          {selectedUser ? (
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400">
              Chat with {selectedUser.username}
            </span>
          ) : (
            <span className="text-gray-400 font-light italic">Select a user to begin chatting</span>
          )}
        </h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 px-6 py-8 overflow-y-auto flex flex-col-reverse space-y-reverse space-y-4 bg-gray-800 bg-opacity-20">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`p-3 rounded-lg max-w-sm shadow-sm ${
              msg.sender === user?.id
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white self-end backdrop-blur-sm bg-opacity-90'
                : 'bg-gray-700 bg-opacity-70 backdrop-blur-sm border border-gray-600 border-opacity-50 text-gray-200 self-start'
            } hover:shadow-md group`}
          >
            {msg.text && <p className="text-sm leading-relaxed">{msg.text}</p>}
            {msg.image && (
              <img
                src={msg.image}
                alt="Message"
                className="mt-2 max-w-full rounded-md shadow-sm"
              />
            )}
            <div className="text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={sendMessage}
        className="p-4 bg-gray-900 bg-opacity-80 backdrop-blur-md border-t border-gray-700 border-opacity-50 flex items-center gap-3 shadow-lg"
      >
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder={selectedUser ? "Type a message..." : "Select a user to chat"}
          className="flex-1 py-2 px-4 bg-gray-800 bg-opacity-70 border border-gray-600 border-opacity-50 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-gray-200 placeholder-gray-500 transition-colors duration-300"
          disabled={!selectedUser}
        />
        <label className="p-2.5 cursor-pointer hover:bg-gray-700 hover:bg-opacity-50 rounded-full transition-colors duration-200 flex items-center justify-center">
          <FaPaperclip className="text-gray-400 text-sm" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
            disabled={!selectedUser}
          />
        </label>
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 shadow-sm transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={!selectedUser}
        >
          <FaPaperPlane className="text-sm" />
        </button>
      </form>
    </div>
  );
};

export default Chat;