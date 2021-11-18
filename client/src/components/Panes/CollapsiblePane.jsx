import { SplitPane } from 'react-collapse-pane';
import styles from './CollapsiblePane.module.scss';

// const resizerCss = {
//     width: '1px',
//     background: 'rgba(0, 0, 0, 0.1)',
// };

// const resizerHoverCss = {
//     width: '10px',
//     marginLeft: '-10px',
//     backgroundImage:
//         'radial-gradient(at center center,rgba(0,0,0,0.2) 0%,transparent 70%,transparent 100%)',
//     backgroundSize: '50px 100%',
//     backgroundPosition: '0 50%',
//     backgroundRepeat: 'no-repeat',
//     borderRight: '1px solid rgba(0, 0, 0, 0.1)',
// };

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
                grabberSize: '3rem',
            }}
            minSizes={props.minSize}
        >
            {props.children}
        </SplitPane>
    );
};

export default CollapsiblePane;
