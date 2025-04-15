import styles from 'styles/DevelopmentModeNavBar.module.css';
import dialogStyles from 'styles/Dialog.module.css';
import logo from 'assets/img/logo.png';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import Dialog, { DialogTitle, DialogDescription } from 'components/Dialog/Dialog';
import AboutText from 'visualiser-debugger/Component/FileTree/AboutText';
import BookIcon from '@mui/icons-material/Book';
import classNames from 'classnames';
import { Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useTheme } from '../../visualiser-debugger/Contexts/ThemeContexts';

const DevelopmentModeNavbar = ({
  onButtonClick,
}: {
  onButtonClick: (event: React.MouseEvent<HTMLElement>) => void;
}) => {
  const [navigateHomePage, setNavigateHomePage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (navigateHomePage) {
      navigate('/');
    }
  }, [navigateHomePage]);
  
  const { darkMode, toggleDarkMode } = useTheme();
  const handleDarkModeToggle = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    toggleDarkMode();
  }

  return (
    <div className={styles.navBar}>
      <div
        className={styles.navItem}
        onClick={() => setNavigateHomePage(!navigateHomePage)}
        aria-hidden="true"
      >
        <img src={logo} alt="logo" height="30px" />
        <span>
          <h4>Structs.sh</h4>
        </span>
      </div>
      <div className={styles.navItemsContainer}>
        <div className={styles.navItem}>
          <Tooltip title={darkMode ? "Switch to Dark Mode" : "Switch to Light Mode"}>
            <button
              className={classNames(dialogStyles.IconButton, 'darkmodeButton')}
              onClick={handleDarkModeToggle}
              type="button"
              aria-label={darkMode ? "Turn off Dark Mode" : "Turn On Dark Mode"}
            >
              <DarkModeIcon />
            </button>
          </Tooltip>
        </div>
        {/* <div style={{ marginLeft: '82vw' }} /> */}
        <Tooltip title="Start Onboarding">
          <button
            className={classNames(dialogStyles.IconButton, 'onboardingButton')}
            onClick={onButtonClick}
            type="button"
            aria-label="Start Onboardings"
          >
            <BookIcon />
          </button>
        </Tooltip>
        <div className={styles.navItem}>
          <Dialog
            trigger={
              <button className={dialogStyles.IconButton} aria-label="Info" type="button">
                <InfoCircledIcon />
              </button>
            }
          >
            <DialogTitle>Development Mode</DialogTitle>
            <DialogDescription>
              <AboutText />
            </DialogDescription>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentModeNavbar;