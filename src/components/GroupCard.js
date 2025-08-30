import React, { useState, useEffect, useContext } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider
} from '@mui/material';
import {
  Group,
  Event,
  People,
  Delete,
  Edit,
  Share,
  Add,
  Email,
  Visibility,
  ExitToApp,
  LocationOn
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import GroupEmailDialog from './GroupEmailDialog';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Enhanced Location Picker component
const LocationPicker = ({ value, onChange, placeholder = "Enter location name..." }) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange({ name: newValue, url: '' });
  };

  const handlePickFromMaps = () => {
    if (inputValue.trim()) {
      const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(inputValue.trim())}`;
      onChange({ name: inputValue.trim(), url: googleMapsUrl });
      
      // Open Google Maps in a new tab
      window.open(googleMapsUrl, '_blank');
    }
  };

  const handleOpenMapsPicker = () => {
    // Open Google Maps location picker
    const mapsUrl = 'https://www.google.com/maps';
    window.open(mapsUrl, '_blank');
  };

  return (
    <Box>
      <TextField
        fullWidth
        label="Location"
        value={inputValue}
        onChange={handleInputChange}
        margin="normal"
        placeholder={placeholder}
        InputProps={{
          startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
        }}
      />
      
      <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={handlePickFromMaps}
          disabled={!inputValue.trim()}
          startIcon={<LocationOn />}
        >
          Open in Maps
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={handleOpenMapsPicker}
          startIcon={<LocationOn />}
        >
          Pick Location
        </Button>
      </Box>
    </Box>
  );
};

// Configure dayjs with timezone support
dayjs.extend(utc);
dayjs.extend(timezone);

const GroupCard = ({ group, onUpdate, onDelete, isAdmin, userRole }) => {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editData, setEditData] = useState({ name: '', tags: [] });
  const [editTagInput, setEditTagInput] = useState('');
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [showLeaveGroupDialog, setShowLeaveGroupDialog] = useState(false);
  const [showDeleteGroupDialog, setShowDeleteGroupDialog] = useState(false);
  const [showFullName, setShowFullName] = useState(false);
  const [membersList, setMembersList] = useState([]);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: null,
    time: null,
    location: { name: '', url: '' },
    maxAttendees: '',
    guests: '',
    notifyGroup: false,
  });
  const [loading, setLoading] = useState(false);
  const [membersLoading, setMembersLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [error, setError] = useState('');

  // Helper function to truncate text while respecting newlines
  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    
    // Find the first newline within the maxLength
    const truncated = text.substring(0, maxLength);
    const lastNewline = truncated.lastIndexOf('\n');
    
    if (lastNewline > 0) {
      return truncated.substring(0, lastNewline) + '...';
    }
    
    return truncated + '...';
  };

  const handleGenerateInvite = async () => {
    try {
      setInviteLoading(true);
      const response = await axios.post(`/groups/${group._id}/invite`);
      // Update the group with the new invite token
      group.inviteToken = response.data.data.inviteToken;
      setShowInviteDialog(true);
    } catch (error) {
      setError('Failed to generate invite link');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Format the date and time for the server
      const formattedDate = eventData.date ? eventData.date.format('YYYY-MM-DD') : '';
      const formattedTime = eventData.time ? eventData.time.format('HH:mm') : '';
      
      const response = await axios.post(`/groups/${group._id}/events`, {
        ...eventData,
        date: formattedDate,
        time: formattedTime,
        location: eventData.location.name,
        locationUrl: eventData.location.url,
        maxAttendees: eventData.maxAttendees ? parseInt(eventData.maxAttendees) : null,
      });
      
      setShowEventDialog(false);
      setEventData({ title: '', description: '', date: null, time: null, location: { name: '', url: '' }, maxAttendees: '', guests: '', notifyGroup: false });
      if (onUpdate) onUpdate();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleEditGroup = () => {
    setEditData({ 
      name: group.name, 
      tags: group.tags || [] 
    });
    setEditTagInput('');
    setShowEditDialog(true);
  };

  const handleUpdateGroup = async () => {
    try {
      setError('');
      setLoading(true);
      const response = await axios.put(`/groups/${group._id}`, editData);
      if (onUpdate) onUpdate();
      setShowEditDialog(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update group');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEditTag = () => {
    if (editTagInput.trim() && !editData.tags.includes(editTagInput.trim())) {
      setEditData({
        ...editData,
        tags: [...editData.tags, editTagInput.trim()]
      });
      setEditTagInput('');
    }
  };

  const handleRemoveEditTag = (tagToRemove) => {
    setEditData({
      ...editData,
      tags: editData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleEditTagInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEditTag();
    }
  };

  const handleDeleteGroup = () => {
    setShowDeleteGroupDialog(true);
  };

  const confirmDeleteGroup = async () => {
    try {
      setLoading(true);
      setError('');
      await axios.delete(`/groups/${group._id}`);
      if (onDelete) onDelete(group._id);
      setShowDeleteGroupDialog(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete group');
    } finally {
      setLoading(false);
    }
  };

  const handleViewMembers = async () => {
    try {
      setMembersLoading(true);
      setError('');
      const response = await axios.get(`/groups/${group._id}/members`);
      setMembersList(response.data.data.members);
      setShowMembersDialog(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load members');
    } finally {
      setMembersLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      setLeaveLoading(true);
      await axios.post(`/groups/${group._id}/leave`);
      setShowLeaveGroupDialog(false);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to leave group');
    } finally {
      setLeaveLoading(false);
    }
  };

  const copyInviteLink = () => {
    const inviteLink = `${window.location.origin}/join/${group.inviteToken}`;
    console.log('Generated invite link:', inviteLink);
    console.log('Group invite token:', group.inviteToken);
    navigator.clipboard.writeText(inviteLink);
    setShowInviteDialog(false);
  };

  return (
    <>
      <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        border: '1px solid #e1e1e1',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        maxWidth: '320px',
        minWidth: '320px',
        width: '320px',
        overflow: 'hidden',
        wordBreak: 'break-word',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}>
        <CardContent sx={{ 
          flexGrow: 1, 
          p: 3,
          overflow: 'hidden',
          wordWrap: 'break-word',
          minWidth: 0,
          maxWidth: '100%',
          width: '100%'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flexGrow: 1, mr: 1 }}>
              <Typography 
                variant="h6" 
                component="h3" 
                sx={{
                  fontWeight: 600,
                  fontSize: '1.125rem',
                  lineHeight: 1.4,
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  maxWidth: '100%',
                  mb: 1
                }}
              >
                {group.name && group.name.length > 35 && !showFullName
                  ? `${group.name.substring(0, 35)}...`
                  : group.name}
              </Typography>
              {group.name && group.name.length > 35 && (
                <Button
                  size="small"
                  onClick={() => setShowFullName(!showFullName)}
                  sx={{ 
                    p: 0,
                    minWidth: 'auto',
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: 'primary.main'
                    }
                  }}
                >
                  {showFullName ? 'Show less' : 'Show more'}
                </Button>
              )}
            </Box>
            {isAdmin && (
              <Chip 
                label="Admin" 
                size="small" 
                color="primary" 
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            )}
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <People sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {group.members?.length || 0} members
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Event sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {group.eventCount || 0} events
              </Typography>
            </Box>

            {/* Tags */}
            {group.tags && group.tags.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {group.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontSize: '0.75rem' }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </CardContent>
        
        <CardActions sx={{ 
          flexDirection: 'column', 
          alignItems: 'stretch', 
          p: 3, 
          pt: 0, 
          gap: 1,
          '& .MuiBox-root': {
            margin: 0,
            padding: 0
          }
        }}>
          {/* User Actions */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            width: '100%', 
            alignItems: 'flex-start',
            gap: 1,
            margin: 0,
            padding: 0
          }}>
            {/* Member Actions - Available to all group members */}
            <Button
              size="small"
              startIcon={<Visibility />}
              onClick={handleViewMembers}
              disabled={membersLoading}
              sx={{ 
                margin: 0,
                padding: '6px 16px',
                minWidth: 0
              }}
            >
              View Members
            </Button>

            {/* Leave Group - Available to non-admin members */}
            {!isAdmin && (
              <Button
                size="small"
                startIcon={<ExitToApp />}
                onClick={() => setShowLeaveGroupDialog(true)}
                disabled={leaveLoading}
                sx={{ 
                  margin: 0,
                  padding: '6px 16px',
                  minWidth: 0,
                  color: 'error.main',
                  '&:hover': {
                    backgroundColor: 'error.light',
                    color: 'error.contrastText'
                  }
                }}
              >
                Leave Group
              </Button>
            )}

            {isAdmin && (
              <>
                <Button
                  size="small"
                  startIcon={<Add />}
                  onClick={() => setShowEventDialog(true)}
                  sx={{ 
                    margin: 0,
                    padding: '6px 16px',
                    minWidth: 0
                  }}
                >
                  Add Event
                </Button>
                <Button
                  size="small"
                  startIcon={<Share />}
                  onClick={handleGenerateInvite}
                  disabled={inviteLoading}
                  sx={{ 
                    margin: 0,
                    padding: '6px 16px',
                    minWidth: 0
                  }}
                >
                  Invite
                </Button>
                <Button
                  size="small"
                  startIcon={<Email />}
                  onClick={() => setShowEmailDialog(true)}
                  disabled={!group.members || group.members.length === 0}
                  sx={{ 
                    margin: 0,
                    padding: '6px 16px',
                    minWidth: 0
                  }}
                >
                  Send Message
                </Button>
              </>
            )}
          </Box>
          
          {/* Admin Delete Actions */}
          {userRole === 'admin' && (
            <Box sx={{ 
              display: 'flex', 
              width: '100%',
              justifyContent: 'flex-end',
              gap: 1,
              margin: 0,
              padding: 0
            }}>
              <IconButton
                size="small"
                color="primary"
                onClick={handleEditGroup}
              >
                <Edit />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={handleDeleteGroup}
              >
                <Delete />
              </IconButton>
            </Box>
          )}
        </CardActions>
      </Card>

      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onClose={() => setShowInviteDialog(false)}>
        <DialogTitle>Invite Link</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Share this link with people you want to invite to "{group.name}":
          </Typography>
          <TextField
            fullWidth
            value={`${window.location.origin}/join/${group.inviteToken}`}
            variant="outlined"
            size="small"
            InputProps={{ readOnly: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInviteDialog(false)}>Cancel</Button>
          <Button onClick={copyInviteLink} variant="contained">
            Copy Link
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Event Dialog */}
      <Dialog 
        open={showEventDialog} 
        onClose={() => setShowEventDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Event Title"
            value={eventData.title}
            onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={eventData.description}
            onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
            placeholder="Enter event description... (press Enter for new lines)"
            helperText="Use Enter key to create new lines in your description"
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
              value={eventData.date}
              onChange={(newValue) => setEventData({ ...eventData, date: newValue })}
              slotProps={{ 
                textField: { 
                  fullWidth: true, 
                  margin: 'normal',
                  required: true,
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    }
                  }
                } 
              }}
              sx={{ width: '100%' }}
            />
            <TimePicker
              label="Time"
              value={eventData.time}
              onChange={(newValue) => setEventData({ ...eventData, time: newValue })}
              slotProps={{ 
                textField: { 
                  fullWidth: true, 
                  margin: 'normal',
                  required: true,
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    }
                  }
                } 
              }}
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>
          <LocationPicker
            value={eventData.location.name}
            onChange={(locationData) => setEventData({ ...eventData, location: locationData })}
            placeholder="Search for a location..."
          />
          {eventData.location.url && (
            <Box sx={{ mt: 1, p: 1, bgcolor: 'success.light', borderRadius: 1 }}>
              <Typography variant="body2" color="success.contrastText">
                ✅ Location selected: {eventData.location.name}
              </Typography>
              <Typography variant="caption" color="success.contrastText">
                Google Maps link will be automatically generated
              </Typography>
            </Box>
          )}
          
          <TextField
            fullWidth
            label="Max Attendees (optional)"
            type="number"
            value={eventData.maxAttendees}
            onChange={(e) => setEventData({ ...eventData, maxAttendees: e.target.value })}
            margin="normal"
            InputProps={{ inputProps: { min: 1 } }}
            helperText="Leave empty for unlimited attendees"
          />
          
          <TextField
            fullWidth
            label="Number of Guests (optional)"
            type="number"
            value={eventData.guests}
            onChange={(e) => setEventData({ ...eventData, guests: e.target.value })}
            margin="normal"
            InputProps={{ inputProps: { min: 0 } }}
            helperText="Additional attendees not on the user list (default: 0)"
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={eventData.notifyGroup}
                onChange={(e) => setEventData({ ...eventData, notifyGroup: e.target.checked })}
                color="primary"
              />
            }
            label="📧 Notify all group members about this event"
            sx={{ mt: 2, mb: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEventDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateEvent} 
            variant="contained"
            disabled={loading || !eventData.title || !eventData.date || !eventData.time}
          >
            {loading ? 'Creating...' : 'Create Event'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Group Email Dialog */}
      <GroupEmailDialog
        open={showEmailDialog}
        onClose={() => setShowEmailDialog(false)}
        group={group}
        onSuccess={() => {
          console.log('Group email sent successfully');
        }}
      />

      {/* Group Members Dialog */}
      <Dialog 
        open={showMembersDialog} 
        onClose={() => setShowMembersDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Group Members
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {group.name}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Members ({membersList.length})
          </Typography>
          
          {membersList.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No members found.
            </Typography>
          ) : (
            <List dense>
              {membersList.map((user) => (
                <ListItem key={user._id}>
                  <ListItemAvatar>
                    <Avatar>{user?.firstName?.charAt(0) || 'U'}</Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={`${user?.firstName} ${user?.lastName}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMembersDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Leave Group Confirmation Dialog */}
      <Dialog 
        open={showLeaveGroupDialog} 
        onClose={() => setShowLeaveGroupDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Leave Group
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to leave "{group.name}"?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone. You will be removed from:
          </Typography>
          <Typography variant="body2" color="text.secondary" component="ul" sx={{ mt: 1, pl: 2 }}>
            <li>The group's member list</li>
            <li>All events in this group (going, waitlist, not going)</li>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            You will need a new invitation to rejoin this group.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowLeaveGroupDialog(false)}
            disabled={leaveLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleLeaveGroup}
            variant="contained"
            color="error"
            disabled={leaveLoading}
          >
            {leaveLoading ? 'Leaving...' : 'Leave Group'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Group Confirmation Dialog */}
      <Dialog 
        open={showDeleteGroupDialog} 
        onClose={() => setShowDeleteGroupDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: 'error.main' }}>
          Delete Group
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete "{group.name}"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This action cannot be undone. This will permanently delete:
          </Typography>
          <Typography variant="body2" color="text.secondary" component="ul" sx={{ mt: 1, pl: 2 }}>
            <li>The group and all its data</li>
            <li>All events created in this group</li>
            <li>All member associations with this group</li>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowDeleteGroupDialog(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDeleteGroup}
            color="error"
            variant="contained"
            disabled={loading}
            startIcon={loading ? null : <Delete />}
          >
            {loading ? 'Deleting...' : 'Delete Group'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Group Dialog */}
      <Dialog 
        open={showEditDialog} 
        onClose={() => setShowEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Group</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Group Name"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            margin="normal"
            required
          />
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {editData.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveEditTag(tag)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="Add Tag"
                value={editTagInput}
                onChange={(e) => setEditTagInput(e.target.value)}
                onKeyPress={handleEditTagInputKeyPress}
                placeholder="Type tag and press Enter"
                size="small"
              />
              <Button
                variant="outlined"
                onClick={handleAddEditTag}
                disabled={!editTagInput.trim() || editData.tags.includes(editTagInput.trim())}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                Add
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateGroup} 
            variant="contained"
            disabled={!editData.name || loading}
          >
            {loading ? 'Updating...' : 'Update Group'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GroupCard; 