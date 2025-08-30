import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { Email, Send } from '@mui/icons-material';
import axios from 'axios';

const EmailDialog = ({ open, onClose, event, onSuccess }) => {
  const [emailData, setEmailData] = useState({
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const formatTime = (time) => {
    // Convert 24-hour format (e.g., "20:00") to 12-hour format with AM/PM ET
    try {
      const [hours, minutes] = time.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      const displayMinutes = minutes === 0 ? '00' : minutes.toString().padStart(2, '0');
      return `${displayHours}:${displayMinutes} ${period} ET`;
    } catch (error) {
      // Fallback to original time if parsing fails
      return `${time} ET`;
    }
  };

  const handleInputChange = (field) => (e) => {
    setEmailData({
      ...emailData,
      [field]: e.target.value
    });
  };

  const getRecipientCount = () => {
    if (!event) return 0;
    return event.goingList?.length || 0;
  };

  const handleSendEmail = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await axios.post(`/events/${event._id}/send-email`, emailData);
      
      setSuccess(`Email sent successfully to ${response.data.data.recipientCount} recipients!`);
      
      // Reset form
      setEmailData({
        subject: '',
        message: ''
      });

      if (onSuccess) {
        onSuccess(response.data);
      }

      // Close dialog after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 2000);

    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmailData({
      subject: '',
      message: ''
    });
    setError('');
    setSuccess('');
    onClose();
  };

  if (!event) return null;

  const recipientCount = getRecipientCount();

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Email />
        Send Email - {event.title}
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Event Details:
          </Typography>
          <Typography variant="body2">
            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
          </Typography>
          <Typography variant="body2">
            <strong>Time:</strong> {formatTime(event.time)}
          </Typography>
          {event.location && (
            <Typography variant="body2">
              <strong>Location:</strong> {event.location}
            </Typography>
          )}
        </Box>

        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Recipients: Confirmed Attendees Only (sent privately via BCC)
          </Typography>
          <Chip 
            label={`${recipientCount} confirmed ${recipientCount === 1 ? 'attendee' : 'attendees'}`} 
            size="small" 
            color="success" 
            variant="outlined"
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            📧 Email addresses are hidden from other recipients for privacy
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Subject"
          value={emailData.subject}
          onChange={handleInputChange('subject')}
          sx={{ mb: 3 }}
          placeholder="e.g., Important update about the event"
        />

        <TextField
          fullWidth
          label="Message"
          value={emailData.message}
          onChange={handleInputChange('message')}
          multiline
          rows={6}
          placeholder="Type your message here... (press Enter for new lines)"
          helperText="This message will be sent privately to all confirmed attendees (BCC) along with event details. Use Enter key to create new lines."
        />
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSendEmail}
          variant="contained"
          startIcon={<Send />}
          disabled={loading || !emailData.subject.trim() || !emailData.message.trim() || recipientCount === 0}
        >
          {loading ? 'Sending...' : `Send to ${recipientCount}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailDialog; 