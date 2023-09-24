import * as Internal from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import styles from 'styles/Dialog.module.css';

const Dialog = ({ trigger, children }) => {
  return (
    <Internal.Root>
      <Internal.Trigger asChild>{trigger}</Internal.Trigger>
      <Internal.Portal>
        <Internal.Overlay className={styles.DialogOverlay} />
        <Internal.Content className={styles.DialogContent}>
          {children}
          <Internal.Close asChild>
            <button className={styles.IconButton}>
              <Cross2Icon />
            </button>
          </Internal.Close>
        </Internal.Content>
      </Internal.Portal>
    </Internal.Root>
  );
};

const DialogTitle = ({ children }) => {
  return <Internal.Title className={styles.DialogTitle}>{children}</Internal.Title>;
};

const DialogDescription = ({ children }) => {
  return (
    <Internal.Description className={styles.DialogDescription}>{children}</Internal.Description>
  );
};

export default Dialog;
export { DialogTitle, DialogDescription };
