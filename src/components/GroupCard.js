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
  TextField,
  Alert,
  FormControlLabel,
  Checkbox,
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
} from '@mui/icons-material';
import GroupEmailDialog from './GroupEmailDialog';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Configure dayjs with timezone support
dayjs.extend(utc);
dayjs.extend(timezone);

const GroupCard = ({ group, onUpdate, onDelete, isAdmin, userRole }) => {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showFullName, setShowFullName] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    guests: '',
    notifyGroup: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateInvite = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`/groups/${group._id}/invite`);
      // Update the group with the new invite token
      group.inviteToken = response.data.data.inviteToken;
      setShowInviteDialog(true);
    } catch (error) {
      setError('Failed to generate invite link');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post(`/groups/${group._id}/events`, {
        ...eventData,
      });
      
      setShowEventDialog(false);
      setEventData({ title: '', description: '', date: '', time: '', location: '', guests: '', notifyGroup: false });
      if (onUpdate) onUpdate();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        await axios.delete(`/groups/${group._id}`);
        if (onDelete) onDelete(group._id);
      } catch (error) {
        setError('Failed to delete group');
      }
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
          
          {group.description && (
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
                {group.description.length > 60 && !showFullDescription
                  ? `${group.description.substring(0, 60)}...`
                  : group.description}
              </Typography>
              {group.description.length > 60 && (
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
          </Box>
        </CardContent>
        
        <CardActions sx={{ 
          flexDirection: 'column',
          alignItems: 'stretch',
          p: 3, 
          pt: 0, 
          gap: 1
        }}>
          {isAdmin && (
            <>
              <Button
                size="small"
                startIcon={<Add />}
                onClick={() => setShowEventDialog(true)}
                sx={{ alignSelf: 'flex-start' }}
              >
                Add Event
              </Button>
              <Button
                size="small"
                startIcon={<Share />}
                onClick={handleGenerateInvite}
                disabled={loading}
                sx={{ alignSelf: 'flex-start' }}
              >
                Invite
              </Button>
              <Button
                size="small"
                startIcon={<Email />}
                onClick={() => setShowEmailDialog(true)}
                disabled={!group.members || group.members.length === 0}
                sx={{ alignSelf: 'flex-start' }}
              >
                Send Message
              </Button>
            </>
          )}
          
          {userRole === 'admin' && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              width: '100%'
            }}>
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
          />
          <TextField
            fullWidth
            label="Date"
            type="date"
            value={eventData.date}
            onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Time"
            type="time"
            value={eventData.time}
            onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Location"
            value={eventData.location}
            onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
            margin="normal"
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
    </>
  );
};

export default GroupCard; 