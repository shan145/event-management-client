import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Group, CheckCircle, Error } from '@mui/icons-material';
import axios from 'axios';

// Create a separate axios instance for public endpoints (no auth headers)
const publicAxios = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
});

const InvitePage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [group, setGroup] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchGroupInfo();
  }, [token]);

  const fetchGroupInfo = async () => {
    try {
      setLoading(true);
      const response = await publicAxios.get(`/join/${token}`);
      setGroup(response.data.data.group);
    } catch (error) {
      console.error('Fetch group info error:', error);
      setError('Invalid or expired invite link');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/join/${token}` } });
      return;
    }

    try {
      setJoining(true);
      await axios.post(`/join/${token}`, {
        userId: user._id
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Join group error:', error);
      setError(error.response?.data?.message || 'Failed to join group');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error && !group) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            <Error sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Invalid Invite Link
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {error}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
            >
              Go Home
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  if (success) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Welcome to {group.name}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You have successfully joined the group. Redirecting to dashboard...
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          <Group sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            You're Invited!
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {group.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {group.description}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {user ? (
            <Button
              variant="contained"
              size="large"
              onClick={handleJoinGroup}
              disabled={joining}
              sx={{ px: 4, py: 1.5 }}
            >
              {joining ? 'Joining...' : 'Join Group'}
            </Button>
          ) : (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Please sign in to join this group
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login', { state: { from: `/join/${token}` } })}
                sx={{ px: 4, py: 1.5, mr: 2 }}
              >
                Sign In
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/signup', { state: { from: `/join/${token}` } })}
                sx={{ px: 4, py: 1.5 }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default InvitePage; 