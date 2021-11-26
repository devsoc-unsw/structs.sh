import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';
import { useTheme } from '@mui/styles';
import { Theme } from '@mui/material';

interface Props {}

const Footer: React.FC<Props> = () => {
    const theme: Theme = useTheme();

    return (
        <footer className={styles.footer} style={{ background: theme.palette.background.paper }}>
            <Box>
                <Container maxWidth="lg">
                    <Grid container spacing={5}>
                        <Grid item xs={12} sm={4} className={styles.columnContainer}>
                            <Typography color="textPrimary">
                                <Link to="/about" className={styles.link}>
                                    About
                                </Link>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} className={styles.columnContainer}>
                            <Typography color="textPrimary">
                                <Link to="/feedback" className={styles.link}>
                                    Feedback
                                </Link>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} className={styles.columnContainer}>
                            <Typography color="textPrimary">
                                <address>
                                    <a href="mailto:projects@csesoc.org.au" className={styles.link}>
                                        Email
                                    </a>
                                </address>
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </footer>
    );
};

export default Footer;
