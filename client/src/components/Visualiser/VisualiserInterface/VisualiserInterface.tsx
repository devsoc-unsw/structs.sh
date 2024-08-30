import { FC, useCallback, useMemo, useEffect, useRef, useState } from 'react';
import { Documentation } from 'visualiser-src/common/typedefs';
import VisualiserController from 'visualiser-src/controller/VisualiserController';
import VisualiserContext from './VisualiserContext';
import Controls from './Controls';
import Operations from './Operations';
import CodeSnippet from './CodeSnippet';
import CreateMenu from './CreateMenu';
import { Alert, Box, List } from '@mui/material';
import FloatingWindow from 'components/FloatingWindow';
import OperationDetails from './OperationDetails';

interface VisualiserInterfaceProps {
  topicTitle: string;
  data: number[];
}

const controller = new VisualiserController();

/**
 * The component responsible for connecting the visualiser source code with the
 * React client.
 *   - Contains the controller and form.
 *   - Initialises the visualiser and 'puts' it onto the DOM. It relies on
 *     the corresponding <VisualiserCanvas /> component being there.
 *   - Defines a bunch of callbacks to that call visualiser methods and passes
 *     them off to the controller components (basically the play/pause buttons,
 *     sliders, etc.).
 */
const VisualiserInterface: FC<VisualiserInterfaceProps> = ({ topicTitle, data }) => {
  const [documentation, setDocumentation] = useState<Documentation>({});
  const [isTimelineComplete, setIsTimelineComplete] = useState<boolean>(false);
  const [isCodeSnippetExpanded, setIsCodeSnippetExpanded] = useState<boolean>(false);
  const [isOperationsExpanded, setIsOperationsExpanded] = useState<boolean>(true);
  // const [isLoadOptionsExpanded, setIsLoadOptionsExpanded] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    controller.applyTopicTitle(topicTitle);
    setDocumentation(controller.documentation);
    setIsCodeSnippetExpanded(false);
    if (data) {
      controller.loadData(data);
    }
  }, [topicTitle]);

  const handleTimelineUpdate = useCallback((val: number) => {
    const timelineSlider = document.querySelector('#timelineSlider') as HTMLInputElement;
    timelineSlider.value = String(val);
    timelineSlider.style.background = `linear-gradient(to right, #39AF8E ${val}%, #aeabba ${val}%)`;
    setIsTimelineComplete(val >= 100);
  }, []);

  const handleSetCodeSnippetExpansion = useCallback((val: boolean) => {
    setIsCodeSnippetExpanded(val);
  }, []);

  const handleSetOperationsExpansion = useCallback((val: boolean) => {
    setIsOperationsExpanded(val);
  }, []);

  // const handleSetLoadOptionsExpansion = useCallback((val: boolean) => {
  //   setIsLoadOptionsExpanded(val);
  // }, []);

  const handleUpdateIsPlaying = useCallback((val: boolean) => {
    setIsPlaying(val);
  }, []);

  // const contextValues = useMemo(
  //   () => ({
  //     controller: controllerRef.current,
  //     topicTitle,
  //     // documentation,
  //     timeline: { isTimelineComplete, handleTimelineUpdate, isPlaying, handleUpdateIsPlaying },
  //     codeSnippet: { isCodeSnippetExpanded, handleSetCodeSnippetExpansion },
  //     loadOptionsContext: { isLoadOptionsExpanded, handleSetLoadOptionsExpansion },
  //   }),
  //   [
  //     controllerRef.current,
  //     topicTitle,
  //     // documentation,
  //     isTimelineComplete,
  //     handleTimelineUpdate,
  //     isPlaying,
  //     handleUpdateIsPlaying,
  //     isCodeSnippetExpanded,
  //     handleSetCodeSnippetExpansion,
  //     isLoadOptionsExpanded,
  //     handleSetLoadOptionsExpansion,
  //   ]
  // );
  // const contextValues = useMemo(() => ({ controller: controllerRef.current }), []);

  // FIXME: The react components don't have to be this modular: operations and codesnippet aren't going to be re-used

  return (
    <VisualiserContext.Provider value={{ controller, documentation }}>
      <CreateMenu />
      {/* Operations */}
      {/* {!controller.documentation ? ( */}
      {/*   <Alert severity="error"> */}
      {/*     No operations are defined for the topicTitle &apos; */}
      {/*     {controller.getTopicTitle()} */}
      {/*     &apos; */}
      {/*   </Alert> */}
      {/* ) : ( */}
      {!documentation || (
        <FloatingWindow
          flexDirection="row"
          isExpanded={isOperationsExpanded}
          handleToggleExpansion={() => handleSetOperationsExpansion(!isOperationsExpanded)}
        >
          <List>
            {Object.keys(documentation).map((command) => (
              <OperationDetails
                key={documentation[command].id}
                command={command}
                handleTimelineUpdate={handleTimelineUpdate}
                handleUpdateIsPlaying={handleUpdateIsPlaying}
                handleSetCodeSnippetExpansion={handleSetCodeSnippetExpansion}
              />
            ))}
          </List>
        </FloatingWindow>
      )}
      {/* )} */}
      {/* Code Snippet */}
      <FloatingWindow
        flexDirection="row-reverse"
        minHeight="30vh"
        isExpanded={isCodeSnippetExpanded}
        handleToggleExpansion={() => handleSetCodeSnippetExpansion(!isCodeSnippetExpanded)}
      >
        <Box id="code-container">
          <svg id="code-canvas" />
        </Box>
      </FloatingWindow>
      <Controls
        isTimelineComplete={isTimelineComplete}
        handleTimelineUpdate={handleTimelineUpdate}
        isPlaying={isPlaying}
        handleUpdateIsPlaying={handleUpdateIsPlaying}
      />
    </VisualiserContext.Provider>
  );
};

export default VisualiserInterface;
