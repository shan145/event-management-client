import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Divider,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Paper,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack,
  Person,
  Lock,
  Save,
  HomeOutlined,
  LogoutOutlined,
  MoreVert,
  Dashboard,
} from '@mui/icons-material';
import axios from 'axios';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
    if (profileError) setProfileError('');
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
    if (passwordError) setPasswordError('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      const response = await axios.put(`/users/${user._id}`, profileData);
      
      if (response.data.success) {
        setProfileSuccess('Profile updated successfully');
        // Update user context with new data
        setUser(response.data.data.user);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setProfileSuccess('');
        }, 3000);
      }
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess('');

    // Client-side validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      setPasswordLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      setPasswordLoading(false);
      return;
    }

    try {
      const response = await axios.put(`/users/${user._id}/password`, passwordData);
      
      if (response.data.success) {
        setPasswordSuccess('Password updated successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setPasswordSuccess('');
        }, 3000);
      }
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const isProfileChanged = () => {
    return (
      profileData.firstName !== user?.firstName ||
      profileData.lastName !== user?.lastName ||
      profileData.email !== user?.email
    );
  };

  const isPasswordFormValid = () => {
    return passwordData.currentPassword && 
           passwordData.newPassword && 
           passwordData.confirmPassword &&
           passwordData.newPassword === passwordData.confirmPassword &&
           passwordData.newPassword.length >= 6;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e1e1e1' }}>
        <Toolbar sx={{ py: 1 }}>
          <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Settings
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                {user?.firstName?.charAt(0)}
              </Avatar>
              <Typography variant="body2" color="text.primary">
                {user?.firstName} {user?.lastName}
              </Typography>
            </Box>
            
            <IconButton onClick={handleMenuOpen} size="small">
              <MoreVert />
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  '& .MuiMenuItem-root': {
                    px: 2,
                    py: 1.5,
                    fontSize: '0.875rem',
                  },
                },
              }}
            >
              <MenuItem onClick={() => navigate('/dashboard')}>
                <Dashboard sx={{ mr: 2, fontSize: 20 }} />
                Dashboard
              </MenuItem>
              <MenuItem onClick={() => navigate('/')}>
                <HomeOutlined sx={{ mr: 2, fontSize: 20 }} />
                Home
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutOutlined sx={{ mr: 2, fontSize: 20 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            Account Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account information and security settings
          </Typography>
        </Box>

        {isMobile ? (
          // Mobile Layout - Tabs at top
          <Box>
            <Paper elevation={1} sx={{ mb: 3, borderRadius: 2 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    minHeight: 60,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  },
                }}
              >
                <Tab
                  icon={<Person sx={{ fontSize: 20 }} />}
                  label="Profile"
                  sx={{ gap: 1 }}
                />
                <Tab
                  icon={<Lock sx={{ fontSize: 20 }} />}
                  label="Password"
                  sx={{ gap: 1 }}
                />
              </Tabs>
            </Paper>
            
            {/* Mobile Content Area */}
            <Box>
              {/* Profile Information Card */}
              {activeTab === 0 && (
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Person sx={{ mr: 2, color: 'primary.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Profile Information
                      </Typography>
                    </Box>

                    {profileError && (
                      <Alert severity="error" sx={{ mb: 3 }}>
                        {profileError}
                      </Alert>
                    )}

                    {profileSuccess && (
                      <Alert severity="success" sx={{ mb: 3 }}>
                        {profileSuccess}
                      </Alert>
                    )}

                    <Box component="form" onSubmit={handleProfileSubmit}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            First Name
                          </Typography>
                          <TextField
                            fullWidth
                            name="firstName"
                            value={profileData.firstName}
                            onChange={handleProfileChange}
                            required
                            variant="outlined"
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                fontSize: '0.875rem',
                              },
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', minHeight: '1.25rem' }}>
                            Enter your first name
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            Last Name
                          </Typography>
                          <TextField
                            fullWidth
                            name="lastName"
                            value={profileData.lastName}
                            onChange={handleProfileChange}
                            required
                            variant="outlined"
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                fontSize: '0.875rem',
                              },
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', minHeight: '1.25rem' }}>
                            Enter your last name
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            Email Address
                          </Typography>
                          <TextField
                            fullWidth
                            name="email"
                            type="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            required
                            variant="outlined"
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                fontSize: '0.875rem',
                              },
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', minHeight: '1.25rem' }}>
                            Your email address for account access
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={profileLoading || !isProfileChanged()}
                          startIcon={<Save />}
                          sx={{ px: 4, py: 1.5 }}
                        >
                          {profileLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Password Change Card */}
              {activeTab === 1 && (
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Lock sx={{ mr: 2, color: 'primary.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Change Password
                      </Typography>
                    </Box>

                    {passwordError && (
                      <Alert severity="error" sx={{ mb: 3 }}>
                        {passwordError}
                      </Alert>
                    )}

                    {passwordSuccess && (
                      <Alert severity="success" sx={{ mb: 3 }}>
                        {passwordSuccess}
                      </Alert>
                    )}

                    <Box component="form" onSubmit={handlePasswordSubmit}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            Current Password
                          </Typography>
                          <TextField
                            fullWidth
                            name="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                            variant="outlined"
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                fontSize: '0.875rem',
                              },
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', minHeight: '1.25rem' }}>
                            Enter your current password to verify
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            New Password
                          </Typography>
                          <TextField
                            fullWidth
                            name="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                            variant="outlined"
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                fontSize: '0.875rem',
                              },
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', minHeight: '1.25rem' }}>
                            Password must be at least 6 characters long
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            Confirm New Password
                          </Typography>
                          <TextField
                            fullWidth
                            name="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                            variant="outlined"
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                fontSize: '0.875rem',
                              },
                            }}
                          />
                          <Box sx={{ minHeight: '1.25rem', mt: 1 }}>
                            {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                              <Typography variant="caption" color="error" sx={{ display: 'block' }}>
                                Passwords do not match
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Box>

                      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={passwordLoading || !isPasswordFormValid()}
                          startIcon={<Save />}
                          sx={{ px: 4, py: 1.5 }}
                        >
                          {passwordLoading ? 'Updating...' : 'Update Password'}
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Box>
          </Box>
        ) : (
          // Desktop Layout - Sidebar with tabs
          <Box sx={{ display: 'flex', gap: 4 }}>
            {/* Left Sidebar with Tabs */}
            <Paper 
              elevation={1} 
              sx={{ 
                width: 280, 
                minHeight: 400,
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <Tabs
                orientation="vertical"
                value={activeTab}
                onChange={handleTabChange}
                sx={{
                  borderRight: 1,
                  borderColor: 'divider',
                  '& .MuiTab-root': {
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    minHeight: 72,
                    px: 3,
                    py: 2,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      color: 'primary.main',
                    },
                  },
                  '& .MuiTabs-indicator': {
                    left: 0,
                    width: 3,
                  },
                }}
              >
                <Tab
                  icon={<Person sx={{ fontSize: 20, mb: 0.5 }} />}
                  iconPosition="start"
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Profile Information
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Update your personal details
                      </Typography>
                    </Box>
                  }
                  sx={{ justifyContent: 'flex-start', gap: 2 }}
                />
                <Tab
                  icon={<Lock sx={{ fontSize: 20, mb: 0.5 }} />}
                  iconPosition="start"
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Change Password
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Update your account password
                      </Typography>
                    </Box>
                  }
                  sx={{ justifyContent: 'flex-start', gap: 2 }}
                />
              </Tabs>
            </Paper>

            {/* Desktop Main Content Area */}
            <Box sx={{ flex: 1 }}>
              {/* Profile Information Card */}
              {activeTab === 0 && (
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Person sx={{ mr: 2, color: 'primary.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Profile Information
                      </Typography>
                    </Box>

                    {profileError && (
                      <Alert severity="error" sx={{ mb: 3 }}>
                        {profileError}
                      </Alert>
                    )}

                    {profileSuccess && (
                      <Alert severity="success" sx={{ mb: 3 }}>
                        {profileSuccess}
                      </Alert>
                    )}

                    <Box component="form" onSubmit={handleProfileSubmit}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 500 }}>
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            First Name
                          </Typography>
                          <TextField
                            fullWidth
                            name="firstName"
                            value={profileData.firstName}
                            onChange={handleProfileChange}
                            required
                            variant="outlined"
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                fontSize: '0.875rem',
                              },
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', minHeight: '1.25rem' }}>
                            Enter your first name
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            Last Name
                          </Typography>
                          <TextField
                            fullWidth
                            name="lastName"
                            value={profileData.lastName}
                            onChange={handleProfileChange}
                            required
                            variant="outlined"
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                fontSize: '0.875rem',
                              },
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', minHeight: '1.25rem' }}>
                            Enter your last name
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            Email Address
                          </Typography>
                          <TextField
                            fullWidth
                            name="email"
                            type="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            required
                            variant="outlined"
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                fontSize: '0.875rem',
                              },
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', minHeight: '1.25rem' }}>
                            Your email address for account access
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={profileLoading || !isProfileChanged()}
                          startIcon={<Save />}
                          sx={{ px: 4, py: 1.5 }}
                        >
                          {profileLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Password Change Card */}
              {activeTab === 1 && (
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Lock sx={{ mr: 2, color: 'primary.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Change Password
                      </Typography>
                    </Box>

                    {passwordError && (
                      <Alert severity="error" sx={{ mb: 3 }}>
                        {passwordError}
                      </Alert>
                    )}

                    {passwordSuccess && (
                      <Alert severity="success" sx={{ mb: 3 }}>
                        {passwordSuccess}
                      </Alert>
                    )}

                    <Box component="form" onSubmit={handlePasswordSubmit}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 500 }}>
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            Current Password
                          </Typography>
                          <TextField
                            fullWidth
                            name="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                            variant="outlined"
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                fontSize: '0.875rem',
                              },
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', minHeight: '1.25rem' }}>
                            Enter your current password to verify
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            New Password
                          </Typography>
                          <TextField
                            fullWidth
                            name="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                            variant="outlined"
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                fontSize: '0.875rem',
                              },
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', minHeight: '1.25rem' }}>
                            Password must be at least 6 characters long
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            Confirm New Password
                          </Typography>
                          <TextField
                            fullWidth
                            name="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                            variant="outlined"
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                fontSize: '0.875rem',
                              },
                            }}
                          />
                          <Box sx={{ minHeight: '1.25rem', mt: 1 }}>
                            {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                              <Typography variant="caption" color="error" sx={{ display: 'block' }}>
                                Passwords do not match
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Box>

                      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={passwordLoading || !isPasswordFormValid()}
                          startIcon={<Save />}
                          sx={{ px: 4, py: 1.5 }}
                        >
                          {passwordLoading ? 'Updating...' : 'Update Password'}
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default SettingsPage; 