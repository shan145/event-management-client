import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Stack,
} from '@mui/material';
import { Group, Event } from '@mui/icons-material';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '3rem', md: '4rem' },
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(45deg, #000 30%, #333 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Eventify
          </Typography>
          
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 4, fontWeight: 300 }}
          >
            Organize events, manage groups, and bring people together
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Group sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Create & Manage Groups
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Event sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Plan & Track Events
                </Typography>
              </Box>
            </Stack>
          </Box>

          {user ? (
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')}
                sx={{ px: 4, py: 1.5 }}
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={handleLogout}
                sx={{ px: 4, py: 1.5 }}
              >
                Logout
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                sx={{ px: 4, py: 1.5 }}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/signup')}
                sx={{ px: 4, py: 1.5 }}
              >
                Sign Up
              </Button>
            </Stack>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage; 