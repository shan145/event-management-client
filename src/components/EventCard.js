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
  Email,
} from '@mui/icons-material';
import EmailDialog from './EmailDialog';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Configure dayjs with timezone support
dayjs.extend(utc);
dayjs.extend(timezone);

const EventCard = ({ event, onUpdate, onDelete, userRole, currentUserId }) => {
  const [showWaitlistDialog, setShowWaitlistDialog] = useState(false);
  const [showAttendeesDialog, setShowAttendeesDialog] = useState(false);
  const [showUserAttendeesDialog, setShowUserAttendeesDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [attendeesList, setAttendeesList] = useState([]);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxAttendees: '',
    guests: '',
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

  const handleNotGoing = async () => {
    try {
      setLoading(true);
      await axios.post(`/events/${event._id}/nogo`, { userId: currentUserId });
      if (onUpdate) onUpdate();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to mark as not going');
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = () => {
    // Format the date for the date input (YYYY-MM-DD) using Eastern Time
    const eventDateET = dayjs(event.date).tz('America/New_York');
    const formattedDate = eventDateET.format('YYYY-MM-DD');
    
    // Format the time for the time input (HH:MM) - use the time from the event in ET
    const formattedTime = event.time || '12:00';
    
    setEditData({
      title: event.title || '',
      description: event.description || '',
      date: formattedDate,
      time: formattedTime,
      location: event.location || '',
      maxAttendees: event.maxAttendees || '',
      guests: event.guests || '',
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
        guests: editData.guests ? parseInt(editData.guests) : 0,
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

  const handleViewAttendees = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`/events/${event._id}/attendees`);
      setAttendeesList(response.data.data.attendees);
      setShowUserAttendeesDialog(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load attendees');
    } finally {
      setLoading(false);
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
        maxWidth: '350px', // Fixed width based on ~50 characters
        minWidth: '350px',
        width: '350px',
        overflow: 'hidden',
        wordBreak: 'break-word',
        '&:hover': {
          bgcolor: '#fafafa',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease-in-out'
        }
      }}>
        <CardContent sx={{ 
          flexGrow: 1, 
          p: 3, 
          overflow: 'hidden', // Prevent horizontal overflow
          wordWrap: 'break-word', // Ensure all text wraps
          minWidth: 0, // Allow content to shrink
          maxWidth: '100%', // Strict width constraint
          width: '100%' // Ensure it takes full width of card
        }}>
          {/* Status chip at the top */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            {getStatusChip()}
          </Box>
          
          <Box sx={{ mb: 1 }}>
            <Typography 
              variant="h6" 
              component="h3" 
              sx={{
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto',
                maxWidth: '100%',
                lineHeight: 1.2
              }}
            >
              {event.title && event.title.length > 50 && !showFullTitle
                ? `${event.title.substring(0, 50)}...`
                : event.title}
            </Typography>
            {event.title && event.title.length > 50 && (
              <Button
                size="small"
                onClick={() => setShowFullTitle(!showFullTitle)}
                sx={{ 
                  p: 0, 
                  mt: 0.5,
                  minWidth: 'auto',
                  textTransform: 'none',
                  fontSize: '0.75rem'
                }}
              >
                {showFullTitle ? 'Show Less' : 'Show More'}
              </Button>
            )}
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto',
                lineHeight: 1.5,
                maxWidth: '100%',
                whiteSpace: 'pre-line' // Preserve line breaks
              }}
            >
              {event.description && event.description.length > 50 && !showFullDescription
                ? `${event.description.substring(0, 50)}...`
                : event.description}
            </Typography>
            {event.description && event.description.length > 50 && (
              <Button
                size="small"
                onClick={() => setShowFullDescription(!showFullDescription)}
                sx={{ 
                  p: 0, 
                  mt: 0.5,
                  minWidth: 'auto',
                  textTransform: 'none',
                  fontSize: '0.75rem'
                }}
              >
                {showFullDescription ? 'Show Less' : 'Show More'}
              </Button>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {dayjs(event.date).tz('America/New_York').format('MMM DD, YYYY h:mm A')} ET
            </Typography>
          </Box>
          
          {event.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <LocationOn sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  maxWidth: '100%'
                }}
              >
                {event.location}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <People sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {(event.goingList?.length || 0) + (event.guests || 0)} total 
              ({event.goingList?.length || 0} going{event.guests ? ` + ${event.guests} guests` : ''}) • {event.waitlist?.length || 0} waitlisted
            </Typography>
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
          {/* User Response Actions Row */}
          <Box sx={{ 
            display: 'flex', 
            width: '100%', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            margin: 0,
            padding: 0
          }}>
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              flexWrap: 'wrap',
              margin: 0,
              padding: 0
            }}>
              {/* Join Waitlist button - available for users who haven't responded or are marked as not going */}
              {(!isGoing && !isWaitlisted) && (
                <Button
                  size="small"
                  startIcon={<PersonAdd />}
                  onClick={handleJoinWaitlist}
                  disabled={loading}
                  sx={{ 
                    margin: 0,
                    padding: '6px 16px',
                    minWidth: 0
                  }}
                >
                  Join Waitlist
                </Button>
              )}
              
              {/* Not Going button - available for everyone except those already marked as not going */}
              {!isNoGo && (
                <Button
                  size="small"
                  startIcon={<Cancel />}
                  onClick={handleNotGoing}
                  disabled={loading}
                  color="error"
                  sx={{ 
                    margin: 0,
                    padding: '6px 16px',
                    minWidth: 0
                  }}
                >
                  Not Going
                </Button>
              )}
            </Box>
            
            {isAdmin && (
              <Box sx={{ 
                display: 'flex', 
                gap: 1,
                margin: 0,
                padding: 0
              }}>
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
          
          {/* Admin Actions Row */}
          {isAdmin && (
            <Box sx={{ 
              display: 'flex', 
              width: '100%', 
              justifyContent: 'flex-start', 
              alignItems: 'center',
              gap: 1,
              margin: 0,
              padding: 0
            }}>
              <Button
                size="small"
                startIcon={<Visibility />}
                onClick={() => setShowAttendeesDialog(true)}
                sx={{ 
                  margin: 0,
                  padding: '6px 16px',
                  minWidth: 0
                }}
              >
                View Attendees
              </Button>
              <Button
                size="small"
                startIcon={<Email />}
                onClick={() => setShowEmailDialog(true)}
                sx={{ 
                  margin: 0,
                  padding: '6px 16px',
                  minWidth: 0
                }}
                disabled={(event.goingList?.length || 0) === 0}
              >
                Send Email
              </Button>
            </Box>
          )}

          {/* Non-admin Attendee Actions Row */}
          {!isAdmin && isGoing && (
            <Box sx={{ 
              display: 'flex', 
              width: '100%', 
              justifyContent: 'flex-start', 
              alignItems: 'center',
              gap: 1,
              margin: 0,
              padding: 0
            }}>
              <Button
                size="small"
                startIcon={<Visibility />}
                onClick={handleViewAttendees}
                disabled={loading}
                sx={{ 
                  margin: 0,
                  padding: '6px 16px',
                  minWidth: 0
                }}
              >
                View Attendees
              </Button>
            </Box>
          )}
        </CardActions>
      </Card>

      {/* Attendees Dialog */}
      <Dialog 
        open={showAttendeesDialog} 
        onClose={() => setShowAttendeesDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Event Attendees 
          {event.guests > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Total: {(event.goingList?.length || 0) + (event.guests || 0)} attendees 
              ({event.goingList?.length || 0} users + {event.guests} guests)
            </Typography>
          )}
        </DialogTitle>
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
              <ListItem key={user._id} sx={{ flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' } }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  width: { xs: '100%', sm: 'auto' },
                  flexGrow: 1
                }}>
                  <ListItemAvatar>
                    <Avatar>{user?.firstName?.charAt(0) || 'U'}</Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={`${user?.firstName} ${user?.lastName}`}
                    secondary={user?.email}
                  />
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                  mt: { xs: 1, sm: 0 },
                  ml: { xs: 7, sm: 0 }
                }}>
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => handleDenyUser(user._id)}
                    disabled={loading}
                  >
                    Deny
                  </Button>
                </Box>
              </ListItem>
            ))}
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" sx={{ mb: 2, color: 'warning.main' }}>
            Waitlist ({event.waitlist?.length || 0})
          </Typography>
          <List dense>
            {event.waitlist?.map((user) => (
              <ListItem key={user._id} sx={{ flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' } }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  width: { xs: '100%', sm: 'auto' },
                  flexGrow: 1
                }}>
                  <ListItemAvatar>
                    <Avatar>{user?.firstName?.charAt(0) || 'U'}</Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={`${user?.firstName} ${user?.lastName}`}
                    secondary={user?.email}
                  />
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1,
                  justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                  mt: { xs: 1, sm: 0 },
                  ml: { xs: 7, sm: 0 }
                }}>
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
                  <ListItem key={user._id} sx={{ flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' } }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      width: { xs: '100%', sm: 'auto' },
                      flexGrow: 1
                    }}>
                      <ListItemAvatar>
                        <Avatar>{user?.firstName?.charAt(0) || 'U'}</Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={`${user?.firstName} ${user?.lastName}`}
                        secondary={user?.email}
                      />
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                      mt: { xs: 1, sm: 0 },
                      ml: { xs: 7, sm: 0 }
                    }}>
                      <Button
                        size="small"
                        onClick={() => handleMoveToWaitlist(user._id)}
                        disabled={loading}
                      >
                        Move to Waitlist
                      </Button>
                    </Box>
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
          <TextField
            fullWidth
            label="Number of Guests (optional)"
            type="number"
            value={editData.guests}
            onChange={(e) => setEditData({ ...editData, guests: e.target.value })}
            margin="normal"
            InputProps={{ inputProps: { min: 0 } }}
            helperText="Additional attendees not on the user list (default: 0)"
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

      {/* Email Dialog */}
      <EmailDialog
        open={showEmailDialog}
        onClose={() => setShowEmailDialog(false)}
        event={event}
        onSuccess={() => {
          // Optional: You can add success handling here
          console.log('Email sent successfully');
        }}
      />

      {/* User Attendees Dialog (Non-admin view) */}
      <Dialog 
        open={showUserAttendeesDialog} 
        onClose={() => setShowUserAttendeesDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Who's Going
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {event.title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Typography variant="h6" sx={{ mb: 2, color: 'success.main' }}>
            Confirmed Attendees ({attendeesList.length})
          </Typography>
          
          {attendeesList.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No confirmed attendees yet.
            </Typography>
          ) : (
                         <List dense>
               {attendeesList.map((user) => (
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
          <Button onClick={() => setShowUserAttendeesDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EventCard; 