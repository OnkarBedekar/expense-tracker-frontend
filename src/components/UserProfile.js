import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Row, Col, Spinner } from 'react-bootstrap';
import api from '../api';

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users/me');
        setUserData(response.data);
      } catch (err) {
        setError('Failed to fetch user information');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleProfileChange = (e) => {
    setUserData(userData => userData ? {
      ...userData,
      [e.target.name]: e.target.value
    } : null);
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    if (!userData) return;
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      await api.put('/users/me', userData);
      setMessage('Profile updated successfully');
    } catch (err) {
      // Handle error safely
      const errorMessage = err.response?.data?.detail || 'Failed to update profile';
      setError(typeof errorMessage === 'string' ? errorMessage : 'Failed to update profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    setPasswordLoading(true);
    
    try {
      await api.put('/users/password', {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      });
      setMessage('Password updated successfully');
      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      // Safely extract and display error message
      const errorData = err.response?.data;
      let errorMessage = 'Failed to update password';
      
      if (typeof errorData?.detail === 'string') {
        errorMessage = errorData.detail;
      } else if (errorData?.detail && typeof errorData.detail === 'object') {
        // Handle validation error objects
        errorMessage = errorData.detail.msg || 'Invalid password data';
      }
      
      setPasswordError(errorMessage);
      console.error(err);
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading && !userData) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading profile data...</span>
        </Spinner>
        <p className="mt-2">Loading profile data...</p>
      </div>
    );
  }

  return (
    <Row>
      <Col md={6} className="mb-4">
        <Card>
          <Card.Body>
            <Card.Title>Profile Information</Card.Title>
            {message && <Alert variant="success">{message}</Alert>}
            {/* Ensure error is displayed safely */}
            {error && <Alert variant="danger">{error}</Alert>}
            
            {userData ? (
              <Form onSubmit={updateProfile}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={userData.username || ''}
                    onChange={handleProfileChange}
                    disabled
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={userData.email || ''}
                    onChange={handleProfileChange}
                    required
                  />
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </Form>
            ) : (
              <p>User data not available.</p>
            )}
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={6}>
        <Card>
          <Card.Body>
            <Card.Title>Change Password</Card.Title>
            {/* Ensure passwordError is displayed safely */}
            {passwordError && <Alert variant="danger">{passwordError}</Alert>}
            
            <Form onSubmit={updatePassword}>
              <Form.Group className="mb-3">
                <Form.Label>Current Password</Form.Label>
                <Form.Control
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </Form.Group>
              
              <Button 
                variant="primary" 
                type="submit" 
                disabled={passwordLoading}
              >
                {passwordLoading ? 'Updating...' : 'Change Password'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default UserProfile;
