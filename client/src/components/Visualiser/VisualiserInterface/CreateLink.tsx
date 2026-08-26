import { Typography, TextField, Collapse } from '@mui/material';
import { useEffect, useContext, useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import VisualiserContext from './VisualiserContext';
import { GreenMenuButton } from './styled';
import { useNotification } from './useNotification';

const CreateLink = () => {
  const { controller } = useContext(VisualiserContext);
  const [link, setLink] = useState('');
  const [showLink, setShowLink] = useState(false);
  const { showNotification, Notification } = useNotification();

  const location = useLocation();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [showLink]);

  const makeLink = useCallback(() => {
    const pieces = location.pathname.split('/');

    const rawDataString = controller.data;
    let newData: string = '';
    rawDataString.forEach((x) => {
      newData += x.toString().padStart(2, '0');
    });
    const linkString = `http://localhost:3000/${pieces[1]}/${pieces[2]}/${newData}`;
    setLink(linkString);
    navigator.clipboard.writeText(linkString);
    setShowLink(true);

    showNotification('Link copied to Clipboard!', 'success');

    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [location, controller.data, showNotification]);

  return (
    <>
      <GreenMenuButton onClick={makeLink}>
        <Typography color="textPrimary" whiteSpace="nowrap">
          Create Link
        </Typography>
      </GreenMenuButton>

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
      <Notification />
    </>
  );
};

export default CreateLink;
