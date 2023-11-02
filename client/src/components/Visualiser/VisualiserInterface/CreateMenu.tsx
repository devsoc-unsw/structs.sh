import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useContext, useState } from 'react';
import axios from 'axios';
import { SERVER_URL } from 'utils/constants';
import { useParams, useLocation } from 'react-router-dom';
import VisualiserContext from './VisualiserContext';
import LoadOptions from './LoadOptions';
import styles from './Control.module.scss';

const MenuButton = styled(Button)({
  backgroundColor: '#46B693',
  '&:hover': {
    backgroundColor: '#2b6e5a',
  },
});

const LoadingButton = styled(Button)({
  backgroundColor: '#C81437',
  '&:hover': {
    backgroundColor: '#F05C79',
  },
});

/**
 * Contains the ability to reset and create new data structures
 *
 * It receives a bunch of callbacks and connects it to each of the corresponding
 * UI components.
 *
 * Eg. it receives a `handlePlay` callback and attaches it to the Play button's
 *     `onClick` handler.
 */
const CreateMenu = () => {
  const { controller, topicTitle } = useContext(VisualiserContext);

  const [loadOptions, setLoadOptions] = useState([]);

  // just using this to handle load options
  const {
    loadOptionsContext: { isLoadOptionsExpanded, handleSetLoadOptionsExpansion },
  } = useContext(VisualiserContext);

  const handleReset = useCallback(() => {
    controller.resetDataStructure();
  }, [controller]);

  const handleGenerate = useCallback(() => {
    controller.generateDataStructure();
  }, [controller]);

  const handleSave = () => {
    const owner = localStorage.getItem('user');
    if (!owner) {
      alert('Please Log In to Save');
      return;
    }

    const data = {
      owner,
      type: topicTitle,
      data: controller.getData(),
    };
    axios
      .post(`${SERVER_URL}/api/save`, data)
      .then((response) => {
        console.log('Data saved:', response.data);
        alert('Saved');
      })
      .catch((error) => {
        console.error('Error saving data structure:', error);
      });
  };

  // Get data structures saved under user.
  const handleLoad = () => {
    axios
      .get(`${SERVER_URL}/api/getOwnedData`, {
        params: { topicTitle: topicTitle, user: localStorage.getItem('user') },
      })
      .then((response) => {
        // Handle the response data
        setLoadOptions(
          response.data.map((item, index: number) => ({
            key: index,
            name: item.owner,
            type: item.type,
            data: item.data,
          }))
        );
        handleSetLoadOptionsExpansion(true);
      })
      .catch((error) => {
        // Handle the error
        console.error('Error saving data structure:', error);
      });
  };

  const load = (data: number[]) => {
    controller.loadData(data);
    handleSetLoadOptionsExpansion(false);
  };

  // for developing purpoeses only to clear datastructures
  const clearDb = () => {
    axios
      .delete(`${SERVER_URL}/api/deleteAll`, {
        data: {
          owner: 'Hanyuan Li',
        },
      })
      .then((response) => {
        alert('cleared db');
      })
      .catch((error) => {
        // Handle the error
        console.error('Error deleting everything:', error);
      });
  };

  const location = useLocation();
  const showLink = () => {
    const pieces = location.pathname.split('/');
    const dataString = controller
      .getData()
      .map((x: number) => x.toString().padStart(2, '0'))
      .join('');

    alert(`http://localhost:3000/${pieces[1]}/${pieces[2]}/${dataString}`);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      position="absolute"
      width="200px"
      top="80px"
      right="10px"
      gap="10px"
    >
      <MenuButton onClick={handleGenerate}>
        <Typography color="textPrimary" whiteSpace="nowrap">
          Create New
        </Typography>
      </MenuButton>
      <MenuButton onClick={handleReset}>
        <Typography color="textPrimary" whiteSpace="nowrap">
          Reset All
        </Typography>
      </MenuButton>
      <LoadingButton onClick={clearDb}>
        <Typography color="textPrimary" whiteSpace="nowrap">
          Clear DB
        </Typography>
      </LoadingButton>
      <LoadingButton onClick={handleSave}>
        <Typography color="textPrimary" whiteSpace="nowrap">
          Save
        </Typography>
      </LoadingButton>
      <LoadingButton onClick={handleLoad}>
        <Typography color="textPrimary" whiteSpace="nowrap">
          Load
        </Typography>
      </LoadingButton>
      {isLoadOptionsExpanded ? (
        <LoadOptions
          options={loadOptions}
          handleLoad={load}
          handleToggleExpansion={() => {
            handleSetLoadOptionsExpansion(false);
          }}
        />
      ) : null}
      <MenuButton onClick={showLink}>
        <Typography color="textPrimary" whiteSpace="nowrap">
          Create Link
        </Typography>
      </MenuButton>
      {isLoadOptionsExpanded ? (
        <MenuButton onClick={showLink}>
          <Typography color="textPrimary" whiteSpace="nowrap">
            text
          </Typography>
        </MenuButton>
      ) : null}
    </Box>
  );
};

export default CreateMenu;
