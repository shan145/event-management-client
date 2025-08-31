import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  TextField,
  Alert,
  Box,
  Chip,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Person,
  Delete,
  Add,
  AdminPanelSettings,
  PersonAdd
} from '@mui/icons-material';
import axios from 'axios';

const GroupAdminDialog = ({ open, onClose, group, onUpdate }) => {
  const [admins, setAdmins] = useState({ mainAdmin: null, groupAdmins: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [removingAdmin, setRemovingAdmin] = useState(null);

  useEffect(() => {
    if (open && group) {
      fetchGroupAdmins();
    }
  }, [open, group]);

  const fetchGroupAdmins = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`/groups/${group._id}/admins`);
      setAdmins(response.data.data);
    } catch (error) {
      setError('Failed to fetch group admins');
      console.error('Fetch group admins error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail.trim()) {
      setError('Please enter an email address');
      return;
    }

    try {
      setAddingAdmin(true);
      setError('');
      
      // First, find the user by email
      const userResponse = await axios.get(`/users/search?email=${encodeURIComponent(newAdminEmail.trim())}`);
      const user = userResponse.data.data.user;
      
      if (!user) {
        setError('User not found');
        return;
      }

      // Add the user as group admin
      await axios.post(`/groups/${group._id}/admins`, { userId: user._id });
      
      setNewAdminEmail('');
      await fetchGroupAdmins();
      if (onUpdate) onUpdate();
    } catch (error) {
      if (error.response?.status === 404) {
        setError('User not found. Please check the email address.');
      } else {
        setError(error.response?.data?.message || 'Failed to add group admin');
      }
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleRemoveAdmin = async (userId) => {
    try {
      setRemovingAdmin(userId);
      setError('');
      
      await axios.delete(`/groups/${group._id}/admins/${userId}`);
      
      await fetchGroupAdmins();
      if (onUpdate) onUpdate();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to remove group admin');
    } finally {
      setRemovingAdmin(null);
    }
  };

  const handleClose = () => {
    setNewAdminEmail('');
    setError('');
    setAdmins({ mainAdmin: null, groupAdmins: [] });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AdminPanelSettings color="primary" />
          Manage Group Admins
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Main Admin */}
            <Typography variant="h6" sx={{ mb: 2, mt: 1 }}>
              Main Admin
            </Typography>
            {admins.mainAdmin && (
              <List sx={{ mb: 3 }}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${admins.mainAdmin.firstName} ${admins.mainAdmin.lastName}`}
                    secondary={admins.mainAdmin.email}
                  />
                  <Chip 
                    label="Main Admin" 
                    color="primary" 
                    size="small"
                    variant="outlined"
                  />
                </ListItem>
              </List>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Group Admins */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Group Admins ({admins.groupAdmins?.length || 0})
            </Typography>

            {/* Add New Group Admin */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Add a new group admin (must be a group member):
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter email address"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddAdmin()}
                />
                <Button
                  variant="contained"
                  startIcon={<PersonAdd />}
                  onClick={handleAddAdmin}
                  disabled={addingAdmin || !newAdminEmail.trim()}
                  sx={{ minWidth: 'auto', px: 2 }}
                >
                  {addingAdmin ? <CircularProgress size={20} /> : 'Add'}
                </Button>
              </Box>
            </Box>

            {/* Group Admins List */}
            {admins.groupAdmins && admins.groupAdmins.length > 0 ? (
              <List>
                {admins.groupAdmins.map((admin) => (
                  <ListItem key={admin._id}>
                    <ListItemAvatar>
                      <Avatar>
                        <Person />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${admin.firstName} ${admin.lastName}`}
                      secondary={admin.email}
                    />
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveAdmin(admin._id)}
                      disabled={removingAdmin === admin._id}
                      size="small"
                    >
                      {removingAdmin === admin._id ? (
                        <CircularProgress size={20} />
                      ) : (
                        <Delete />
                      )}
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  No group admins yet. Add some to help manage this group!
                </Typography>
              </Box>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupAdminDialog;
