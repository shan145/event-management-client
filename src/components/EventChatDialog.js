import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import { Send, Message as MessageIcon } from '@mui/icons-material';
import axios from 'axios';

const EventChatDialog = ({ open, onClose, eventId }) => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const lastMessageIdRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (open && eventId) {
      loadMessages();
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [open, eventId]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && open) {
        loadMessages(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [open, messages]);

  const loadMessages = async (incremental = false) => {
    try {
      setLoading(!incremental);
      setError('');

      const params = new URLSearchParams();
      params.append('limit', '50');
      
      if (incremental && messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.createdAt) {
          const lastMessageDate = new Date(lastMessage.createdAt);
          params.append('since', lastMessageDate.toISOString());
        }
      }

      const response = await axios.get(`/messages/event/${eventId}?${params.toString()}`);

      if (incremental) {
        setMessages((prev) => {
          const existingIds = new Set(prev.map(m => m._id));
          const newMessages = response.data.data.messages.filter(msg => !existingIds.has(msg._id));
          
          if (newMessages.length === 0) {
            return prev;
          }
          
          const combined = [...prev, ...newMessages];
          combined.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          
          if (combined.length > 0) {
            lastMessageIdRef.current = combined[combined.length - 1]._id;
          }
          
          return combined;
        });
      } else {
        setMessages(response.data.data.messages);
        if (response.data.data.messages.length > 0) {
          lastMessageIdRef.current = response.data.data.messages[response.data.data.messages.length - 1]._id;
        }
      }
    } catch (err) {
      if (!incremental) {
        setError(err.response?.data?.message || 'Failed to load messages');
      }
    } finally {
      setLoading(false);
    }
  };

  const startPolling = () => {
    stopPolling();
    pollingIntervalRef.current = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadMessages(true);
      }
    }, 5000);
  };

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const sendMessage = async () => {
    const content = messageText.trim();
    if (!content || sending) return;

    try {
      setSending(true);
      setError('');

      const response = await axios.post(`/messages/event/${eventId}`, { content });

      setMessages((prev) => {
        const updated = [...prev, response.data.data.message];
        updated.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        return updated;
      });

      lastMessageIdRef.current = response.data.data.message._id;
      setMessageText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const currentUserId = JSON.parse(localStorage.getItem('user'))?._id;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Event Chat</DialogTitle>
      <DialogContent sx={{ p: 0, height: '500px', display: 'flex', flexDirection: 'column' }}>
        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {loading && messages.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <CircularProgress />
            </Box>
          ) : messages.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                color: 'text.secondary',
              }}
            >
              <MessageIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
              <Typography variant="body1">No messages yet</Typography>
              <Typography variant="body2">Start the conversation!</Typography>
            </Box>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.senderId._id === currentUserId;
              return (
                <Box
                  key={message._id}
                  sx={{
                    display: 'flex',
                    justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '70%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {!isOwnMessage && (
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, ml: 1 }}>
                        {message.senderId.firstName} {message.senderId.lastName}
                      </Typography>
                    )}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        bgcolor: isOwnMessage ? 'primary.main' : 'grey.100',
                        color: isOwnMessage ? 'white' : 'text.primary',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body1">{message.content}</Typography>
                    </Paper>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, mr: isOwnMessage ? 1 : 0, ml: !isOwnMessage ? 1 : 0 }}>
                      {formatTime(message.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </Box>

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sending}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              disabled={!messageText.trim() || sending}
              startIcon={sending ? <CircularProgress size={20} /> : <Send />}
            >
              Send
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventChatDialog;

