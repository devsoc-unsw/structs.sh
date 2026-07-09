import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

export const GreenMenuButton = styled(Button)({
  backgroundColor: '#46B693',
  '&:hover': {
    backgroundColor: '#2b6e5a',
  },
});

export const RedMenuButton = styled(Button)({
  backgroundColor: '#C81437',
  '&:hover': {
    backgroundColor: '#F05C79',
  },
  maxWidth: '100%',
  borderRadius: '0',
});
