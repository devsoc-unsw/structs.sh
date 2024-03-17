import * as Internal from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { ReactNode } from 'react';
import styles from 'styles/Dialog.module.css';
import PropTypes from 'prop-types';

const Dialog = ({ trigger, children }: { trigger: ReactNode; children: ReactNode }) => {
  return (
    <Internal.Root>
      <Internal.Trigger asChild>{trigger}</Internal.Trigger>
      <Internal.Portal>
        <Internal.Overlay className={styles.DialogOverlay} />
        <Internal.Content className={styles.DialogContent}>
          {children}
          <Internal.Close asChild>
            <button className={styles.IconButton} type="button" aria-label="Close">
              <Cross2Icon />
            </button>
          </Internal.Close>
        </Internal.Content>
      </Internal.Portal>
    </Internal.Root>
  );
};

interface ReactNodeProp {
  children: ReactNode;
}

const DialogTitle: React.FC<ReactNodeProp> = ({ children }) => {
  return <Internal.Title className={styles.DialogTitle}>{children}</Internal.Title>;
};

DialogTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

const DialogDescription: React.FC<ReactNodeProp> = ({ children }) => {
  return (
    <Internal.Description className={styles.DialogDescription}>{children}</Internal.Description>
  );
};

DialogDescription.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Dialog;
export { DialogTitle, DialogDescription };
