import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { FaEnvelope, FaLock, FaUser, FaUserPlus, FaImage } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './SignupPage.css';

const BASE_URL = import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : 'http://localhost:5000/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    status: "Hey there! I'm using ChatApp",
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;
    if (!username || !email || !password || !confirmPassword) return toast.error('All fields are required');
    if (password !== confirmPassword) return toast.error('Passwords do not match');

    setLoading(true);
    const loadingToast = toast.loading('Creating your account...');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', username);
      formDataToSend.append('email', email);
      formDataToSend.append('password', password);
      formDataToSend.append('status', formData.status);
      if (avatar) formDataToSend.append('avatar', avatar);

      const response = await axios.post(`${BASE_URL}/auth/register`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        const { user, token } = response.data;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        toast.dismiss(loadingToast);
        toast.success('Registration successful!');
        navigate('/');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900 font-sans">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: [
            'linear-gradient(45deg, #1e3a8a, #7c3aed, #db2777)',
            'linear-gradient(45deg, #7c3aed, #db2777, #f97316)',
            'linear-gradient(45deg, #db2777, #f97316, #1e3a8a)',
            'linear-gradient(45deg, #f97316, #1e3a8a, #7c3aed)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ opacity: 0.3 }}
      />

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md p-8 bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-100/20"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 animate-gradient-x"
          >
            Create Account
          </motion.h1>
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-gray-500 mt-2 text-sm"
          >
            Join the ChatApp revolution
          </motion.p>
        </div>

        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-8 flex justify-center"
          >
            <div className="relative w-32 h-32 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-4 border-purple-500 shadow-lg"
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="text-gray-500 text-6xl" />
                )}
              </motion.div>
              <label
                htmlFor="avatar"
                className="absolute inset-0 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 bg-opacity-70 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300"
              >
                <FaImage className="text-white text-3xl" />
              </label>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
          </motion.div>

          {[
            { id: 'username', label: 'Username', type: 'text', icon: FaUser, placeholder: 'Choose a username' },
            { id: 'email', label: 'Email Address', type: 'email', icon: FaEnvelope, placeholder: 'Enter your email' },
            { id: 'password', label: 'Password', type: 'password', icon: FaLock, placeholder: 'Create a password' },
            { id: 'confirmPassword', label: 'Confirm Password', type: 'password', icon: FaLock, placeholder: 'Confirm your password' },
          ].map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
              className="mb-5"
            >
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={field.id}>
                {field.label}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <field.icon className="text-gray-500 text-lg" />
                </div>
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-800 placeholder-gray-500 transition-all duration-300 shadow-md hover:shadow-lg hover:bg-gray-100/70"
                  placeholder={field.placeholder}
                  value={formData[field.id]}
                  onChange={handleChange}
                  required
                />
              </div>
            </motion.div>
          ))}

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white py-3 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-xl transition-all duration-300 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed animate-gradient-x"
            disabled={loading}
          >
            {loading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="mr-2 text-2xl"
              >
                ◌
              </motion.span>
            ) : (
              <FaUserPlus className="mr-2 text-xl" />
            )}
            Create Account
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-gray-500 text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-purple-400 font-semibold hover:text-pink-500 transition-colors duration-300"
            >
              Log in
            </Link>
          </p>
          <p className="text-gray-500 text-sm">
            Visit Home Page{' '}
            <Link
              to="/home"
              className="text-purple-400 font-semibold hover:text-pink-500 transition-colors duration-300"
            >
              Home
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;