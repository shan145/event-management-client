import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import { ArrowBack, Email } from '@mui/icons-material';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/password-reset/request', {
        email: email.trim()
      });

      if (response.data.success) {
        setSuccess(response.data.message);
        setEmail('');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
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
            onClick={() => navigate('/login')}
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
            <Box sx={{ mb: 2 }}>
              <Email sx={{ fontSize: 48, color: 'primary.main' }} />
            </Box>
            <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 600 }}>
              Forgot password?
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Enter your email address and we'll send you a link to reset your password.
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

          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3,
                '& .MuiAlert-message': {
                  fontSize: '0.875rem',
                },
              }}
            >
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Email Address
              </Typography>
              <TextField
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
                placeholder="Enter your email address"
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
              disabled={loading || !email.trim()}
              sx={{ 
                mb: 3,
                py: 1.5,
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', pt: 3, borderTop: '1px solid #e1e1e1' }}>
            <Typography variant="body2" color="text.secondary">
              Remember your password?{' '}
              <MuiLink 
                component={Link} 
                to="/login" 
                sx={{ 
                  color: 'text.primary',
                  fontWeight: 500,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Back to sign in
              </MuiLink>
            </Typography>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage; 