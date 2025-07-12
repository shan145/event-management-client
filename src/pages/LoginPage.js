import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Card,
  Alert,
  Link as MuiLink,
  IconButton,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <IconButton
            onClick={() => navigate('/')}
            sx={{ mb: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Eventify
          </Typography>
        </Box>

        <Card
          sx={{
            p: 6,
            maxWidth: 400,
            mx: 'auto',
            border: '1px solid #e1e1e1',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 600 }}>
              Welcome back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to your account to continue
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                '& .MuiAlert-message': {
                  fontSize: '0.875rem',
                },
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Email
              </Typography>
              <TextField
                fullWidth
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                autoFocus
                placeholder="Enter your email"
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    fontSize: '0.875rem',
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Password
              </Typography>
              <TextField
                fullWidth
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    fontSize: '0.875rem',
                  },
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                mb: 3,
                py: 1.5,
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', pt: 3, borderTop: '1px solid #e1e1e1' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <MuiLink 
                component={Link} 
                to="/signup" 
                sx={{ 
                  color: 'text.primary',
                  fontWeight: 500,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Sign up
              </MuiLink>
            </Typography>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage; 