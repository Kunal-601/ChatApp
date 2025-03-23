import { useState, useEffect } from 'react';
import { FaCircle, FaSearch, FaSignOutAlt, FaUser, FaEllipsisH } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:5000/api';

const Sidebar = ({ onUserSelect, selectedUserId }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [user] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/messages/users`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.data.success) setUsers(response.data.users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          navigate('/login');
          toast.error('Session expired, please log in again');
        }
      }
    };
    if (localStorage.getItem('token')) fetchUsers();
  }, [navigate]);

  const handleLogout = async () => {
    const loadingToast = toast.loading('Logging out...');
    try {
      await axios.post(`${BASE_URL}/auth/logout`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      toast.dismiss(loadingToast);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  };

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full md:w-80 h-full bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 border-opacity-50 flex flex-col shadow-md font-sans overflow-hidden">
      {/* Header with Profile */}
      <div className="p-4 bg-gray-900 bg-opacity-80 backdrop-blur-md border-b border-gray-700 border-opacity-30 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-600 border-opacity-40 shadow-inner bg-gradient-to-br from-gray-800 to-gray-700">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaUser className="text-gray-400 text-lg" />
              </div>
            )}
          </div>
          <h2 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400 tracking-tight">
            <Link to="/home">{user?.username || 'ChatApp'}</Link>
          </h2>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 cursor-pointer"
            title="Logout"
          >
            <FaSignOutAlt size={16} />
          </button>
          {/* <button
            className="p-2 text-gray-400 hover:text-indigo-300 hover:bg-gray-800 hover:bg-opacity-50 rounded-full transition-colors duration-300"
            title="Settings"
          >
            <FaEllipsisH size={16} />
          </button> */}
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-opacity-40 backdrop-filter backdrop-blur-sm">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-opacity duration-300">
            <FaSearch className="text-gray-500 text-xs group-hover:text-indigo-300 transition-colors duration-300" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-3 py-2.5 bg-gray-800 bg-opacity-60 border border-gray-600 border-opacity-30 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 focus:border-transparent text-gray-200 placeholder-gray-500 text-sm transition-colors duration-300"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 bg-opacity-20 backdrop-filter backdrop-blur-sm">
        <h3 className="px-3 py-2 text-xs text-gray-500 uppercase font-medium tracking-wider">
          Conversations
        </h3>
        {filteredUsers.length === 0 ? (
          <div className="px-4 py-3 text-gray-500 text-center text-sm italic">
            No conversations found
          </div>
        ) : (
          <div className="space-y-0.5">
            {filteredUsers.map((u) => (
              <div
                key={u._id}
                className={`px-3 py-2.5 mx-1 flex items-center cursor-pointer rounded-xl transition-colors duration-300 group ${
                  selectedUserId === u._id 
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 bg-opacity-30' 
                    : 'hover:bg-gray-800 hover:bg-opacity-40'
                }`}
                onClick={() => onUserSelect(u)}
              >
                <div className="relative flex-shrink-0">
                  <div className={`w-11 h-11 rounded-full overflow-hidden flex items-center justify-center shadow-sm ${
                    selectedUserId === u._id
                      ? 'border-2 border-indigo-300 border-opacity-70'
                      : 'border border-gray-600 border-opacity-40 bg-gray-700 bg-opacity-40'
                  }`}>
                    {u.avatar ? (
                      <img
                        src={u.avatar}
                        alt={u.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser className={`text-lg ${
                        selectedUserId === u._id ? 'text-indigo-200' : 'text-gray-500'
                      }`} />
                    )}
                  </div>
                  {onlineUsers.includes(u._id) && (
                    <div className="absolute bottom-0 right-0 transform translate-x-1">
                      <div className="w-3 h-3 rounded-full bg-green-400 border-2 border-gray-800 shadow-sm"></div>
                    </div>
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className={`font-medium ${
                    selectedUserId === u._id 
                      ? 'text-white' 
                      : 'text-gray-300 group-hover:text-indigo-300'
                  } transition-colors duration-200 text-sm`}>
                    {u.username}
                  </p>
                  <p className={`text-xs truncate ${
                    selectedUserId === u._id 
                      ? 'text-indigo-200 text-opacity-90' 
                      : 'text-gray-500 group-hover:text-gray-400'
                  } transition-colors duration-200`}>
                    {u.status || 'Available to chat'}
                  </p>
                </div>
                <div className="flex flex-col items-end ml-2 text-xs">
                  <span className={`${
                    selectedUserId === u._id ? 'text-indigo-200' : 'text-gray-500'
                  }`}>
                    {u.lastActive ? new Date(u.lastActive).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                  </span>
                  {u.unreadCount > 0 && (
                    <span className="mt-1 px-1.5 py-0.5 bg-indigo-500 text-white rounded-full text-xs font-medium">
                      {u.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="px-4 py-3 bg-gray-900 bg-opacity-70 backdrop-blur-md border-t border-gray-700 border-opacity-30 text-xs text-center text-gray-500">
        <p className="animate-pulse">Connected to chat server</p>
      </div>
    </div>
  );
};

export default Sidebar;