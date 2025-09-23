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
  Grid,
  IconButton,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) clearError();
    if (validationError) setValidationError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    const { confirmPassword, ...signupData } = formData;
    const result = await signup(signupData);
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
            Eventable
          </Typography>
        </Box>

        <Card
          sx={{
            p: 6,
            maxWidth: 500,
            mx: 'auto',
            border: '1px solid #e1e1e1',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 600 }}>
              Create your account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Get started with Eventable today
            </Typography>
          </Box>

          {(error || validationError) && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                '& .MuiAlert-message': {
                  fontSize: '0.875rem',
                },
              }}
            >
              {error || validationError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                First Name
              </Typography>
              <TextField
                fullWidth
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                autoComplete="given-name"
                placeholder="Enter your first name"
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    fontSize: '0.875rem',
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Last Name
              </Typography>
              <TextField
                fullWidth
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                autoComplete="family-name"
                placeholder="Enter your last name"
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    fontSize: '0.875rem',
                  },
                }}
              />
            </Box>

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
                placeholder="Enter your email"
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    fontSize: '0.875rem',
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
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
                autoComplete="new-password"
                placeholder="Create a password"
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
                Confirm Password
              </Typography>
              <TextField
                fullWidth
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                placeholder="Confirm your password"
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
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', pt: 3, borderTop: '1px solid #e1e1e1' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
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
                Sign in
              </MuiLink>
            </Typography>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default SignupPage; 