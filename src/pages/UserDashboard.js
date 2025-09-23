import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Typography,
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
  Avatar,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import {
  Group,
  Event,
  Dashboard,
  People,
  LogoutOutlined,
  HomeOutlined,
  MoreVert,
  Settings,
  History,
} from '@mui/icons-material';
import GroupCard from '../components/GroupCard';
import EventCard from '../components/EventCard';
import axios from 'axios';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userGroups, setUserGroups] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('userDashboardActiveTab');
    return savedTab ? parseInt(savedTab, 10) : 0;
  });
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    localStorage.setItem('userDashboardActiveTab', newValue.toString());
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [groupsRes, eventsRes, pastEventsRes] = await Promise.all([
        axios.get('/groups/user'),
        axios.get('/events/user'),
        axios.get('/events/past'),
      ]);
      
      setUserGroups(groupsRes.data.data.groups);
      setUserEvents(eventsRes.data.data.events);
      setPastEvents(pastEventsRes.data.data.events);
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
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e1e1e1' }}>
        <Toolbar sx={{ py: 1 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Eventable
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
              <MenuItem onClick={() => navigate('/')}>
                <HomeOutlined sx={{ mr: 2, fontSize: 20 }} />
                Home
              </MenuItem>
              <MenuItem onClick={() => navigate('/settings')}>
                <Settings sx={{ mr: 2, fontSize: 20 }} />
                Settings
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutOutlined sx={{ mr: 2, fontSize: 20 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Welcome Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>
            Welcome back, {user?.firstName}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.125rem' }}>
            Manage your groups and events, join waitlists, and stay connected with your community.
          </Typography>
        </Box>

        {/* Tabs */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ borderBottom: '1px solid #e1e1e1' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              sx={{
                '& .MuiTabs-flexContainer': {
                  gap: 4,
                },
                '& .MuiTab-root': {
                  minHeight: 48,
                  py: 1.5,
                  px: 0,
                },
              }}
            >
              <Tab 
                label="My Groups" 
                icon={<Group />} 
                iconPosition="start"
                sx={{ gap: 1 }}
              />
              <Tab 
                label="My Events" 
                icon={<Event />} 
                iconPosition="start"
                sx={{ gap: 1 }}
              />
              <Tab 
                label="Past Events" 
                icon={<History />} 
                iconPosition="start"
                sx={{ gap: 1 }}
              />
            </Tabs>
          </Box>
        </Box>

        {/* Groups Tab */}
        {activeTab === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                My Groups
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                {userGroups.length} group{userGroups.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
            
            {userGroups.length === 0 ? (
              <Card sx={{ 
                p: 6, 
                textAlign: 'center',
                border: '1px solid #e1e1e1',
                backgroundColor: '#fafafa',
              }}>
                <CardContent>
                  <Group sx={{ fontSize: 48, color: 'text.secondary', mb: 3 }} />
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    No Groups Yet
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                    You haven't joined any groups yet. Ask an admin for an invite link to get started!
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={3}>
                {userGroups.map((group) => (
                  <Grid item xs={12} sm={6} md={3} key={group._id}>
                    {(() => {
                      const isGroupAdmin = user.groupAdminOf && user.groupAdminOf.some(userGroup => userGroup._id === group._id);
                      return (
                        <GroupCard
                          group={group}
                          onUpdate={fetchUserData}
                          isAdmin={user.role === 'admin'}
                          isGroupAdmin={isGroupAdmin}
                          userRole={user.role}
                        />
                      );
                    })()}
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {/* Events Tab */}
        {activeTab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                My Events
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                {userEvents.length} event{userEvents.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
            
            {userEvents.length === 0 ? (
              <Card sx={{ 
                p: 6, 
                textAlign: 'center',
                border: '1px solid #e1e1e1',
                backgroundColor: '#fafafa',
              }}>
                <CardContent>
                  <Event sx={{ fontSize: 48, color: 'text.secondary', mb: 3 }} />
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    No Events Yet
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                    You haven't joined any events yet. Check your groups for upcoming events!
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={3}>
                {userEvents.map((event) => (
                  <Grid item xs={12} sm={6} md={3} key={event._id} sx={{ minWidth: 0, maxWidth: '100%' }}>
                    <EventCard
                      event={event}
                      onUpdate={fetchUserData}
                      userRole={user.role}
                      currentUserId={user._id}
                      isGroupAdmin={(() => {
                        const isGroupAdmin = user.groupAdminOf && event.groupId && user.groupAdminOf.some(group => group._id === event.groupId._id);
                        return isGroupAdmin;
                      })()}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {/* Past Events Tab */}
        {activeTab === 2 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                Past Events
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                {pastEvents.length} event{pastEvents.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
            
            {pastEvents.length === 0 ? (
              <Card sx={{ 
                p: 6, 
                textAlign: 'center',
                border: '1px solid #e1e1e1',
                backgroundColor: '#fafafa',
              }}>
                <CardContent>
                  <History sx={{ fontSize: 48, color: 'text.secondary', mb: 3 }} />
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    No Past Events
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                    You haven't participated in any events yet. Join some groups and start attending events!
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={3}>
                {pastEvents.map((event) => (
                  <Grid item xs={12} sm={6} md={3} key={event._id} sx={{ minWidth: 0, maxWidth: '100%' }}>
                    <EventCard
                      event={event}
                      onUpdate={fetchUserData}
                      userRole={user.role}
                      currentUserId={user._id}
                      isGroupAdmin={(() => {
                        const isGroupAdmin = user.groupAdminOf && event.groupId && user.groupAdminOf.some(group => group._id === event.groupId._id);
                        return isGroupAdmin;
                      })()}
                      isPastEvent={true}
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