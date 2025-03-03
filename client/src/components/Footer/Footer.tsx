import { Box, Container, Grid, Typography, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import structsLogo from '../../assets/img/structs.png';
import janeStreetLogo from '../../assets/img/sponsors/JaneStreetWhite.png';
import aristaLogo from '../../assets/img/sponsors/arista.png';
import theTradeDeskLogo from '../../assets/img/sponsors/thetradedesk.png';
import scLogo from '../../assets/img/sponsors/sc.png';

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
          <Grid item xs={12} textAlign="center">
            <Typography color="textPrimary" variant="h4" style={{ marginBottom: '0.7rem' }}>
              Our Sponsors
            </Typography>
          </Grid>
          {/* New Grid item for Company Sponsors */}
          <Grid item xs={12} textAlign="center">
            <Typography color="textPrimary" variant="h5" style={{ marginBottom: '0.7rem' }}>
              Platinum Tier
            </Typography>
            <Box display="flex" justifyContent="center" gap={8}>
              {/* TTD logo */}
              <Link
                href="https://careers.thetradedesk.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={theTradeDeskLogo}
                  alt="The Trade Desk Logo"
                  height={40}
                  style={{ marginRight: '2vw', verticalAlign: 'middle' }}
                />
              </Link>
              {/* Arista Logo */}
              <Link
                href="https://www.arista.com/en/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mr: 8 }}
              >
                <img
                  src={aristaLogo}
                  alt="Arista Logo"
                  height={40}
                  style={{ verticalAlign: 'middle', marginBottom: '0px' }}
                />
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Typography color="textPrimary" variant="h5" style={{ marginBottom: '0.7rem' }}>
              Gold Tier
            </Typography>
            <Box display="flex" justifyContent="center" gap={8}>
              {/* SafetyCulture Logo */}
              <Link
                href="https://safetyculture.com/home/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={scLogo}
                  alt="SafetyCulture Logo"
                  height={60}
                  style={{ verticalAlign: 'middle', marginBottom: '0px' }}
                />
              </Link>
              {/* Jane Street Logo */}
              <Link href="https://www.janestreet.com/" target="_blank" rel="noopener noreferrer">
                <img
                  src={janeStreetLogo}
                  alt="Jane Street Logo"
                  height={60}
                  style={{ verticalAlign: 'middle', marginBottom: '0px' }}
                />
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Box textAlign="center" paddingTop={5}>
        <Typography color="textSecondary">
          © {new Date().getFullYear()} — Software Development Society (DevSoc)
        </Typography>
      </Box>
    </StyledFooter>
  );
};

export default Footer;
