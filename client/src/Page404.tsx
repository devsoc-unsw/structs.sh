import { Container, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import TopNavbar from 'components/Navbars/TopNavbar';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Page404.scss';

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { duration: 1 },
  },
  exit: {
    opacity: '-100vw',
    transition: { ease: 'easeInOut' },
  },
};

const Page404 = () => {
  const location = useLocation();
  const path: string = String(location.pathname);

  useEffect(() => {
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      htmlElement.style.overflow = 'hidden';
    }

    return () => {
      if (htmlElement) {
        htmlElement.style.overflow = 'auto';
      }
    };
  });

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit">
      <Box sx={{ overflow: 'hidden', height: '100vh', background: '#261C2C' }}>
        <TopNavbar />
        <Box
          sx={{
            width: '100vw',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              marginTop: '64px',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                overflow: 'hidden',
              }}
            >
              <div>
                <div className="starsec" />
                <div className="starthird" />
                <div className="starfourth" />
                <div className="starfifth" />
              </div>
              <div className="lamp__wrap">
                <div className="lamp">
                  <div className="cable" />
                  <div className="cover" />
                  <div className="in-cover">
                    <div className="bulb" />
                  </div>
                  <div className="light" />
                </div>
              </div>
            </div>
            <Container
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              maxWidth="md"
            >
              <Typography variant="h2">404</Typography>
              <br />
              <Typography variant="body1">
                Couldn&apos;t find a page for: <pre>{path}</pre>
              </Typography>
            </Container>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default Page404;
