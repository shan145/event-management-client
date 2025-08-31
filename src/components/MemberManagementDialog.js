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
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import {
  Person,
  Delete,
  PersonAdd,
  Group,
  AdminPanelSettings
} from '@mui/icons-material';
import axios from 'axios';

const MemberManagementDialog = ({ open, onClose, group, onUpdate }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [addingMember, setAddingMember] = useState(false);
  const [removingMember, setRemovingMember] = useState(null);

  useEffect(() => {
    if (open && group) {
      fetchMembers();
    }
  }, [open, group]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`/groups/${group._id}/members`);
      setMembers(response.data.data.members || []);
    } catch (error) {
      setError('Failed to fetch group members');
      console.error('Fetch members error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) {
      setError('Please enter an email address');
      return;
    }

    try {
      setAddingMember(true);
      setError('');
      
      await axios.post(`/groups/${group._id}/members`, { 
        email: newMemberEmail.trim() 
      });
      
      setNewMemberEmail('');
      await fetchMembers();
      if (onUpdate) onUpdate();
    } catch (error) {
      if (error.response?.status === 404) {
        setError('User not found. Please check the email address.');
      } else if (error.response?.status === 400) {
        setError(error.response.data.message);
      } else {
        setError(error.response?.data?.message || 'Failed to add member');
      }
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      setRemovingMember(userId);
      setError('');
      
      await axios.delete(`/groups/${group._id}/members/${userId}`);
      
      await fetchMembers();
      if (onUpdate) onUpdate();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to remove member');
    } finally {
      setRemovingMember(null);
    }
  };

  const handleClose = () => {
    setNewMemberEmail('');
    setError('');
    setMembers([]);
    setActiveTab(0);
    onClose();
  };

  const isMainAdmin = (userId) => {
    return group.adminId === userId;
  };

  const isGroupAdmin = (userId) => {
    return group.groupAdmins && group.groupAdmins.includes(userId);
  };

  const getMemberRole = (userId) => {
    if (isMainAdmin(userId)) return 'Main Admin';
    if (isGroupAdmin(userId)) return 'Group Admin';
    return 'Member';
  };

  const getMemberRoleColor = (userId) => {
    if (isMainAdmin(userId)) return 'primary';
    if (isGroupAdmin(userId)) return 'secondary';
    return 'default';
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Group color="primary" />
          Manage Group Members
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
          <Tab label="Current Members" />
          <Tab label="Add Member" />
        </Tabs>

        {activeTab === 0 && (
          <>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Members ({members.length})
                </Typography>

                {members.length > 0 ? (
                  <List>
                    {members.map((member) => (
                      <ListItem key={member._id}>
                        <ListItemAvatar>
                          <Avatar>
                            <Person />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${member.firstName} ${member.lastName}`}
                          secondary={member.email}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            label={getMemberRole(member._id)}
                            color={getMemberRoleColor(member._id)}
                            size="small"
                            variant="outlined"
                          />
                          {!isMainAdmin(member._id) && (
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveMember(member._id)}
                              disabled={removingMember === member._id}
                              size="small"
                            >
                              {removingMember === member._id ? (
                                <CircularProgress size={20} />
                              ) : (
                                <Delete />
                              )}
                            </IconButton>
                          )}
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      No members found in this group.
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Add New Member
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter the email address of an existing user to add them to this group:
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter email address"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
              />
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={handleAddMember}
                disabled={addingMember || !newMemberEmail.trim()}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                {addingMember ? <CircularProgress size={20} /> : 'Add'}
              </Button>
            </Box>

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Note:</strong> The user must already have an account in the system. 
                If they don't have an account, they can join using the invite link instead.
              </Typography>
            </Alert>
          </Box>
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

export default MemberManagementDialog;

