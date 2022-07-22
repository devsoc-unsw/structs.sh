import { Box, Typography } from '@mui/material';
import { HomepageLayout } from 'layout';
import React from 'react';
import Container from '@mui/material/Container';

const Feedback = () => (
  <HomepageLayout topNavPosition="fixed">
    <Box paddingTop="100px" textAlign="center" height="100%">
      <Container maxWidth="md">
        <Typography color="textPrimary" variant="h3">
          Feedback for Structs.sh
        </Typography>
        <br />
        <Typography color="textPrimary" variant="body1">
          <strong>Structs.sh</strong> is maintained by passionate computer science and engineering
          students at UNSW. We rely heavily on community feedback to improve our project!
        </Typography>
        <br />
        <Typography color="textPrimary" variant="body2">
          Thank you!
        </Typography>
      </Container>
      <br />
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLScg9AuvsDcrgjzNX3D10l2r09UhQS0WaGiyX3OvyRn4BlwBSQ/viewform?embedded=true"
        title="Structs.sh feedback form"
        frameBorder={0}
        marginHeight={0}
        marginWidth={0}
        style={{
          width: '100%',
          height: '100vh',
          // height: '100%',
        }}
      >
        Loading…
      </iframe>
    </Box>
  </HomepageLayout>
);

export default Feedback;
