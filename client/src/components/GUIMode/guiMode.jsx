import PropTypes from 'prop-types';
import ListOp from '../Operations/listOp';
import TreeOp from '../Operations/treeOp';
import ModeSwitch from './modeSwitch';

const operations = (struct) => {
    switch (struct) {
        case 'Linked-List':
            return <ListOp structType='Linked-List'/>;
        case 'Tree':
            return <TreeOp />;
        default:
            break;
    }
};

export const GUIControl = ({ switchMode, setSwitchMode }) => {
    return (
        <div>
            <ModeSwitch switchMode={switchMode} setSwitchMode={setSwitchMode}/>
            {operations('Linked-List')}
        </div>
    );
};

GUIControl.propTypes = {
    switchMode: PropTypes.bool,
    setSwitchMode: PropTypes.func,
};

export default GUIControl;