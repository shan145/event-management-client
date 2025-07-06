import React, { useState } from 'react';
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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Alert,
  Divider,
  TextField,
} from '@mui/material';
import {
  Event,
  LocationOn,
  Schedule,
  People,
  CheckCircle,
  Cancel,
  PersonAdd,
  Delete,
  Visibility,
  Edit,
} from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';

const EventCard = ({ event, onUpdate, onDelete, userRole, currentUserId }) => {
  const [showWaitlistDialog, setShowWaitlistDialog] = useState(false);
  const [showAttendeesDialog, setShowAttendeesDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxAttendees: '',
  });

  const isAdmin = userRole === 'admin';
  const isGoing = event.goingList?.some(user => user._id === currentUserId);
  const isWaitlisted = event.waitlist?.some(user => user._id === currentUserId);
  const isNoGo = event.noGoList?.some(user => user._id === currentUserId);

  const handleJoinWaitlist = async () => {
    try {
      setLoading(true);
      await axios.post(`/events/${event._id}/join`);
      if (onUpdate) onUpdate();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to join waitlist');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      setLoading(true);
      await axios.post(`/events/${event._id}/approve`, { userId });
      if (onUpdate) onUpdate();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to approve user');
    } finally {
      setLoading(false);
    }
  };



  const handleMoveToWaitlist = async (userId) => {
    try {
      setLoading(true);
      await axios.post(`/events/${event._id}/move-to-waitlist`, { userId });
      if (onUpdate) onUpdate();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to move user to waitlist');
    } finally {
      setLoading(false);
    }
  };

  const handleDenyUser = async (userId) => {
    try {
      setLoading(true);
      await axios.post(`/events/${event._id}/nogo`, { userId });
      if (onUpdate) onUpdate();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to deny user');
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToNoGo = async (userId) => {
    try {
      setLoading(true);
      await axios.post(`/events/${event._id}/nogo`, { userId });
      if (onUpdate) onUpdate();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to move user to not going');
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = () => {
    // Format the date for the date input (YYYY-MM-DD) using local timezone
    const eventDate = new Date(event.date);
    const year = eventDate.getFullYear();
    const month = String(eventDate.getMonth() + 1).padStart(2, '0');
    const day = String(eventDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    // Format the time for the time input (HH:MM)
    const formattedTime = event.time || '12:00';
    
    setEditData({
      title: event.title || '',
      description: event.description || '',
      date: formattedDate,
      time: formattedTime,
      location: event.location || '',
      maxAttendees: event.maxAttendees || '',
    });
    setShowEditDialog(true);
  };

  const handleUpdateEvent = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.put(`/events/${event._id}`, {
        ...editData,
        maxAttendees: editData.maxAttendees ? parseInt(editData.maxAttendees) : null,
      });
      
      setShowEditDialog(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`/events/${event._id}`);
        if (onDelete) onDelete(event._id);
      } catch (error) {
        setError('Failed to delete event');
      }
    }
  };

  const getStatusChip = () => {
    if (isGoing) {
      return <Chip label="Going" color="success" size="small" />;
    } else if (isWaitlisted) {
      return <Chip label="Waitlisted" color="warning" size="small" />;
    } else if (isNoGo) {
      return <Chip label="Not Going" color="error" size="small" />;
    } else {
      return <Chip label="No Response" color="default" size="small" variant="outlined" />;
    }
  };

  return (
    <>
      <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: '#fefefe',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
        '&:hover': {
          bgcolor: '#fafafa',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease-in-out'
        }
      }}>
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          {/* Status chip at the top */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            {getStatusChip()}
          </Box>
          
          <Typography variant="h6" component="h3" gutterBottom>
            {event.title}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {event.description}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {dayjs(event.date).format('MMM DD, YYYY h:mm A')}
            </Typography>
          </Box>
          
          {event.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {event.location}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <People sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {event.goingList?.length || 0} going • {event.waitlist?.length || 0} waitlisted
            </Typography>
          </Box>
        </CardContent>
        
        <CardActions sx={{ flexDirection: 'column', alignItems: 'flex-start', p: 3, pt: 0, gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, width: '100%', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {!isGoing && !isWaitlisted && !isNoGo && (
                <Button
                  size="small"
                  startIcon={<PersonAdd />}
                  onClick={handleJoinWaitlist}
                  disabled={loading}
                >
                  Join Waitlist
                </Button>
              )}
              
              {isAdmin && (
                <Button
                  size="small"
                  startIcon={<Visibility />}
                  onClick={() => setShowAttendeesDialog(true)}
                >
                  View Attendees
                </Button>
              )}
            </Box>
            
            {isAdmin && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={handleEditEvent}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={handleDeleteEvent}
                >
                  <Delete />
                </IconButton>
              </Box>
            )}
          </Box>
        </CardActions>
      </Card>

      {/* Attendees Dialog */}
      <Dialog 
        open={showAttendeesDialog} 
        onClose={() => setShowAttendeesDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Event Attendees</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Typography variant="h6" sx={{ mb: 2, color: 'success.main' }}>
            Going ({event.goingList?.length || 0})
          </Typography>
          <List dense>
            {event.goingList?.map((user) => (
              <ListItem key={user._id}>
                <ListItemAvatar>
                  <Avatar>{user?.firstName?.charAt(0) || 'U'}</Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={`${user?.firstName} ${user?.lastName}`}
                  secondary={user?.email}
                />
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={() => handleDenyUser(user._id)}
                  disabled={loading}
                >
                  Deny
                </Button>
              </ListItem>
            ))}
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" sx={{ mb: 2, color: 'warning.main' }}>
            Waitlist ({event.waitlist?.length || 0})
          </Typography>
          <List dense>
            {event.waitlist?.map((user) => (
              <ListItem key={user._id}>
                <ListItemAvatar>
                  <Avatar>{user?.firstName?.charAt(0) || 'U'}</Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={`${user?.firstName} ${user?.lastName}`}
                  secondary={user?.email}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleApproveUser(user._id)}
                    disabled={loading}
                  >
                    Approve
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => handleMoveToNoGo(user._id)}
                    disabled={loading}
                  >
                    Deny
                  </Button>
                </Box>
              </ListItem>
            ))}
          </List>
          
          {event.noGoList?.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, color: 'error.main' }}>
                Not Going ({event.noGoList?.length || 0})
              </Typography>
              <List dense>
                {event.noGoList?.map((user) => (
                  <ListItem key={user._id}>
                    <ListItemAvatar>
                      <Avatar>{user?.firstName?.charAt(0) || 'U'}</Avatar>
                    </ListItemAvatar>
                                    <ListItemText 
                  primary={`${user?.firstName} ${user?.lastName}`}
                  secondary={user?.email}
                />
                    <Button
                      size="small"
                      onClick={() => handleMoveToWaitlist(user._id)}
                      disabled={loading}
                    >
                      Move to Waitlist
                    </Button>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAttendeesDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog 
        open={showEditDialog} 
        onClose={() => setShowEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Event Title"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Date"
            type="date"
            value={editData.date}
            onChange={(e) => setEditData({ ...editData, date: e.target.value })}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Time"
            type="time"
            value={editData.time}
            onChange={(e) => setEditData({ ...editData, time: e.target.value })}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Location"
            value={editData.location}
            onChange={(e) => setEditData({ ...editData, location: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Max Attendees (optional)"
            type="number"
            value={editData.maxAttendees}
            onChange={(e) => setEditData({ ...editData, maxAttendees: e.target.value })}
            margin="normal"
            InputProps={{ inputProps: { min: 1 } }}
            helperText="Leave empty for unlimited attendees"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateEvent} 
            variant="contained"
            disabled={loading || !editData.title || !editData.date || !editData.time}
          >
            {loading ? 'Updating...' : 'Update Event'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EventCard; 