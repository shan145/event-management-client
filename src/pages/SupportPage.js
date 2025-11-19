import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Stack,
  Button,
  Divider,
  IconButton,
} from '@mui/material';
import { 
  ArrowBack, 
  HelpOutline, 
  Email, 
  QuestionAnswer,
  BugReport,
  Feedback
} from '@mui/icons-material';

const SupportPage = () => {
  const navigate = useNavigate();

  const supportOptions = [
    {
      icon: <QuestionAnswer sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: 'FAQs',
      description: 'Find answers to commonly asked questions about using the iOS app.',
      action: 'View FAQs',
    },
    {
      icon: <BugReport sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: 'Report a Bug',
      description: 'Encountered an issue? Let us know so we can fix it.',
      action: 'Report Issue',
    },
    {
      icon: <Feedback sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: 'Feature Request',
      description: 'Have an idea for a new feature? We\'d love to hear it.',
      action: 'Submit Request',
    },
    {
      icon: <Email sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: 'Contact Support',
      description: 'Get in touch with our support team for personalized assistance.',
      action: 'Contact Us',
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
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <IconButton
            onClick={() => navigate('/')}
            sx={{ mb: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h6"
            component="h1"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            Eventable
          </Typography>
        </Box>

        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <HelpOutline sx={{ fontSize: 64, color: 'primary.main' }} />
          </Box>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              mb: 2,
              color: 'text.primary',
              letterSpacing: '-0.02em',
            }}
          >
            Support Center
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ 
              fontSize: '1.125rem',
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            We're here to help! Get assistance with the Eventable iOS app, report issues, or share your feedback.
          </Typography>
        </Box>

        {/* Support Options Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(2, 1fr)',
            },
            gap: 3,
            mb: 6,
          }}
        >
          {supportOptions.map((option, index) => (
            <Card
              key={index}
              sx={{
                p: 4,
                border: '1px solid #e1e1e1',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ mb: 2 }}>
                  {option.icon}
                </Box>
                <Typography 
                  variant="h6" 
                  component="h3" 
                  sx={{ mb: 1, fontWeight: 600 }}
                >
                  {option.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mb: 3, lineHeight: 1.6 }}
                >
                  {option.description}
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  {option.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Additional Information */}
        <Card
          sx={{
            p: 4,
            border: '1px solid #e1e1e1',
            mb: 4,
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            iOS App Support
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Stack spacing={2}>
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                App Version
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Make sure you're running the latest version of the Eventable iOS app for the best experience.
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Troubleshooting
              </Typography>
              <Typography variant="body2" color="text.secondary">
                If you're experiencing issues, try closing and reopening the app, or restarting your device.
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Privacy & Security
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your data is secure and private. We never share your information with third parties.
              </Typography>
            </Box>
          </Stack>
        </Card>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', pt: 4, borderTop: '1px solid #e1e1e1' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Need more help? Contact us directly.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="outlined"
              startIcon={<Email />}
              onClick={() => window.location.href = 'mailto:support@eventable.com'}
              sx={{ textTransform: 'none' }}
            >
              Email Support
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{ textTransform: 'none' }}
            >
              Back to Home
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default SupportPage;

