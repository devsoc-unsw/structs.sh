import { useRef, useEffect } from 'react';
import styles from '@/styles/DevelopmentMode.module.css';
import globalStyles from '@/styles/global.module.css';
import classNames from 'classnames';
import { Tabs, Tab } from '@/components/Tabs';
import Console from '@/visualiser-debugger/Component/Console/Console';
import Joyride from 'react-joyride';
import DynamicTabs from '@/components/TabResize/DynamicTabs';
import useSocketClientStore from '@/Services/socketClient';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import DevelopmentModeNavbar from '@/components/Navbars/DevelopmentModeNavbar';
import { createDebuggerTheme } from '@/structsThemes';
import Configuration from './Component/Configuration/Configuration';
import Controls from './Component/Control/Controls';
import CodeEditor from './Component/CodeEditor/CodeEditor';
import StackInspector from './Component/StackInspector/StackInspector';
import VisualizerMain from './Component/VisualizerMain';
import FileManager from './Component/FileTree/FileManager';
import { useGlobalStore } from './Store/globalStateStore';
import { useUserFsStateStore } from './Store/userFsStateStore';
import { onboardingStore, handleJoyrideCallback, OPEN_FILE_STEP } from './Store/onboardingStore';
import { ThemeProvider as CustomThemeProvider, useTheme } from './Contexts/ThemeContexts';

const DevelopmentModeContent = () => {
  const inputElement = useRef<HTMLInputElement>(null);
  const { uiState, updateCurrFocusedTab } = useGlobalStore();
  const { run, stepIndex, steps, onboardingCurrFile } = onboardingStore();
  const { resetRootPaths } = useUserFsStateStore();
  const { darkMode } = useTheme();
  const debuggerTheme = createDebuggerTheme(darkMode);

  const scrollToBottom = () => {
    if (inputElement?.current?.parentElement) {
      const container = inputElement.current.parentElement;
      container.scrollTop = container.scrollHeight;
    }
  };

  const initialise = useSocketClientStore((state) => state.initialise);
  const disconnect = useSocketClientStore((state) => state.disconnect);

  // Onboarding Code
  useEffect(() => {
    if (onboardingCurrFile) {
      if (onboardingStore.getState().stepIndex === OPEN_FILE_STEP) {
        onboardingStore.getState().setRun(false);
        onboardingStore.getState().setStepIndex(10);
      }
    }
  }, [onboardingCurrFile]);

  // initialising socket cycle
  useEffect(() => {
    // intialise socket Connection
    console.log('DevelopmentMode is mounted');
    initialise();

    // disconnect socket connection
    return () => {
      console.log('DevelopmentMode is unmounted');
      disconnect();
    };
  }, [initialise, disconnect]);

  const handleClickStart = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    resetRootPaths();
    onboardingStore.getState().setRun(true);
  };

  return (
    <div className={classNames(globalStyles.root, darkMode ? styles.dark : styles.light)}>
      <MuiThemeProvider theme={debuggerTheme}>
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
            className={classNames('Onboarding-sidebar', styles.pane, styles.files)}
            style={{ overflowY: 'scroll' }}
          >
            <div className={styles.icon}>
              <FileManager />
            </div>
            <div
              style={{
                fontSize: 'small',
                marginTop: '1.6rem',
                color: 'rgb(85, 85, 85)',
              }}
            />
          </div>
          <div className={classNames('Onboarding-codeEditor', styles.editor)}>
            <DynamicTabs direction="vertical" minHeightRatio={[0.1, 0.2]} initialSize="100%">
              <CodeEditor />
              <Console scrollToBottom={scrollToBottom} />
            </DynamicTabs>
          </div>
          <div className={classNames('Onboarding-inspectionMenu', styles.pane, styles.inspector)}>
            <Tabs value={uiState.currFocusedTab} onValueChange={updateCurrFocusedTab}>
              <Tab label="Configure">
                <div
                  className={classNames('Onboarding-configureMenu', styles.pane)}
                  style={{ overflow: 'scroll' }}
                >
                  <Configuration />
                </div>
              </Tab>
              <Tab label="Inspect">
                <StackInspector />
              </Tab>
            </Tabs>
          </div>
          <div className={classNames('Onboarding-visualiserBox', styles.pane, styles.visualiser)}>
            <VisualizerMain />
          </div>
          <div className={classNames(styles.pane, styles.timeline)}>
            <Controls />
          </div>
        </div>
      </MuiThemeProvider>
    </div>
  );
};

const DevelopmentMode = () => (
  <CustomThemeProvider>
    <DevelopmentModeContent />
  </CustomThemeProvider>
);

export default DevelopmentMode;
