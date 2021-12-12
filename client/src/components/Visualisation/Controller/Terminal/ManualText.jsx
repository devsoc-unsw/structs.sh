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
                variant="h5"
                className={styles.command}
                sx={{ fontFamily: 'Ubuntu Mono' }}
                dangerouslySetInnerHTML={createMarkup(manual.command)}
            />
            <Typography variant="h6" className={styles.usage} sx={{ fontFamily: 'Ubuntu Mono' }}>
                {manual.usage}
            </Typography>
            <Typography
                variant="body2"
                sx={{ fontFamily: 'Ubuntu Mono' }}
                dangerouslySetInnerHTML={createMarkup(`${manual.description}`)}
            />
        </>
    );
};

Manual.propTypes = {
    manual: PropTypes.object,
};

export default Manual;
