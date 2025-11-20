import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Alert,
  Button,
  TextField,
  Stack,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { ArrowBack, WarningAmber } from '@mui/icons-material';

const DeleteAccountPage = () => {
  const navigate = useNavigate();
  const { user, deleteAccount } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const userEmail = user?.email || '';

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!currentPassword) {
      setError('Please enter your current password');
      return;
    }

    if (confirmation !== userEmail) {
      setError('Confirmation email does not match');
      return;
    }

    setLoading(true);
    setError('');

    const result = await deleteAccount(currentPassword);

    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setError(result.error || 'Failed to delete account');
    }

    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e1e1e1' }}>
        <Toolbar sx={{ py: 1 }}>
          <IconButton onClick={() => navigate('/settings')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Delete Account
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Card>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <WarningAmber color="error" />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Permanently delete your account
                </Typography>
              </Box>

              <Alert severity="warning">
                This action removes your profile, device tokens, and participation history. You will be removed from all groups and events, and this cannot be undone.
              </Alert>

              {error && (
                <Alert severity="error">
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Current password
                  </Typography>
                  <TextField
                    fullWidth
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                </div>

                <div>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Type your email to confirm
                  </Typography>
                  <TextField
                    fullWidth
                    value={confirmation}
                    onChange={(event) => setConfirmation(event.target.value)}
                    placeholder={userEmail}
                    autoComplete="off"
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Enter {userEmail || 'your email'} to confirm you want to delete this account.
                  </Typography>
                </div>

                <Button
                  type="submit"
                  variant="contained"
                  color="error"
                  disabled={loading}
                  sx={{ py: 1.5 }}
                >
                  {loading ? 'Deleting account...' : 'Delete my account'}
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button variant="text" onClick={() => navigate('/settings')}>
            Cancel and go back
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default DeleteAccountPage;

