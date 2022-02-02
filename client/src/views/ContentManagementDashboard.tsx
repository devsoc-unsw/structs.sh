import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ContentManagementSteps } from 'components/ContentManagement';
import { HomepageLayout } from 'layout';
import React from 'react';

function ContentManagementDashboard() {
  return (
    <HomepageLayout topNavPosition="fixed" enableOnScrollEffect>
      <Box sx={{ marginTop: '80px', textAlign: 'center', minHeight: 'calc(100vh - 80px)' }}>
        <Typography color="textPrimary" variant="h3">
          Content Management
        </Typography>
        <Container maxWidth="lg">
          <ContentManagementSteps />
        </Container>
      </Box>
    </HomepageLayout>
  );
}

export default ContentManagementDashboard;
