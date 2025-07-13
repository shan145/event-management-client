import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Card,
  Alert,
  IconButton,
  LinearProgress,
} from '@mui/material';
import { ArrowBack, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [verifyingToken, setVerifyingToken] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await axios.get(`/password-reset/verify/${token}`);
      if (response.data.success) {
        setTokenValid(true);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid or expired reset link');
      setTokenValid(false);
    } finally {
      setVerifyingToken(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/password-reset/reset', {
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.data.success) {
        setSuccess(response.data.message);
        setFormData({ password: '', confirmPassword: '' });
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return formData.password.trim() && 
           formData.confirmPassword.trim() && 
           formData.password === formData.confirmPassword &&
           formData.password.length >= 6;
  };

  if (verifyingToken) {
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
          <Card
            sx={{
              p: 6,
              maxWidth: 400,
              mx: 'auto',
              border: '1px solid #e1e1e1',
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Verifying reset link...
            </Typography>
            <LinearProgress />
          </Card>
        </Container>
      </Box>
    );
  }

  if (!tokenValid) {
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
              textAlign: 'center',
            }}
          >
            <Lock sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              Invalid Link
            </Typography>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              This password reset link is either invalid or has expired. 
              Please request a new password reset link.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/forgot-password')}
              sx={{ mr: 2 }}
            >
              Request New Link
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/login')}
            >
              Back to Login
            </Button>
          </Card>
        </Container>
      </Box>
    );
  }

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
              <Lock sx={{ fontSize: 48, color: 'primary.main' }} />
            </Box>
            <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 600 }}>
              Reset password
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Enter your new password below.
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
              <Typography variant="body2" sx={{ mt: 1 }}>
                Redirecting to login page...
              </Typography>
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                New Password
              </Typography>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter new password"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    fontSize: '0.875rem',
                  },
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Password must be at least 6 characters long
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Confirm New Password
              </Typography>
              <TextField
                fullWidth
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm new password"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    fontSize: '0.875rem',
                  },
                }}
              />
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  Passwords do not match
                </Typography>
              )}
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || !isFormValid()}
              sx={{ 
                mb: 3,
                py: 1.5,
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              {loading ? 'Resetting password...' : 'Reset Password'}
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default ResetPasswordPage; 