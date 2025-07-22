import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from '../theme/ThemeContext';

const ThemeToggle = () => {
  const theme = useTheme();
  const { toggleColorMode } = useContext(ColorModeContext);
  const isDark = theme.palette.mode === 'dark';

  return (
    <Tooltip title="Toggle Light/Dark Mode">
      <IconButton onClick={toggleColorMode} color="inherit" aria-label="toggle theme">
        {isDark ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
