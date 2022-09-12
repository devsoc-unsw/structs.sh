import { Theme } from '@mui/material';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/system';
import React from 'react';

interface Props {}

const HorizontalRule: React.FC<Props> = () => <Divider sx={{ mt: 2, mb: 2 }} />;

export default HorizontalRule;
