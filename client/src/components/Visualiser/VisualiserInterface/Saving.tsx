/* eslint-disable */
// TODO: Proper rework on this file => we want to re-design this anyway. I can't fix lint now because it will potentially change functioanlity of the file
import { Box, Typography, Button, Alert, Snackbar, Collapse, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { SERVER_URL } from 'utils/constants';
import LoadOptions from './LoadOptions';

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

const Saving = ({ topicTitle, controller }) => {
  const [loadOptions, setLoadOptions] = useState([]);
  const [saveName, setSaveName] = useState('');

  const [toggleSave, setToggleSave] = useState(false);
  const [toggleLoad, setToggleLoad] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [showSavedAlert, setShowSavedAlert] = useState(false);
  const [showFailedAlert, setShowFailedAlert] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    setToggleLoad(false);
  }, [topicTitle]);

  useEffect(() => {
    if (inputRef.current && toggleSave) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [toggleSave]);

  const handleUnfocus = (event) => {
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

  const makeFailedAlert = (msg) => {
    setErrMsg(msg);
    setShowFailedAlert(true);
  };

  const handleKeyPress = (event) => {
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

    const data = {
      owner,
      type: topicTitle,
      name: saveName,
      data: controller.getData(),
    };

    axios
      .post(`${SERVER_URL}/api/save`, data)
      .then((response) => {
        console.log('Data saved:', response.data);
        setShowSavedAlert(true);
        setSaveName('');
        setToggleSave(false);
      })
      .catch((error) => {
        setShowFailedAlert(true);
        console.error('Error saving data structure:', error);
      });
  };

  // Get data structures saved under user.
  const handleLoad = () => {
    axios
      .get(`${SERVER_URL}/api/getOwnedData`, {
        params: { topicTitle, user: localStorage.getItem('user') },
      })
      .then((response) => {
        // Handle the response data
        const newOptions: any[] = [];
        response.data.forEach((item, index) => {
          newOptions.push({
            key: index,
            owner: item.owner,
            type: item.type,
            name: item.name,
            data: item.data,
          });
        });
        setLoadOptions(newOptions);
        setToggleLoad(true);
      })
      .catch((error) => {
        // Handle the error
        console.error('Error Loading data structure:', error);
        makeFailedAlert('Saving Failed. Problem on our End :(');
      });
  };

  const load = (e, data: number[]) => {
    e.stopPropagation();
    controller.loadData(data);
    setToggleLoad(false);
  };

  // for developing purpoeses only to clear datastructures
  // const clearDb = () => {
  //     axios
  //         .delete(`${SERVER_URL}/api/deleteAll`, {
  //             data: {
  //                 owner: 'Hanyuan Li',
  //             },
  //         })
  //         .then((response) => {
  //             alert('cleared db');
  //         })
  //         .catch((error) => {
  //             // Handle the error
  //             console.error('Error deleting everything:', error);
  //         });
  // };

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

      <SaveBox
        tabIndex={0}
        onClick={() => {
          handleLoad();
        }}
        onBlur={() => {
          setToggleLoad(false);
        }}
      >
        <Collapse
          in={toggleLoad}
          style={{ display: 'flex', justifyContent: 'center', margin: '0', width: '100%' }}
        >
          <LoadOptions
            options={loadOptions}
            handleLoad={load}
            handleToggleExpansion={() => {
              setToggleLoad(false);
            }}
          />
        </Collapse>
        {!toggleLoad ? (
          <Typography color="textPrimary" whiteSpace="nowrap">
            LOAD
          </Typography>
        ) : null}
      </SaveBox>
    </>
  );
};

export default Saving;
