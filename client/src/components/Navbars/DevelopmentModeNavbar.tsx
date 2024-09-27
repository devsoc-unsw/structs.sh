import styles from 'styles/DevelopmentModeNavBar.module.css';
import dialogStyles from 'styles/Dialog.module.css';
import logo from 'assets/img/logo.png';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import Dialog, { DialogTitle, DialogDescription } from 'components/Dialog/Dialog';
import AboutText from 'visualiser-debugger/Component/FileTree/AboutText';
import BookIcon from '@mui/icons-material/Book';

const DevelopmentModeNavbar = ({
  onButtonClick,
}: {
  onButtonClick: (event: React.MouseEvent<HTMLElement>) => void;
}) => {
  return (
    <div className={styles.navBar}>
      <div className={styles.navItem}>
        <img src={logo} alt="logo" height="30px" />
        <span>
          <h4>Structs.sh</h4>
        </span>
      </div>
      <div style={{ marginLeft: '82vw' }} />
      <div className="onboardingButton" style={{ marginRight: '0.3vw' }}>
        <button
          className={dialogStyles.OnboardingButton}
          onClick={onButtonClick}
          type="button"
          aria-label="Start Onboardings"
        >
          <BookIcon />
        </button>
      </div>
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
