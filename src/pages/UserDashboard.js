import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import {
  Group,
  Event,
  Dashboard,
  People,
  Logout,
} from '@mui/icons-material';
import GroupCard from '../components/GroupCard';
import EventCard from '../components/EventCard';
import axios from 'axios';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userGroups, setUserGroups] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [groupsRes, eventsRes] = await Promise.all([
        axios.get('/groups/user'),
        axios.get('/events/user'),
      ]);
      
      setUserGroups(groupsRes.data.data.groups);
      setUserEvents(eventsRes.data.data.events);
    } catch (error) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', color: 'text.primary' }}>
        <Toolbar>
          <Dashboard sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Dashboard
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Welcome, {user?.firstName} {user?.lastName}
          </Typography>
          <IconButton onClick={handleMenuOpen} color="inherit">
            <People />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => navigate('/')}>Home</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Welcome Section */}
        <Box sx={{ 
          mb: 3, 
          textAlign: 'center'
        }}>
          <Typography variant="h4" gutterBottom>
            Welcome to Eventify!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your groups and events, join waitlists, and stay connected with your community.
          </Typography>
        </Box>

        {/* Tabs */}
        <Paper sx={{ 
          mb: 3,
          bgcolor: '#fefefe',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="My Groups" icon={<Group />} />
            <Tab label="My Events" icon={<Event />} />
          </Tabs>
        </Paper>

        {/* Groups Tab */}
        {activeTab === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4">My Groups</Typography>
              <Typography variant="body2" color="text.secondary">
                {userGroups.length} group{userGroups.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
            
            {userGroups.length === 0 ? (
              <Paper sx={{ 
                p: 4, 
                textAlign: 'center',
                bgcolor: '#fefefe',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)'
              }}>
                <Group sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No Groups Yet
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  You haven't joined any groups yet. Ask an admin for an invite link!
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {userGroups.map((group) => (
                  <Grid item xs={12} sm={6} md={4} key={group._id}>
                    <GroupCard
                      group={group}
                      onUpdate={fetchUserData}
                      isAdmin={group.adminId === user._id}
                      userRole={user.role}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {/* Events Tab */}
        {activeTab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4">My Events</Typography>
              <Typography variant="body2" color="text.secondary">
                {userEvents.length} event{userEvents.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
            
            {userEvents.length === 0 ? (
              <Paper sx={{ 
                p: 4, 
                textAlign: 'center',
                bgcolor: '#fefefe',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)'
              }}>
                <Event sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No Events Yet
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  You haven't joined any events yet. Check your groups for upcoming events!
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {userEvents.map((event) => (
                  <Grid item xs={12} sm={6} md={4} key={event._id}>
                    <EventCard
                      event={event}
                      onUpdate={fetchUserData}
                      userRole={user.role}
                      currentUserId={user._id}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {/* Quick Stats */}
        <Paper sx={{ 
          p: 3, 
          mt: 4,
          bgcolor: '#fefefe',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <Typography variant="h6" gutterBottom>
            Quick Stats
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {userGroups.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Groups Joined
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {userEvents.filter(e => e.goingList?.some(u => u._id === user._id)).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Events Going
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {userEvents.filter(e => e.waitlist?.some(u => u._id === user._id)).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  On Waitlist
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default UserDashboard; 