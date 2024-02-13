import React from 'react';
import { Theme, Box, Container, Grid, Typography, Link } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import structsLogo from 'assets/img/structs.png';
import tiktokLogo from 'assets/img/tiktokColouredWhite.svg';
import janeStreetLogo from 'assets/img/JaneStreetWhite.png';


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
              <Link href="https://github.com/devsoc-unsw/structs.sh" color="inherit">
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
              <Link href="https://devsoc.app/" color="inherit">
                DevSoc Website
              </Link>
            </Typography>
            <Typography color="textSecondary">
              <Link href="https://www.facebook.com/devsocUNSW" color="inherit">
                Facebook
              </Link>
            </Typography>
          </Grid>
          {/* New Grid item for Company Sponsors */}
          <Grid item xs={12} textAlign="center">
            <Typography color="textPrimary" variant="h5" style={{ marginBottom: '1.3rem' }}>
              Our Sponsors
            </Typography>
            {/* TikTok logo */}
            <Link href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer">
              <img src={tiktokLogo} alt="TikTok Logo" height={40} style={{ marginRight: '2vw', verticalAlign: 'middle' }} />
            </Link>

            {/* Jane Street */}
            <Link href="https://www.janestreet.com/" target="_blank" rel="noopener noreferrer">
              <img src={janeStreetLogo} alt="Jane Street Logo" height={50} style={{ verticalAlign: 'middle', marginBottom: '0px' }} />
            </Link>

          </Grid>
        </Grid>
      </Container>
      <Box textAlign="center" paddingTop={5}>
        <Typography color="textSecondary">© {new Date().getFullYear()} — Software Development Society (DevSoc)</Typography>
      </Box>
    </StyledFooter>
  );
};

export default Footer;
