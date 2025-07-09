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
} from '@mui/material';
import {
  Group,
  Event,
  People,
  Delete,
  Edit,
  Share,
  Add,
} from '@mui/icons-material';
import axios from 'axios';

const GroupCard = ({ group, onUpdate, onDelete, isAdmin, userRole }) => {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showFullName, setShowFullName] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
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
      setEventData({ title: '', description: '', date: '', time: '', location: '' });
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
        bgcolor: '#fefefe',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
        maxWidth: '320px', // Fixed width based on ~40 characters
        minWidth: '320px',
        width: '320px',
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
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto',
                  maxWidth: '100%',
                  lineHeight: 1.2
                }}
              >
                {group.name && group.name.length > 40 && !showFullName
                  ? `${group.name.substring(0, 40)}...`
                  : group.name}
              </Typography>
              {group.name && group.name.length > 40 && (
                <Button
                  size="small"
                  onClick={() => setShowFullName(!showFullName)}
                  sx={{ 
                    p: 0, 
                    mt: 0.5,
                    minWidth: 'auto',
                    textTransform: 'none',
                    fontSize: '0.75rem'
                  }}
                >
                  {showFullName ? 'Show Less' : 'Show More'}
                </Button>
              )}
            </Box>
            {isAdmin && (
              <Chip 
                label="Admin" 
                size="small" 
                color="primary" 
                variant="outlined" 
              />
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
                whiteSpace: 'pre-line'
              }}
            >
              {group.description && group.description.length > 40 && !showFullDescription
                ? `${group.description.substring(0, 40)}...`
                : group.description}
            </Typography>
            {group.description && group.description.length > 40 && (
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
            <People sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {group.members?.length || 0} members
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Event sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {group.eventCount || 0} events
            </Typography>
          </Box>
        </CardContent>
        
        <CardActions sx={{ justifyContent: 'space-between', p: 3, pt: 0 }}>
          <Box>
            {isAdmin && (
              <>
                <Button
                  size="small"
                  startIcon={<Add />}
                  onClick={() => setShowEventDialog(true)}
                >
                  Add Event
                </Button>
                <Button
                  size="small"
                  startIcon={<Share />}
                  onClick={handleGenerateInvite}
                  disabled={loading}
                >
                  Invite
                </Button>
              </>
            )}
          </Box>
          
          {userRole === 'admin' && (
            <IconButton
              size="small"
              color="error"
              onClick={handleDeleteGroup}
            >
              <Delete />
            </IconButton>
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
    </>
  );
};

export default GroupCard; 