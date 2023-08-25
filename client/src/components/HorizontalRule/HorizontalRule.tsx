import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';

const HorizontalRule = () => {
  const theme = useTheme();
  return <Divider sx={{ mt: 2, mb: 2, background: theme.palette.text.primary }} />;
};

export default HorizontalRule;
