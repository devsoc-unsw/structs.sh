/* eslint-disable */
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import React, { useContext, useEffect, useRef, useState, KeyboardEvent, FocusEvent } from 'react';
import { useSaveDataStructure } from '@/Services/useSaveDataStructure';
import VisualiserContext from './VisualiserContext';

const MenuButton = styled(Button)({
  backgroundColor: '#C81437',
  '&:hover': {
    backgroundColor: '#F05C79',
  },
});

const SaveBox = styled(Box)({
  display: 'flex',
  backgroundColor: '#C81437',
  borderRadius: '4px',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '40px',
  maxWidth: '100%',
  color: '#2E2054',
  boxSizing: 'border-box',
});

const Save = () => {
  const { controller } = useContext(VisualiserContext);
  const [saveName, setSaveName] = useState('');
  const [toggleSave, setToggleSave] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [showSavedAlert, setShowSavedAlert] = useState(false);
  const [showFailedAlert, setShowFailedAlert] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const { save, status } = useSaveDataStructure();

  useEffect(() => {
    if (inputRef.current && toggleSave) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [toggleSave]);

  useEffect(() => {
    if (status === 'success') {
      setShowSavedAlert(true);
      setSaveName('');
      setToggleSave(false);
    }
    if (status === 'error') {
      setShowFailedAlert(true);
    }
  }, [status]);

  const handleUnfocus = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.relatedTarget) {
      setToggleSave(false);
      setSaveName('');
      return;
    }

    if (!event.relatedTarget.classList.contains('SAVEBUTTON')) {
      setToggleSave(false);
      setSaveName('');
    }
  };

  const makeFailedAlert = (msg: string) => {
    setErrMsg(msg);
    setShowFailedAlert(true);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave();
    }
  };

  const handleSave = () => {
    const owner = localStorage.getItem('user');
    if (!owner) {
      makeFailedAlert('Please Log In to Save');
      return;
    }

    if (saveName === '') {
      makeFailedAlert('Please Give a Name');
      return;
    }

    const topic = controller.topic;
    if (!topic) {
      makeFailedAlert('No topic selected');
    }

    save({ owner, topic, name: saveName, data: controller.data });
  };

  return (
    <>
      <SaveBox
        tabIndex={0}
        onFocus={() => {
          setToggleSave(true);
        }}
        onBlur={(event) => {
          handleUnfocus(event);
        }}
      >
        <Collapse in={toggleSave}>
          <TextField
            style={{
              marginBottom: '15px',
              textTransform: 'none',
              marginTop: '10px',
              width: '170px',
            }}
            id="standard-basic"
            label="Save Name"
            variant="standard"
            onChange={(e) => {
              setSaveName(e.target.value);
            }}
            value={saveName}
            onKeyDown={handleKeyPress}
            inputRef={inputRef}
          />
        </Collapse>
        {toggleSave ? (
          <MenuButton className="SAVEBUTTON" onClick={handleSave} style={{ marginBottom: '5px' }}>
            <Typography color="textPrimary" whiteSpace="nowrap">
              SAVE
            </Typography>
          </MenuButton>
        ) : (
          <Typography color="textPrimary" whiteSpace="nowrap">
            SAVE
          </Typography>
        )}
      </SaveBox>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={showSavedAlert}
        onClose={() => {
          setShowSavedAlert(false);
        }}
        autoHideDuration={1500}
      >
        <Alert
          onClose={() => {
            setShowSavedAlert(false);
          }}
          severity="success"
          sx={{ width: '100%' }}
        >
          Data Structure Saved!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={showFailedAlert}
        onClose={() => {
          setShowFailedAlert(false);
        }}
        autoHideDuration={1500}
      >
        <Alert
          onClose={() => {
            setShowFailedAlert(false);
          }}
          severity="error"
          sx={{ width: '100%' }}
        >
          {errMsg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Save;
