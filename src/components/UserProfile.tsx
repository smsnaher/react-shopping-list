import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './UserProfile.css';

const UserProfile: React.FC = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="user-profile">
      <div className="user-info">
        {currentUser.photoURL && (
          <img 
            src={currentUser.photoURL} 
            alt="Profile" 
            className="profile-image"
          />
        )}
        <span className="user-name">{currentUser.displayName}</span>
      </div>
      <button 
        className="logout-btn"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default UserProfile;
