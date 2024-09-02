import { Typography, Button, TextField, Alert, Snackbar, Collapse } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useContext, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import VisualiserContext from './VisualiserContext';

const MenuButton = styled(Button)({
  backgroundColor: '#46B693',
  '&:hover': {
    backgroundColor: '#2b6e5a',
  },
});

const CreateLink = () => {
  const { controller } = useContext(VisualiserContext);
  const [link, setLink] = useState('');
  const [showLink, setShowLink] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const alertCopy = () => {
    setShowAlert(true);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [showLink]);

  const makeLink = () => {
    const pieces = useLocation().pathname.split('/');

    const rawDataString = controller.data;
    let newData: string = '';
    rawDataString.forEach((x) => {
      newData += x.toString().padStart(2, '0');
    });
    const linkString = `http://localhost:3000/${pieces[1]}/${pieces[2]}/${newData}`;
    setLink(linkString);
    navigator.clipboard.writeText(linkString);
    setShowLink(true);
    alertCopy();

    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  };

  return (
    <>
      <MenuButton onClick={makeLink}>
        <Typography color="textPrimary" whiteSpace="nowrap">
          Create Link
        </Typography>
      </MenuButton>

      <Collapse in={showLink}>
        <TextField
          id="outlined-basic"
          variant="outlined"
          value={link}
          inputRef={inputRef}
          onBlur={() => {
            setShowLink(false);
          }}
        />
      </Collapse>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={showAlert}
        onClose={() => {
          setShowAlert(false);
        }}
        autoHideDuration={1500}
      >
        <Alert
          onClose={() => {
            setShowAlert(false);
          }}
          severity="success"
          sx={{ width: '100%' }}
        >
          Link Copied to Clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateLink;
