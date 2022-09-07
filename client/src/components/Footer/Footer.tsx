import { Theme } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/styles';
import structsLogo from 'assets/img/structs.png';
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

interface Props {}

const Footer: React.FC<Props> = () => {
  const theme: Theme = useTheme();

  return (
    <footer
      className={styles.footer}
      style={{
        background: theme.palette.background.default,
      }}
    >
      <Box>
        <Container maxWidth="lg">
          <Box className={styles.brand}>
            <img className={styles.logo} src={structsLogo} alt="Structs.sh logo" />
            <Box
              className={styles.brandTextContainer}
              sx={{
                display: 'inline-block',
                textAlign: 'left',
              }}
            >
              <Typography display="inline" variant="h6" color="textPrimary">
                › Structs.sh
              </Typography>
            </Box>
          </Box>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={4} className={styles.columnContainer}>
              <Typography color="textPrimary" variant="h5">
                Information
              </Typography>
              <Typography color="textSecondary">
                <a className={styles.link} href="https://github.com/csesoc/Structs.sh">
                  GitHub Repository
                </a>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} className={styles.columnContainer}>
              <Typography color="textPrimary" variant="h5">
                Get Connected
              </Typography>
              <Typography color="textSecondary">
                <Link to="/feedback" className={styles.link}>
                  Provide Feedback
                </Link>
              </Typography>
              <Typography color="textSecondary">
                <address>
                  <a href="mailto:projects@csesoc.org.au" className={styles.link}>
                    Email Us
                  </a>{' '}
                </address>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} className={styles.columnContainer}>
              <Typography color="textPrimary" variant="h5">
                Social
              </Typography>
              <Typography color="textSecondary">
                <a className={styles.link} href="https://csesoc.unsw.edu.au/">
                  CSESoc Website
                </a>
              </Typography>
              <Typography color="textSecondary">
                <a className={styles.link} href="https://www.facebook.com/csesoc/">
                  Facebook
                </a>
              </Typography>
              <Typography color="textSecondary">
                <a
                  className={styles.link}
                  href="https://www.youtube.com/channel/UC1JHpRrf9j5IKluzXhprUJg"
                >
                  YouTube
                </a>
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box className={styles.bottomSection}>
        <Typography color="textSecondary">© {new Date().getFullYear()} — CSESoc UNSW</Typography>
      </Box>
    </footer>
  );
};

export default Footer;
