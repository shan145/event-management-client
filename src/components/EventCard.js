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
  const [showNotGoingConfirmDialog, setShowNotGoingConfirmDialog] = useState(false);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
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
  
  // Check group membership with comprehensive fallback logic
  const isGroupMemberFromPopulation = event.groupId?.members?.some(member => member && member._id === currentUserId);
  const isGroupMemberFromResponse = isGoing || isWaitlisted || isNoGo; // If user has responded, they must be a member
  const isGroupMemberFromAccess = !!event.groupId; // If user can see the event, they must be a group member (events are group-specific)
  const isGroupMember = isGroupMemberFromPopulation || isGroupMemberFromResponse || isGroupMemberFromAccess;
  
  // Debug logging
  console.log('Event data:', {
    eventId: event._id,
    currentUserId,
    groupId: event.groupId?._id,
    groupMembers: event.groupId?.members?.map(m => m?._id || 'null'),
    isGroupMemberFromPopulation,
    isGroupMemberFromResponse,
    isGroupMemberFromAccess,
    isGroupMember,
    isAdmin,
    isGoing
  });

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

  const handleNotGoingClick = () => {
    setShowNotGoingConfirmDialog(true);
  };

  const handleNotGoing = async () => {
    try {
      setLoading(true);
      setShowNotGoingConfirmDialog(false);
      await axios.post(`/events/${event._id}/nogo`, { userId: currentUserId });
      if (onUpdate) onUpdate();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to mark as not going');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelNotGoing = () => {
    setShowNotGoingConfirmDialog(false);
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

  const handleDeleteEvent = () => {
    setShowDeleteConfirmDialog(true);
  };

  const confirmDeleteEvent = async () => {
    try {
      setLoading(true);
      setError('');
      await axios.delete(`/events/${event._id}`);
      
              // Immediately update parent state
        if (onDelete) {
          onDelete(event._id);
        }
        
        // Also trigger onUpdate as backup
        if (onUpdate) {
          onUpdate();
        }
      
      setShowDeleteConfirmDialog(false);
    } catch (error) {
      console.error('Delete event error:', error);
      setError(error.response?.data?.message || 'Failed to delete event');
    } finally {
      setLoading(false);
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
      return <Chip label="Going" color="success" size="small" sx={{ fontWeight: 500 }} />;
    } else if (isWaitlisted) {
      return <Chip label="Waitlisted" color="warning" size="small" sx={{ fontWeight: 500 }} />;
    } else if (isNoGo) {
      return <Chip label="Not Going" color="error" size="small" sx={{ fontWeight: 500 }} />;
    } else {
      return <Chip label="No Response" color="default" size="small" variant="outlined" sx={{ fontWeight: 500 }} />;
    }
  };

  return (
    <>
      <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        border: '1px solid #e1e1e1',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        maxWidth: '350px',
        minWidth: '350px',
        width: '350px',
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
          {/* Status chip at the top */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            {getStatusChip()}
          </Box>
          
          <Box sx={{ mb: 2 }}>
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
              {event.title && event.title.length > 45 && !showFullTitle
                ? `${event.title.substring(0, 45)}...`
                : event.title}
            </Typography>
            {event.title && event.title.length > 45 && (
              <Button
                size="small"
                onClick={() => setShowFullTitle(!showFullTitle)}
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
                {showFullTitle ? 'Show less' : 'Show more'}
              </Button>
            )}
          </Box>
          
          {event.description && (
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  lineHeight: 1.5,
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  maxWidth: '100%',
                  whiteSpace: 'pre-line'
                }}
              >
                {event.description.length > 80 && !showFullDescription
                  ? `${event.description.substring(0, 80)}...`
                  : event.description}
              </Typography>
              {event.description.length > 80 && (
                <Button
                  size="small"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  sx={{ 
                    p: 0,
                    mt: 0.5,
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
                  {showFullDescription ? 'Show less' : 'Show more'}
                </Button>
              )}
            </Box>
          )}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Schedule sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {dayjs(event.date).tz('America/New_York').format('MMM DD, YYYY h:mm A')} ET
              </Typography>
            </Box>
            
            {event.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LocationOn sx={{ fontSize: 18, color: 'text.secondary', flexShrink: 0 }} />
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    fontWeight: 500,
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    maxWidth: '100%'
                  }}
                >
                  {event.location}
                </Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <People sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {(event.goingList?.length || 0) + (event.guests || 0)}
                {event.maxAttendees ? ` / ${event.maxAttendees}` : ''} total 
                ({event.goingList?.length || 0} going{event.guests ? ` + ${event.guests} guests` : ''}) • {event.waitlist?.length || 0} waitlisted
              </Typography>
            </Box>
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
          {/* User Response Actions */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            width: '100%', 
            alignItems: 'flex-start',
            gap: 1,
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
                onClick={handleNotGoingClick}
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
            
            {/* Admin Actions */}
            {isAdmin && (
              <>
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
              </>
            )}

            {/* Non-admin Group Member Actions */}
            {!isAdmin && isGroupMember && (
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
            )}
          </Box>
          
          {/* Admin Edit/Delete Actions */}
          {isAdmin && (
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
                onClick={handleEditEvent}
              >
                <Edit />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={handleDeleteEvent}
                disabled={loading}
              >
                <Delete />
              </IconButton>
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

      {/* Not Going Confirmation Dialog */}
      <Dialog 
        open={showNotGoingConfirmDialog} 
        onClose={handleCancelNotGoing}
        maxWidth="sm"
      >
        <DialogTitle>
          Confirm Not Going
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to mark yourself as not going to this event?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelNotGoing}>
            Cancel
          </Button>
          <Button 
            onClick={handleNotGoing}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Yes, Not Going'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Event Confirmation Dialog */}
      <Dialog 
        open={showDeleteConfirmDialog} 
        onClose={() => setShowDeleteConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: 'error.main' }}>
          Delete Event
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete "{event.title}"?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone. All attendee information and event data will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowDeleteConfirmDialog(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDeleteEvent}
            color="error"
            variant="contained"
            disabled={loading}
            startIcon={loading ? null : <Delete />}
          >
            {loading ? 'Deleting...' : 'Delete Event'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EventCard; 