import { SplitPane } from 'react-collapse-pane';
import styles from './CollapsiblePane.module.scss';

const CollapsiblePane = (props) => {
    return (
        <SplitPane
            className={`${styles.pane} ${
                props.orientation === 'vertical' ? styles.vertical : styles.horizontal
            }`}
            split={props.orientation}
            dir="ltr"
            collapse={{ collapseDirection: 'right' }}
            resizerOptions={{
                grabberSize: '1rem',
            }}
            minSizes={props.minSize}
        >
            {props.children}
        </SplitPane>
    );
};

export default CollapsiblePane;
