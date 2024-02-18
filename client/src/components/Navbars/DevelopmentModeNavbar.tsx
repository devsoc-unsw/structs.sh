import styles from 'styles/DevelopmentModeNavBar.module.css';
import dialogStyles from 'styles/Dialog.module.css';
import logo from 'assets/img/logo.png';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import Dialog, { DialogTitle, DialogDescription } from 'components/Dialog/Dialog';
import AboutText from 'visualiser-debugger/Component/FileTree/AboutText';

const DevelopmentModeNavbar = () => {
  return (
    <div className={styles.navBar}>
      <div className={styles.navItem}>
        <img src={logo} alt="logo" height="30px" />
        <span>
          <h4>Structs.sh</h4>
        </span>
      </div>
      <div className={styles.navItem}>
        <Dialog
          trigger={
            <button className={dialogStyles.IconButton}>
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
