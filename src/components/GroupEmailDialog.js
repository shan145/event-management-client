import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { Email, Send, Group } from '@mui/icons-material';
import axios from 'axios';

const GroupEmailDialog = ({ open, onClose, group, onSuccess }) => {
  const [emailData, setEmailData] = useState({
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (field) => (e) => {
    setEmailData({
      ...emailData,
      [field]: e.target.value
    });
  };

  const getRecipientCount = () => {
    if (!group) return 0;
    return group.members?.length || 0;
  };

  const handleSendEmail = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await axios.post(`/groups/${group._id}/send-email`, emailData);
      
      setSuccess(`Email sent successfully to ${response.data.data.recipientCount} group members!`);
      
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

  if (!group) return null;

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
        Send Message to Group - {group.name}
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

        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Group sx={{ fontSize: 16 }} />
            Recipients: All Group Members (sent privately via BCC)
          </Typography>
          <Chip 
            label={`${recipientCount} group ${recipientCount === 1 ? 'member' : 'members'}`} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            📧 Email addresses are hidden from other recipients for privacy
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Group Details:
          </Typography>
          <Typography variant="body2">
            <strong>👥 Group:</strong> {group.name}
          </Typography>
          <Typography variant="body2">
            <strong>👤 Members:</strong> {group.members?.length || 0} people
          </Typography>
          {group.eventCount !== undefined && (
            <Typography variant="body2">
              <strong>📅 Events:</strong> {group.eventCount} total
            </Typography>
          )}
        </Box>

        <TextField
          fullWidth
          label="Subject"
          value={emailData.subject}
          onChange={handleInputChange('subject')}
          sx={{ mb: 3 }}
          placeholder="e.g., Important group announcement"
        />

        <TextField
          fullWidth
          label="Message"
          value={emailData.message}
          onChange={handleInputChange('message')}
          multiline
          rows={6}
          placeholder="Type your message here... (press Enter for new lines)"
          helperText="This message will be sent privately to all group members (BCC) along with group details. Use Enter key to create new lines."
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

export default GroupEmailDialog; 