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
  PrivacyTip,
  Security,
  DataUsage,
  Person,
  Notifications,
  Email,
} from '@mui/icons-material';

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: <Person sx={{ fontSize: 28, color: 'primary.main' }} />,
      title: 'Information We Collect',
      content: [
        'Account Information: When you create an account, we collect your first name, last name, and email address.',
        'Authentication Data: We securely store encrypted password hashes for account authentication. Passwords are never stored in plain text.',
        'Profile Information: We store your role (admin or regular user), group memberships, and group administration status.',
        'Device Information: To enable push notifications, we collect device tokens and device identifiers. This information is used solely for delivering notifications to your iOS device.',
        'Event Data: When you create or participate in events, we collect event details including title, description, location, date, time, and attendance information.',
        'Group Data: We store information about groups you belong to, including group names and membership status.',
        'Messages: Messages you send in event chat conversations are stored and associated with your account.',
        'Notification Preferences: We store your preferences for email and push notifications, including which types of notifications you want to receive.',
        'Usage Data: We may collect information about how you interact with the app, such as when you last accessed your account.',
      ],
    },
    {
      icon: <DataUsage sx={{ fontSize: 28, color: 'primary.main' }} />,
      title: 'How We Use Your Information',
      content: [
        'To provide and maintain our service, including event management, group organization, and communication features.',
        'To send you notifications about events, groups, and important updates based on your notification preferences.',
        'To authenticate your identity and secure your account.',
        'To enable communication between group members and event attendees through messaging features.',
        'To manage event attendance, waitlists, and RSVPs.',
        'To provide customer support and respond to your inquiries.',
        'To improve our services and develop new features.',
      ],
    },
    {
      icon: <Security sx={{ fontSize: 28, color: 'primary.main' }} />,
      title: 'Data Security',
      content: [
        'We implement industry-standard security measures to protect your personal information.',
        'Passwords are hashed using bcrypt with a salt factor of 12, ensuring they cannot be recovered even if our database is compromised.',
        'Authentication tokens are stored securely in your device\'s keychain (iOS Keychain) and are never transmitted insecurely.',
        'All data transmission between the app and our servers is encrypted using HTTPS/TLS.',
        'We regularly review and update our security practices to protect against unauthorized access, alteration, disclosure, or destruction of your data.',
        'While we strive to protect your information, no method of transmission over the internet or electronic storage is 100% secure.',
      ],
    },
    {
      icon: <Notifications sx={{ fontSize: 28, color: 'primary.main' }} />,
      title: 'Push Notifications',
      content: [
        'We use Apple Push Notification Service (APNs) to send push notifications to your iOS device.',
        'To enable push notifications, we collect and store device tokens and device identifiers.',
        'You can control notification preferences through the app settings, including which types of notifications you receive.',
        'You can disable push notifications at any time through your iOS device settings.',
        'Device tokens are only used for delivering notifications and are not shared with third parties.',
      ],
    },
    {
      icon: <PrivacyTip sx={{ fontSize: 28, color: 'primary.main' }} />,
      title: 'Data Sharing and Disclosure',
      content: [
        'We do not sell, trade, or rent your personal information to third parties.',
        'Your information is shared with other users within the app only as necessary for the service to function (e.g., your name and email may be visible to group members and event attendees).',
        'We may share your information if required by law or to protect our rights and the safety of our users.',
        'In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity.',
      ],
    },
    {
      icon: <Person sx={{ fontSize: 28, color: 'primary.main' }} />,
      title: 'Your Rights and Choices',
      content: [
        'Access: You can view and update your account information at any time through the app settings.',
        'Deletion: You can request deletion of your account and associated data by contacting us.',
        'Notification Preferences: You can customize which notifications you receive through the app settings.',
        'Data Portability: You can request a copy of your data in a machine-readable format.',
        'Correction: You can update your profile information, including name and email, through the app.',
      ],
    },
    {
      icon: <Security sx={{ fontSize: 28, color: 'primary.main' }} />,
      title: 'Data Retention',
      content: [
        'We retain your account information for as long as your account is active or as needed to provide you services.',
        'If you delete your account, we will delete or anonymize your personal information, except where we are required to retain it for legal purposes.',
        'Messages and event data may be retained for a reasonable period after account deletion to maintain service integrity for other users.',
      ],
    },
    {
      icon: <PrivacyTip sx={{ fontSize: 28, color: 'primary.main' }} />,
      title: 'Children\'s Privacy',
      content: [
        'Our service is not intended for children under the age of 13.',
        'We do not knowingly collect personal information from children under 13.',
        'If you are a parent or guardian and believe your child has provided us with personal information, please contact us to have that information removed.',
      ],
    },
    {
      icon: <DataUsage sx={{ fontSize: 28, color: 'primary.main' }} />,
      title: 'Third-Party Services',
      content: [
        'We use Apple Push Notification Service (APNs) for delivering push notifications. Your device token is shared with Apple for this purpose.',
        'We use secure cloud hosting services to store and process your data.',
        'These third-party services are bound by their own privacy policies and security practices.',
      ],
    },
    {
      icon: <PrivacyTip sx={{ fontSize: 28, color: 'primary.main' }} />,
      title: 'Changes to This Privacy Policy',
      content: [
        'We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.',
        'We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.',
        'You are advised to review this Privacy Policy periodically for any changes.',
        'Your continued use of the service after changes become effective constitutes acceptance of the updated Privacy Policy.',
      ],
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
            <PrivacyTip sx={{ fontSize: 64, color: 'primary.main' }} />
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
            Privacy Policy
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ 
              fontSize: '1.125rem',
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
              mb: 2,
            }}
          >
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: 'italic' }}
          >
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>
        </Box>

        {/* Introduction */}
        <Card
          sx={{
            p: 4,
            border: '1px solid #e1e1e1',
            mb: 4,
          }}
        >
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Welcome to Eventable. We are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy describes how we collect, use, store, and protect information when you use our iOS application and related services.
          </Typography>
        </Card>

        {/* Privacy Policy Sections */}
        {sections.map((section, index) => (
          <Card
            key={index}
            sx={{
              p: 4,
              border: '1px solid #e1e1e1',
              mb: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              {section.icon}
              <Typography 
                variant="h5" 
                sx={{ 
                  ml: 2, 
                  fontWeight: 600,
                  color: 'text.primary',
                }}
              >
                {section.title}
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Stack spacing={2}>
              {section.content.map((item, itemIndex) => (
                <Box key={itemIndex} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.8,
                      '&::before': {
                        content: '"• "',
                        color: 'primary.main',
                        fontWeight: 'bold',
                        fontSize: '1.2em',
                        mr: 1,
                      },
                    }}
                  >
                    {item}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        ))}

        {/* Contact Section */}
        <Card
          sx={{
            p: 4,
            border: '1px solid #e1e1e1',
            mb: 4,
            textAlign: 'center',
          }}
        >
          <Email sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Contact Us
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="outlined"
              startIcon={<Email />}
              onClick={() => window.location.href = 'mailto:privacy@eventable.com'}
              sx={{ textTransform: 'none' }}
            >
              privacy@eventable.com
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/support')}
              sx={{ textTransform: 'none' }}
            >
              Support Center
            </Button>
          </Stack>
        </Card>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', pt: 4, borderTop: '1px solid #e1e1e1' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            sx={{ textTransform: 'none' }}
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default PrivacyPolicyPage;

