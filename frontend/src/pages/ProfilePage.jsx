import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Add CSS styles
const styles = {
  profilePage: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '2rem',
    borderBottom: '2px solid #3498db',
    paddingBottom: '0.5rem',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  profileDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '2rem',
    padding: '1.5rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  avatar: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #3498db',
    marginBottom: '1rem',
  },
  username: {
    fontSize: '1.5rem',
    margin: '0.5rem 0',
    color: '#2c3e50',
  },
  userInfo: {
    margin: '0.2rem 0',
    color: '#7f8c8d',
    fontSize: '1rem',
  },
  updateSection: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  sectionHeading: {
    fontSize: '1.2rem',
    color: '#2c3e50',
    marginBottom: '1rem',
    borderLeft: '4px solid #3498db',
    paddingLeft: '0.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '0.8rem',
    marginBottom: '1rem',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  fileInput: {
    marginBottom: '1rem',
  },
  button: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'background-color 0.3s ease',
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
    cursor: 'not-allowed',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    width: '100%',
    marginTop: '1rem',
    transition: 'background-color 0.3s ease',
  },
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login'); // Redirect to login if not authenticated
          return;
        }

        // Fetch user data (you might need a dedicated endpoint for this)
        // For now, we'll use the user data stored in localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        // console.log(storedUser);
        if (storedUser) {
          setUser(storedUser);
          setStatus(storedUser.status); // Pre-fill the status input
        } else {
          // Optionally, fetch from the server if not in localStorage

          //This won't work because the endpoint is not created in backend
          // const response = await axios.get('http://localhost:5000/api/auth/me', {
          //   headers: {
          //     Authorization: `Bearer ${token}`,
          //   },
          // });
          // setUser(response.data.user);
          // setStatus(response.data.user.status);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
        navigate('/login'); // Redirect to login on error
      }
    };

    fetchUserData();
  }, [navigate]);

  // Handle status update
  const handleStatusUpdate = async (e) => {    
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${import.meta.env.RENDER_BACKEND_URL}/api/auth/update`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state and storage
      const updatedUser = { ...user, status: response.data.user.status };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      alert('Status updated successfully!');
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    e.preventDefault();
    if (!avatar) {
      setError('Please select an image to upload');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('avatar', avatar);

      const response = await axios.post(
        `${import.meta.env.RENDER_BACKEND_URL}/api/auth/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Update local state and storage
      const updatedUser = { ...user, avatar: response.data.user.avatar };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setAvatar(null); // Clear the file input
      alert('Avatar updated successfully!');
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError('Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.RENDER_BACKEND_URL}/api/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clear localStorage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      // Proceed with client-side logout even if the server request fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  if (!user) {
    return <div style={{ textAlign: 'center', padding: '2rem', fontSize: '1.2rem' }}>Loading...</div>;
  }

  return (
    <div style={styles.profilePage}>
      <h1 style={styles.heading}>Profile</h1>
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.profileDetails}>
        <img
          src={user.avatar || 'https://via.placeholder.com/150'}
          alt="Avatar"
          style={styles.avatar}
        />
        <h2 style={styles.username}>{user.username}</h2>
        <p style={styles.userInfo}>Email: {user.email}</p>
        <p style={styles.userInfo}>Status: {user.status}</p>
      </div>

      {/* Update Status Form */}
      <div style={styles.updateSection}>
        <h3 style={styles.sectionHeading}>Update Status</h3>
        <form style={styles.form} onSubmit={handleStatusUpdate}>
          <input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="Update your status"
            disabled={loading}
            style={styles.input}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.disabledButton : {})
            }}
          >
            {loading ? 'Updating...' : 'Update Status'}
          </button>
        </form>
      </div>

      {/* Update Avatar Form */}
      <div style={styles.updateSection}>
        <h3 style={styles.sectionHeading}>Update Avatar</h3>
        <form style={styles.form} onSubmit={handleAvatarUpload}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
            disabled={loading}
            style={styles.fileInput}
          />
          <button 
            type="submit" 
            disabled={loading || !avatar}
            style={{
              ...styles.button,
              ...(loading || !avatar ? styles.disabledButton : {})
            }}
          >
            {loading ? 'Uploading...' : 'Update Avatar'}
          </button>
        </form>
      </div>

      {/* Logout Button */}
      <button 
        onClick={handleLogout} 
        style={styles.logoutButton}
      >
        Logout
      </button>
    </div>
  );
};

export default ProfilePage;