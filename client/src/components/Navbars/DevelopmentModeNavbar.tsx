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

  return (
    <div className={styles.navBar}>
      <div className={styles.navItem} onClick={() => setNavigateHomePage(!navigateHomePage)}>
        <img src={logo} alt="logo" height="30px" />
        <span>
          <h4>Structs.sh</h4>
        </span>
      </div>
      <div style={{ marginLeft: '82vw' }} />
      <Tooltip title="Start Onboarding">
        <button
          className={classNames(dialogStyles.OnboardingButton, 'onboardingButton')}
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
  );
};

export default DevelopmentModeNavbar;
