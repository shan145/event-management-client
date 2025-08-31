import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { 
  Group, 
  Event, 
  ArrowRight,
  CheckCircle,
  People,
  CalendarToday
} from '@mui/icons-material';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const features = [
    {
      icon: <Group sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: 'Create Groups',
      description: 'Organize your community into focused groups for better event management.'
    },
    {
      icon: <Event sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: 'Plan Events',
      description: 'Schedule events with detailed information, attendance tracking, and notifications.'
    },
    {
      icon: <People sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: 'Manage Attendees',
      description: 'Track RSVPs, manage waitlists, and communicate with confirmed attendees.'
    },
    {
      icon: <CalendarToday sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: 'Stay Organized',
      description: 'Keep track of all your events and group activities in one place.'
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 25% 25%, rgba(0,0,0,0.05) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(0,0,0,0.05) 0%, transparent 50%)
          `,
          zIndex: 0,
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 3,
            borderBottom: '1px solid #e1e1e1',
            mb: 6,
          }}
        >
          <Typography
            variant="h6"
            component="h1"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            Eventify
          </Typography>
          
          {user ? (
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={handleLogout}
                size="small"
              >
                Logout
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  if (user.role === 'admin') {
                    navigate('/admin');
                  } else if (user.groupAdminOf && user.groupAdminOf.length > 0) {
                    navigate('/dashboard');
                  } else {
                    navigate('/dashboard');
                  }
                }}
                size="small"
                endIcon={<ArrowRight />}
              >
                Dashboard
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                size="small"
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/signup')}
                size="small"
              >
                Sign Up
              </Button>
            </Stack>
          )}
        </Box>

        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700,
              mb: 3,
              color: 'text.primary',
              letterSpacing: '-0.02em',
            }}
          >
            Event Management
            <br />
            <span style={{ color: '#666666' }}>Made Simple</span>
          </Typography>
          
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ 
              mb: 4, 
              fontSize: '1.125rem',
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Create groups, plan events, and manage attendees with our intuitive platform. 
            Perfect for communities, organizations, and teams.
          </Typography>

          {!user && (
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 6 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/signup')}
                sx={{ px: 4, py: 1.5 }}
                endIcon={<ArrowRight />}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{ px: 4, py: 1.5 }}
              >
                Sign In
              </Button>
            </Stack>
          )}
        </Box>

        {/* Features Grid */}
        <Grid 
          container 
          spacing={4} 
          sx={{ 
            mb: 8,
            justifyContent: 'center',
            alignItems: 'stretch'
          }}
        >
          {features.map((feature, index) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={6} 
              lg={3} 
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Card
                sx={{
                  height: '100%',
                  width: '100%',
                  maxWidth: '280px',
                  p: 3,
                  textAlign: 'center',
                  border: '1px solid #e1e1e1',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* CTA Section */}
        {!user && (
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              borderTop: '1px solid #e1e1e1',
              mt: 6,
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
              Ready to get started?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Join thousands of organizers who trust Eventify for their events.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{ px: 4, py: 1.5 }}
              endIcon={<ArrowRight />}
            >
              Create Your Account
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default HomePage; 