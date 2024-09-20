import { useEffect, useRef } from 'react';
import styles from 'styles/DevelopmentMode.module.css';
import globalStyles from 'styles/global.module.css';
import classNames from 'classnames';
import { Tabs, Tab } from 'components/Tabs';
import Console from 'visualiser-debugger/Component/Console/Console';
import DevelopmentModeNavbar from '../components/Navbars/DevelopmentModeNavbar';
import Configuration from './Component/Configuration/Configuration';
import Controls from './Component/Control/Controls';
import CodeEditor from './Component/CodeEditor/CodeEditor';
import StackInspector from './Component/StackInspector/StackInspector';
import VisualizerMain from './Component/VisualizerMain';
import FileManager from './Component/FileTree/FileManager';
import { useGlobalStore } from './Store/globalStateStore';
import { useSocketCommunication } from '../Services/useSocketCommunication';
import { useUserFsStateStore } from './Store/userFsStateStore';

// Onboarding Imports
import Joyride, { ACTIONS, CallBackProps, EVENTS, STATUS, Step } from 'react-joyride';
import { useMount, useSetState } from 'react-use';
import a11yChecker from 'a11y-checker';
import { useFileOnboardingStateStore } from './Store/onboardingStateStore';

// Onboarding Types
interface State {
  run: boolean;
  workspaceOpen: boolean;
  stepIndex: number;
  steps: Step[];
}

function logGroup(type: string, data: any) {
  console.groupCollapsed(type);
  console.log(data);
  console.groupEnd();
}

const DevelopmentMode = () => {
  const { currFrame } = useGlobalStore();
  const { fileSystem, currFocusFilePath } = useUserFsStateStore();
  const inputElement = useRef(null);
  const { uiState, updateCurrFocusedTab } = useGlobalStore();

  const { activeSession, consoleChunks, setConsoleChunks, sendCode, getNextState } =
    useSocketCommunication();

  const handleAddConsoleChunk = (chunk) => {
    setConsoleChunks([...consoleChunks, chunk]);
  };

  const scrollToBottom = () => {
    if (inputElement.current) {
      const container = inputElement.current.parentElement;
      container.scrollTop = container.scrollHeight;
    }
  };

  // Send code using the hook's sendCode function, passing necessary parameters
  const handleSendCode = () => {
    sendCode(fileSystem, currFocusFilePath);
  };dffffff

  // Onboarding Code
  const { onboardingCurrFile } = useFileOnboardingStateStore();
  const [{ run, workspaceOpen, stepIndex, steps }, setState] = useSetState<State>({
    run: false,
    workspaceOpen: false,
    stepIndex: 0,
    steps: [
      {
        content:
          'This is Structs.sh, a student-developed project that aims to push the limits of algorithm visualisation!',
        placement: 'center',
        target: 'body',
        title: 'Welcome to Structs.sh',
      },
      {
        content:
          'You can access this onboarding at any time if you ever get stuck. Additionally, you can also use the dropdown menu for any specific feature.',
        placement: 'auto',
        target: '.onboardingButton',
        title: 'The Onboarding Menu',
        spotlightPadding: 0,
        styles: {
          options: {
            zIndex: 10000,
          },
        },
      },
      {
        content:
          'This is the workspace feature, where you can store your code in different C files.',
        target: '.workspace',
        placement: 'right',
        spotlightPadding: 0,
        styles: {
          options: {
            zIndex: 10000,
          },
        },
        title: 'Sidebar',
      },
      {
        content: 'You can click this + button to create a new file.',
        placement: 'right',
        target: '.fileButton',
        title: 'File Creation',
        spotlightPadding: 0,
        styles: {
          options: {
            zIndex: 10000,
          },
        },
      },
      {
        content: 'You can click this folder button to create a new folder.',
        placement: 'right',
        target: '.folderButton',
        title: 'Folder Creation',
        spotlightPadding: 0,
        styles: {
          options: {
            zIndex: 10000,
          },
        },
      },
      {
        content: 'You can see any files or folders you have created by opening the root directory.',
        placement: 'right',
        target: '.rootDirectory',
        title: 'The Root Directory',
        spotlightPadding: 0,
        styles: {
          options: {
            zIndex: 10000,
          },
        },
      },
      {
        content:
          'Lets open a file for demonstration purposes. Please start by opening the root directory.',
        placement: 'right',
        target: '.rootDirectory',
        title: 'Opening the Root Directory',
        spotlightPadding: 0,
        styles: {
          options: {
            zIndex: 10000,
          },
        },
        disableOverlayClose: true,
        hideCloseButton: true,
        hideFooter: true,
        spotlightClicks: true,
      },
      {
        content:
          'You can open any folder or file by simply clicking on them. Any files created will be placed in the most recently opened folder, defaulting to the root directory.',
        placement: 'right',
        target: '.rootContent',
        title: 'Root Directory Content',
        spotlightPadding: 0,
        styles: {
          options: {
            zIndex: 10000,
          },
        },
      },
      {
        content: 'Please click on the 2521_Tut02 directory and open the linked_list_delete.c file.',
        placement: 'right',
        target: '.sidebar',
        title: 'Opening a file',
        spotlightPadding: 0,
        styles: {
          options: {
            zIndex: 10000,
          },
        },
        disableOverlayClose: true,
        hideCloseButton: true,
        hideFooter: true,
        spotlightClicks: true,
      },
      {
        content:
          'This is where we visualise our code. You can write and edit like any code editor you would be familiar with.',
        placement: 'right',
        target: '.codeEditor',
        title: 'The Code Editor',
        spotlightPadding: 0,
        styles: {
          options: {
            zIndex: 10000,
          },
        },
      },
      {
        content:
          'After you are finished writing your code, you can compile by pressing this button. Why not give it a press?',
        placement: 'right',
        target: '.compileButton',
        title: 'Compiling the Code',
        spotlightPadding: 0,
        styles: {
          options: {
            zIndex: 10000,
          },
        },
        disableOverlayClose: true,
        hideCloseButton: true,
        hideFooter: true,
        spotlightClicks: true,
      },
      {
        content: 'This is the annotations, where you see the result of your compilation.',
        placement: 'left',
        target: '.inspectionMenu',
        title: 'Compilation Results',
        spotlightPadding: 0,
        styles: {
          options: {
            zIndex: 10000,
          },
        },
      },
      {
        content:
          'The configure menu will show a list of any types and stack variables created by your code execution.',
        placement: 'right',
        target: '.configureMenu',
        title: 'Configure Menu',
        spotlightPadding: 0,
        styles: {
          options: {
            zIndex: 10000,
          },
        },
      },
      {
        content: 'Finally, we can visualise the contents of our code in this box here.',
        placement: 'left',
        target: '.visualiserBox',
        title: 'Visualising the Code',
        spotlightPadding: 0,
        styles: {
          options: {
            zIndex: 10000,
          },
        },
      },
      {
        content: 'To visualise the code, use this button repeatedly to run your code step by step.',
        placement: 'right',
        target: '.nextButton',
        title: 'How to Visualise the Code',
        spotlightPadding: 0,
        styles: {
          options: {
            zIndex: 10000,
          },
        },
      },
      {
        content:
          'As you run the code to visualise, the configure menu will also update with any types or variables added.',
        placement: 'right',
        target: '.configureMenu',
        title: 'Configure Menu Updates',
        spotlightPadding: 0,
        styles: {
          options: {
            zIndex: 10000,
          },
        },
      },
      {
        content:
          'And now we are the end of the onboarding. Thank you and we hope that you will enjoy what Structs.sh has to offer. If you have any feedback, please send forward to any members of the Structs subcommittee.',
        placement: 'center',
        target: 'body',
        title: 'Enjoy Structs.sh!',
      },
    ],
  });

  useMount(() => {
    a11yChecker();
  });

  const handleClickStart = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    console.log('started\n');
    setState({
      run: true,
    });
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;
    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      setState({ run: false, stepIndex: 0 });
    } else if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      if (workspaceOpen && index === 6) {
        setState({
          run: false,
          workspaceOpen: false,
          stepIndex: nextStepIndex,
        });

        setTimeout(() => {
          setState({ run: true });
        }, 400);
      } else if (index === 8) {
        setState({
          run: false,
          workspaceOpen: false,
          stepIndex: nextStepIndex,
        });

        setTimeout(() => {
          setState({ run: true });
        }, 400);
      } else if (index === 10) {
        setState({
          run: false,
          workspaceOpen: false,
          stepIndex: nextStepIndex,
        });

        setTimeout(() => {
          setState({ run: true });
        }, 400);
      } else {
        setState({
          workspaceOpen: false,
          stepIndex: nextStepIndex,
        });
      }
    }
    logGroup(type === EVENTS.TOUR_STATUS ? `${type}:${status}` : type, data);
  };

  const handleWorkspaceOpen = () => {
    setState({
      run: stepIndex === 6 ? false : run,
      workspaceOpen: !workspaceOpen,
      stepIndex: stepIndex === 6 ? 7 : stepIndex,
    });
  };

  useEffect(() => {
    if (onboardingCurrFile === 'linked_list_delete.c') {
      setState({
        run: stepIndex === 8 ? false : run,
        stepIndex: stepIndex === 8 ? 9 : stepIndex,
      });
    }
  }, [onboardingCurrFile]);

  const handleCompileClicked = () => {
    setState({
      run: stepIndex === 10 ? false : run,
      stepIndex: stepIndex === 10 ? 11 : stepIndex,
    });
  };

  return (
    <div className={classNames(globalStyles.root, styles.light)}>
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        run={run}
        scrollToFirstStep
        showProgress
        showSkipButton
        stepIndex={stepIndex}
        steps={steps}
      />
      <div className={styles.layout}>
        <div className={classNames(styles.pane, styles.nav)}>
          <DevelopmentModeNavbar onButtonClick={handleClickStart} />
        </div>
        <div 
          className={classNames('sidebar', styles.pane, styles.files)} 
          style={{ overflowY: 'scroll' }}
        >
          <div className="workspace">
            <FileManager onWorkspaceClick={handleWorkspaceOpen} />
          </div>
          <div
            style={{
              fontSize: 'small',
              marginTop: '1.6rem',
              color: 'rgb(85, 85, 85)',
            }}
          />
        </div>
        <div className={classNames('codeEditor', styles.pane, styles.editor)}>
          <CodeEditor currLine={currFrame?.frame_info?.line_num} />
        </div>
        <div className={classNames('inspectionMenu', styles.pane, styles.inspector)}>
          <Tabs value={uiState.currFocusedTab} onValueChange={updateCurrFocusedTab}>
            <Tab label="Configure">
              <div
                className={classNames('configureMenu', styles.pane)}
                style={{ overflow: 'scroll' }}
              >
                <Configuration />
              </div>
            </Tab>
            <Tab label="Inspect">
              <StackInspector />
            </Tab>
            <Tab label="Console">
              <Console
                chunks={consoleChunks}
                handleAddChunk={handleAddConsoleChunk}
                scrollToBottom={scrollToBottom}
                isActive={activeSession}
              />
            </Tab>
          </Tabs>
        </div>
        <div className={classNames('visualiserBox', styles.pane, styles.visualiser)}>
          <VisualizerMain backendState={currFrame} />
        </div>
        <div className={classNames(styles.pane, styles.timeline)}>
          <Controls
            getNextState={getNextState}
            sendCode={handleSendCode}
            activeSession={activeSession}
            handleCompileClick={handleCompileClicked}
          />
        </div>
      </div>
    </div>
  );
};

export default DevelopmentMode;
