import styles from 'styles/DevelopmentModeNavBar.module.css';
import dialogStyles from 'styles/Dialog.module.css';
import logo from 'assets/img/logo.png';
import Select, { SelectItem } from 'components/Select/Select';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import Dialog, { DialogTitle, DialogDescription } from 'components/Dialog/Dialog';
import AboutText from 'visualiser-debugger/Component/FileTree/AboutText';
import { VisualizerType } from 'visualiser-debugger/Types/visualizerType';

const DevelopmentModeNavbar = ({
  onChanceVisualizerType,
}: {
  onChanceVisualizerType: (mode: VisualizerType) => void;
}) => {
  return (
    <div className={styles.navBar}>
      <div className={styles.navItem}>
        <img src={logo} alt="logo" height="30px" />
        <span>
          <h4>Structs.sh</h4>
        </span>
      </div>

      {/* ============ */}
      <div className={styles.navItem}>
        <Select onValueChange={onChanceVisualizerType} placeholder="Choose mode...">
          <SelectItem
            style={{ fontSize: '13px' }}
            value={VisualizerType.ARRAY}
            className=""
            key="visualizerTypeArray"
          >
            Array
          </SelectItem>
          <SelectItem
            style={{ fontSize: '13px' }}
            value={VisualizerType.LINKED_LIST}
            className=""
            key="visualizerTypeLinkedList"
          >
            LinkedList
          </SelectItem>
        </Select>
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
