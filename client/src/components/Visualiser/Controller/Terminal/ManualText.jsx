import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import styles from './Terminal.module.scss';
import { Box } from '@mui/material';

const ManualText = ({ manual }) => {
    const createMarkup = (html) => {
        return { __html: html };
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography className={styles.command} sx={{ fontFamily: 'CodeText' }}>
                {manual.command}
            </Typography>
            <Typography className={styles.usage} sx={{ fontFamily: 'CodeText' }}>
                Usage: {manual.usage}
            </Typography>
            <Typography
                variant="body2"
                sx={{ fontFamily: 'CodeText' }}
                dangerouslySetInnerHTML={createMarkup(`${manual.description}`)}
            />
        </Box>
    );
};

ManualText.propTypes = {
    manual: PropTypes.object,
};

export default ManualText;
