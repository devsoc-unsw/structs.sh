import { useRef, useEffect } from 'react';
import styles from 'styles/DevelopmentMode.module.css';
import globalStyles from 'styles/global.module.css';
import classNames from 'classnames';
import { Tabs, Tab } from 'components/Tabs';
import Console from 'visualiser-debugger/Component/Console/Console';
import Joyride from 'react-joyride';
import { useMount } from 'react-use';
// @ts-ignore
import a11yChecker from 'a11y-checker';
import DevelopmentModeNavbar from '../components/Navbars/DevelopmentModeNavbar';
import Configuration from './Component/Configuration/Configuration';
import Controls from './Component/Control/Controls';
import CodeEditor from './Component/CodeEditor/CodeEditor';
import StackInspector from './Component/StackInspector/StackInspector';
import VisualizerMain from './Component/VisualizerMain';
import FileManager from './Component/FileTree/FileManager';
import { useGlobalStore } from './Store/globalStateStore';
import { useSocketCommunication } from '../Services/useSocketCommunication';
import { useFrontendStateStore } from './Store/frontendStateStore';
import { useFileOnboardingStateStore } from './Store/onboardingStateStore';
import {
  onboardingStore,
  handleClickStart,
  handleJoyrideCallback,
  handleWorkspaceOpen,
  handleCompileClicked,
} from './Store/onboardingStore';

const DevelopmentMode = () => {
  const { isActive } = useFrontendStateStore();
  const inputElement = useRef<HTMLInputElement>(null);
  const { uiState, updateCurrFocusedTab } = useGlobalStore();
  const { consoleChunks, setConsoleChunks } = useSocketCommunication();
  const { run, stepIndex, steps } = onboardingStore();

  const handleAddConsoleChunk = (chunk: string) => {
    setConsoleChunks([...consoleChunks, chunk]);
  };

  const scrollToBottom = () => {
    if (inputElement?.current?.parentElement) {
      const container = inputElement.current.parentElement;
      container.scrollTop = container.scrollHeight;
    }
  };

  // Onboarding Code
  const { onboardingCurrFile } = useFileOnboardingStateStore();

  useMount(() => {
    a11yChecker();
  });

  useEffect(() => {
    if (onboardingCurrFile === 'linked_list_delete.c') {
      if (onboardingStore.getState().stepIndex === 8) {
        onboardingStore.getState().setRun(false);
        onboardingStore.getState().setStepIndex(9);
      }
    }
  }, [onboardingCurrFile]);

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
        styles={{
          options: {
            primaryColor: '#6955c8',
          },
        }}
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
          <CodeEditor />
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
                isActive={isActive}
              />
            </Tab>
          </Tabs>
        </div>
        <div className={classNames('visualiserBox', styles.pane, styles.visualiser)}>
          <VisualizerMain />
        </div>
        <div className={classNames(styles.pane, styles.timeline)}>
          <Controls onboardingCompile={handleCompileClicked} />
        </div>
      </div>
    </div>
  );
};

export default DevelopmentMode;
