import { Button, Menu, MenuItem } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React, { useState } from 'react';
import { styled } from '@mui/styles';

const OptionsMenuButton = styled(Button)({
  textTransform: 'none',
  width: 120,
});

const OptionsMenuItem = styled(MenuItem)({});

interface Props {
  options: string[];
  selectArgument: (s: string) => void;
}

const OperationMenu: React.FC<Props> = ({ options, selectArgument }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOption, setSelectedOption] = useState<string>(options[0]);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSetOption = (option: string) => {
    console.log(option);
    setSelectedOption(option);
    selectArgument(option);
    handleClose();
  };
  return (
    <>
      <OptionsMenuButton onClick={handleClick} color="inherit" endIcon={<KeyboardArrowUpIcon />}>
        {selectedOption}
      </OptionsMenuButton>
      <Menu
        onClose={handleClose}
        anchorEl={anchorEl}
        open={open}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {options.map((option, idx) => (
          <OptionsMenuItem key={idx} onClick={() => handleSetOption(option)}>
            {option}
          </OptionsMenuItem>
        ))}
      </Menu>
    </>
  );
};

export default OperationMenu;
