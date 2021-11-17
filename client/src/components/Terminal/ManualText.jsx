import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import styles from './Terminal.module.scss';

const Manual = ({ manual }) => {
    const createMarkup = (html) => {
        return { __html: html };
    };

    return (
        <>
            <Typography
                variant="subtitle1"
                className={styles.command}
                dangerouslySetInnerHTML={createMarkup(manual.command)}
            />
            <Typography
                variant="body2"
                dangerouslySetInnerHTML={createMarkup(`${manual.description}`)}
            />
        </>
    );
};

Manual.propTypes = {
    manual: PropTypes.object,
};

export default Manual;
