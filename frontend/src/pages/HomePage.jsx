import { motion } from 'framer-motion';
import { FaComments, FaUsers, FaRocket } from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gray-900 font-sans text-white">
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
          scale: [1, 1.02, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        style={{ opacity: 0.3, filter: 'blur(100px)' }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 text-center px-6 py-12 max-w-4xl"
      >
        {/* Header */}
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse"
        >
          ChatApp
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg md:text-2xl text-gray-300 mb-12"
        >
          Connect, chat, and share in a world of vibrant conversations.
        </motion.p>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: FaComments,
              title: 'Real-Time Messaging',
              desc: 'Instantly connect with friends using seamless, real-time chat.',
            },
            {
              icon: FaUsers,
              title: 'Community Vibes',
              desc: 'Join a lively community and make new connections effortlessly.',
            },
            {
              icon: FaRocket,
              title: 'Next-Level Features',
              desc: 'Share images, set statuses, and enjoy a futuristic chat experience.',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.2, duration: 0.6 }}
              className="p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/10 hover:shadow-2xl hover:bg-white/30 transition-all duration-300 hover:scale-105"
            >
              <feature.icon className="text-4xl text-purple-400 mb-4 mx-auto animate-bounce" />
              <h3 className="text-xl font-semibold text-gray-100 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-300">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-12"
        >
          <a
            href="/register"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-xl hover:from-blue-700 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 hover:scale-110"
          >
            Get Started
          </a>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-4 text-gray-400 text-sm"
      >
        © 2025 ChatApp 
      </motion.footer>
    </div>
  );
};

export default HomePage;
