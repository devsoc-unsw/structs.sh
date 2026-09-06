import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import React, { useContext, useEffect, useState, MouseEvent } from 'react';
import { useLoadDataStructures } from '@/Services/useLoadDataStructures';
import LoadOptions from './LoadOptions';
import VisualiserContext from './VisualiserContext';

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

const Load = () => {
  const { controller } = useContext(VisualiserContext);
  const [toggleLoad, setToggleLoad] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [showFailedAlert, setShowFailedAlert] = useState(false);

  const { options: loadOptions, status, fetchOptions } = useLoadDataStructures();

  useEffect(() => {
    setToggleLoad(false);
  }, [controller]);

  const makeFailedAlert = (msg: string) => {
    setErrMsg(msg);
    setShowFailedAlert(true);
  };

  useEffect(() => {
    if (status === 'success') {
      setToggleLoad(true);
    }
    if (status === 'error') {
      makeFailedAlert('Saving Failed. Problem on our End :(');
    }
  }, [status]);

  // Get data structures saved under user.
  const handleLoad = () => {
    fetchOptions(controller.topic, localStorage.getItem('user'));
  };

  const load = (e: MouseEvent<HTMLButtonElement>, data: number[]) => {
    e.stopPropagation();
    controller.loadData(data);
    setToggleLoad(false);
  };

  return (
    <>
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

export default Load;
