import React from 'react';
import { Theme, Box, Container, Grid, Typography, Link } from '@mui/material';
import { useTheme } from '@mui/styles';
import { styled } from '@mui/system';
import { Link as RouterLink } from 'react-router-dom';
import structsLogo from 'assets/img/structs.png';

const StyledFooter = styled('footer')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  position: 'relative',
  paddingTop: 10,
  paddingBottom: 10,
}));

/**
 * The footer of the page
 */
const Footer = () => {
  const theme: Theme = useTheme();

  return (
    <StyledFooter>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" paddingBottom={3}>
          <img height={35} src={structsLogo} alt="Structs.sh logo" />
          <Box display="inline-block" textAlign="left">
            <Typography display="inline" variant="h6" color="textPrimary">
              › Structs.sh
            </Typography>
          </Box>
        </Box>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} textAlign="center">
            <Typography color="textPrimary" variant="h5">
              Information
            </Typography>
            <Typography color="textSecondary">
              <Link href="https://github.com/csesoc/Structs.sh" color="inherit">
                GitHub Repository
              </Link>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} textAlign="center">
            <Typography color="textPrimary" variant="h5">
              Get Connected
            </Typography>
            <Typography color="textSecondary">
              <Link component={RouterLink} to="/feedback" color="inherit">
                Provide Feedback
              </Link>
            </Typography>
            <Typography color="textSecondary">
              <address>
                <Link href="mailto:projects@csesoc.org.au" color="inherit">
                  Email Us
                </Link>{' '}
              </address>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} textAlign="center">
            <Typography color="textPrimary" variant="h5">
              Social
            </Typography>
            <Typography color="textSecondary">
              <Link href="https://csesoc.unsw.edu.au/" color="inherit">
                CSESoc Website
              </Link>
            </Typography>
            <Typography color="textSecondary">
              <Link href="https://www.facebook.com/csesoc/" color="inherit">
                Facebook
              </Link>
            </Typography>
            <Typography color="textSecondary">
              <Link href="https://www.youtube.com/channel/UC1JHpRrf9j5IKluzXhprUJg" color="inherit">
                YouTube
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Container>
      <Box textAlign="center" paddingTop={5}>
        <Typography color="textSecondary">© {new Date().getFullYear()} — CSESoc UNSW</Typography>
      </Box>
    </StyledFooter>
  );
};

export default Footer;
