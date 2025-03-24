import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { FaEnvelope, FaLock, FaSignInAlt, FaFingerprint } from 'react-icons/fa';
import './LoginPage.css'

const BASE_URL = import.meta.env.VITE_RENDER_BACKEND_URL;
console.log(BASE_URL);
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('All fields are required');

    setLoading(true);
    const loadingToast = toast.loading('Logging in...');

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
      if (response.data.success) {
        const { user, token } = response.data;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        toast.dismiss(loadingToast);
        toast.success('Login successful!');
        navigate('/');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-8 font-sans">
      <div className="relative w-full max-w-md p-8 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
        {/* Animated tech background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i}
                className="absolute bg-blue-500 rounded-full"
                style={{
                  width: `${Math.random() * 10 + 1}px`,
                  height: `${Math.random() * 10 + 1}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.5,
                  animation: `pulse ${Math.random() * 5 + 2}s infinite alternate`
                }}
              />
            ))}
          </div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
        </div>

        <div className="relative">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FaFingerprint className="text-white text-3xl" />
            </div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
              Welcome Back
            </h1>
            <p className="text-blue-200 mt-2 text-sm">Secure login to your ChatApp account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-blue-300 text-sm font-medium mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <FaEnvelope className="text-blue-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  className="w-full pl-10 pr-4 py-3.5 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 shadow-inner"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-blue-300 text-sm font-medium" htmlFor="password">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors duration-200">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <FaLock className="text-blue-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  className="w-full pl-10 pr-4 py-3.5 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 shadow-inner"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-1 hover:shadow-blue-500/20 active:translate-y-0"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center font-medium">
                  <FaSignInAlt className="mr-2" />
                  Login to Dashboard
                </span>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-gray-800 bg-opacity-50 text-sm text-gray-400">Or continue with</span>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center space-x-4">
            <button className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors duration-200 shadow-md">
              <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors duration-200 shadow-md">
              <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12c6.627 0 12-5.373 12-12S18.627 0 12 0zm.14 19.018c-3.868 0-7-3.14-7-7.018 0-3.878 3.132-7.018 7-7.018 1.89 0 3.598.748 4.85 1.962l-2.07 1.993c-.603-.648-1.66-1.41-2.78-1.41-2.369 0-4.338 2.016-4.338 4.473 0 2.458 1.97 4.473 4.338 4.473 2.238 0 3.322-1.393 3.55-2.455h-3.55v-2.637h6.012c.058.343.103.686.103 1.143 0 3.98-2.656 6.467-6.114 6.467z"/>
              </svg>
            </button>
            <button className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors duration-200 shadow-md">
              <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-400 font-medium hover:text-blue-300 transition-colors duration-200">
                Create Account
              </Link>
            </p>
            <p className="text-gray-400">
              {' '}
              <Link to="/home" className="text-blue-400 font-medium hover:text-blue-300 transition-colors duration-200">
                Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;