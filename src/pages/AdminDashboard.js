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
} from '@mui/material';
import {
  Group,
  Event,
  Add,
  Logout,
  Dashboard,
  People,
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
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', color: 'text.primary' }}>
        <Toolbar>
          <Dashboard sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
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

        {/* Tabs */}
        <Paper sx={{ 
          mb: 3,
          bgcolor: '#fefefe',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Groups" icon={<Group />} />
            <Tab label="Events" icon={<Event />} />
            <Tab label="Users" icon={<People />} />
          </Tabs>
        </Paper>

        {/* Groups Tab */}
        {activeTab === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4">Groups</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowGroupDialog(true)}
              >
                Create Group
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {groups.map((group) => (
                <Grid item xs={12} sm={6} md={4} key={group._id}>
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
            <Typography variant="h4" sx={{ mb: 3 }}>Events</Typography>
            <Grid container spacing={3}>
              {events.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event._id}>
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
            <Typography variant="h4" sx={{ mb: 3 }}>Users</Typography>
            <Grid container spacing={3}>
              {users.map((userItem) => (
                <Grid item xs={12} sm={6} md={4} key={userItem._id}>
                  <Paper sx={{ 
                    p: 3,
                    bgcolor: '#fefefe',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
                    '&:hover': {
                      bgcolor: '#fafafa',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s ease-in-out'
                    }
                  }}>
                    <Typography variant="h6">
                      {userItem.firstName} {userItem.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {userItem.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Role: {userItem.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Groups: {userItem.groups?.length || 0}
                    </Typography>
                  </Paper>
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