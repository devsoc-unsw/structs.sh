import { ChangeEvent, FC, useContext, useState } from 'react';
import { Box, Collapse, ListItem, Theme, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { styled, useTheme } from '@mui/material/styles';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import VisualiserContext from './VisualiserContext';

interface OperationDetailsProps {
  command: string;
  handleTimelineUpdate: (val: number) => void;
  handleUpdateIsPlaying: (val: boolean) => void;
  handleSetCodeSnippetExpansion: (val: boolean) => void;
}

const OperationExpandButton = styled(Button)({
  textTransform: 'none',
  display: 'flex',
  justifyContent: 'space-between',
});

const StyledListItem = styled(ListItem)({
  height: 50,
  padding: 0,
});

/**
 * Contains the input for an operation, the button to execute them and error messages
 */
const OperationDetails: FC<OperationDetailsProps> = ({
  command,
  handleTimelineUpdate,
  handleUpdateIsPlaying,
  handleSetCodeSnippetExpansion,
}) => {
  const {
    controller,
    // timeline: { handleTimelineUpdate, handleUpdateIsPlaying },
    // codeSnippet: { handleSetCodeSnippetExpansion },
  } = useContext(VisualiserContext);
  const theme: Theme = useTheme();

  const [shouldDisplay, setShouldDisplay] = useState<boolean>(false);
  const [currentInputs, setCurrentInputs] = useState<string[]>(
    Array(controller.documentation[command]?.args?.length || 0).fill('')
  );
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleToggleDisplay = () => {
    setShouldDisplay(!shouldDisplay);
  };

  const handleSetArguments = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const newArgs = [...currentInputs];
    newArgs[index] = String(e.target.value);
    setCurrentInputs(newArgs);
  };

  const clearArguments = () => {
    const newArgs = [...currentInputs];
    newArgs.fill('');
    setCurrentInputs(newArgs);
  };

  const executeCommand = (args: string[]) => {
    const err = controller.doOperation(command, handleTimelineUpdate, ...args);
    setErrorMessage(err);
    if (err !== '') {
      setTimeout(() => setErrorMessage(''), 2000);
    } else if (!controller.documentation[command]?.noTimeline) {
      handleSetCodeSnippetExpansion(true);
      handleUpdateIsPlaying(true);
    }
    clearArguments();
  };

  return (
    <StyledListItem>
      <Box width="180px">
        <OperationExpandButton
          onClick={handleToggleDisplay}
          color="inherit"
          endIcon={shouldDisplay ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          fullWidth
        >
          <Typography>{command}</Typography>
        </OperationExpandButton>
      </Box>
      <Collapse in={shouldDisplay} timeout="auto" orientation="horizontal">
        <Box display="flex" alignItems="center">
          {controller.documentation[command].args.map((eachArg, idx) => (
            <Box key={idx} boxSizing="border-box" padding="5px" width="110px">
              <TextField
                size="small"
                value={currentInputs[idx]}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    executeCommand(currentInputs);
                  }
                }}
                onChange={(e) => handleSetArguments(e, idx)}
                placeholder={eachArg}
                sx={{ backgroundColor: theme.palette.primary.main }}
              />
            </Box>
          ))}
          <Box
            boxSizing="border-box"
            display="flex"
            alignItems="center"
            paddingRight="10px"
            paddingLeft="5px"
          >
            <Button
              variant="contained"
              onClick={() => {
                executeCommand(currentInputs);
              }}
            >
              Run
            </Button>
            <Typography color="red" marginLeft="10px">
              {errorMessage}
            </Typography>
          </Box>
        </Box>
      </Collapse>
    </StyledListItem>
  );
};

export default OperationDetails;
