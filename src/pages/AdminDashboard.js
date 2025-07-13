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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Card,
  CardContent,
} from '@mui/material';
import {
  Group,
  Event,
  Add,
  Dashboard,
  People,
  LogoutOutlined,
  HomeOutlined,
  MoreVert,
  Settings,
} from '@mui/icons-material';
import GroupCard from '../components/GroupCard';
import EventCard from '../components/EventCard';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [groups, setGroups] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
  });
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [groupsRes, eventsRes, usersRes] = await Promise.all([
        axios.get('/groups'),
        axios.get('/events'),
        axios.get('/users'),
      ]);
      
      setGroups(groupsRes.data.data.groups);
      setEvents(eventsRes.data.data.events);
      setUsers(usersRes.data.data.users);
    } catch (error) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    try {
      setError('');
      const response = await axios.post('/groups', groupData);
      setGroups([...groups, response.data.data.group]);
      setShowGroupDialog(false);
      setGroupData({ name: '', description: '' });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create group');
    }
  };

  const handleDeleteGroup = (groupId) => {
    setGroups(groups.filter(g => g._id !== groupId));
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(e => e._id !== eventId));
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
            Eventify Admin
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
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.125rem' }}>
            Manage groups, events, and users across your organization.
          </Typography>
        </Box>

        {/* Tabs */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ borderBottom: '1px solid #e1e1e1' }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)}
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
                label="Groups" 
                icon={<Group />} 
                iconPosition="start"
                sx={{ gap: 1 }}
              />
              <Tab 
                label="Events" 
                icon={<Event />} 
                iconPosition="start"
                sx={{ gap: 1 }}
              />
              <Tab 
                label="Users" 
                icon={<People />} 
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
                Groups
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowGroupDialog(true)}
                sx={{ py: 1.5, px: 3 }}
              >
                Create Group
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {groups.map((group) => (
                <Grid item xs={12} sm={6} md={3} key={group._id}>
                  <GroupCard
                    group={group}
                    onUpdate={fetchData}
                    onDelete={handleDeleteGroup}
                    isAdmin={true}
                    userRole={user.role}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Events Tab */}
        {activeTab === 1 && (
          <Box>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
              Events
            </Typography>
            <Grid container spacing={3}>
              {events.map((event) => (
                <Grid item xs={12} sm={6} md={3} key={event._id} sx={{ minWidth: 0, maxWidth: '100%' }}>
                  <EventCard
                    event={event}
                    onUpdate={fetchData}
                    onDelete={handleDeleteEvent}
                    userRole={user.role}
                    currentUserId={user._id}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Users Tab */}
        {activeTab === 2 && (
          <Box>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
              Users
            </Typography>
            <Grid container spacing={3}>
              {users.map((userItem) => (
                <Grid item xs={12} sm={6} md={3} key={userItem._id}>
                  <Card sx={{ 
                    p: 3,
                    border: '1px solid #e1e1e1',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }
                  }}>
                    <CardContent sx={{ p: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', mr: 2 }}>
                          {userItem.firstName?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                            {userItem.firstName} {userItem.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {userItem.email}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 3 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Role
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                            {userItem.role}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Groups
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {userItem.groups?.length || 0}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>

      {/* Create Group Dialog */}
      <Dialog 
        open={showGroupDialog} 
        onClose={() => setShowGroupDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Group</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Group Name"
            value={groupData.name}
            onChange={(e) => setGroupData({ ...groupData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={groupData.description}
            onChange={(e) => setGroupData({ ...groupData, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowGroupDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateGroup} 
            variant="contained"
            disabled={!groupData.name}
          >
            Create Group
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard; 