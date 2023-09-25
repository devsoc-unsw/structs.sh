import styles from 'styles/DevelopmentModeNavBar.module.css';
import dialogStyles from 'styles/Dialog.module.css';
import logo from 'assets/img/logo.png';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import Dialog, { DialogTitle, DialogDescription } from 'components/Dialog/Dialog';

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
            <p>
              Development Mode allows you to debug your own C code and visualise the data structures
              that exist in memory.
            </p>
            <p>
              Get started by writing your C code onto the code editor and clicking the Run button.
              You then have the option to configure the data types and variables that help us
              visualise your data structure(s). Then, you can debug and visualise your program in
              real time by pressing the Next button!
            </p>
            <p>
              We currently only support visualising linked lists, but more data structures (arrays,
              trees and graphs) are on their way!
            </p>
            <p>
              If you want some code to try out our debugger with, check out the{' '}
              <a href="https://cgi.cse.unsw.edu.au/~cs1511/23T2/live/week_07/ll_intro.c">
                COMP1511 Programming Fundamentals week 7 lecture code for linked lists
              </a>
            </p>
          </DialogDescription>
        </Dialog>
      </div>
    </div>
  );
};

export default DevelopmentModeNavbar;
