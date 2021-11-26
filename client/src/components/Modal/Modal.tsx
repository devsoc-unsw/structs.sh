import ModalUnstyled from '@mui/base/ModalUnstyled';
import Fade from '@mui/material/Fade';
import { Box, styled } from '@mui/system';
import React, { ComponentType, FC } from 'react';

const StyledModal = styled(ModalUnstyled)`
    position: fixed;
    z-index: 1300;
    right: 0;
    bottom: 0;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Backdrop = styled('div')`
    z-index: -1;
    position: fixed;
    right: 0;
    bottom: 0;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-tap-highlight-color: transparent;
`;

const style = {
    width: 400,
    bgcolor: 'background.paper',
    p: 2,
    px: 4,
    pb: 3,
    outline: 'none',
};

interface Props {
    children?: React.ReactNode;
    Button: ComponentType;
}

const Modal: FC<Props> = ({ children, Button }) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <span onClick={handleOpen}>
                <Button />
            </span>
            <StyledModal
                aria-labelledby="unstyled-modal-title"
                aria-describedby="unstyled-modal-description"
                open={open}
                onClose={handleClose}
                BackdropComponent={Backdrop}
            >
                <Fade in={open}>
                    <Box sx={style}>{children}</Box>
                </Fade>
            </StyledModal>
        </div>
    );
};

export default Modal;
