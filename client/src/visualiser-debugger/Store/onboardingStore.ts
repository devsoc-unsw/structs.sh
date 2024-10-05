// onboardingStore
import { ACTIONS, CallBackProps, EVENTS, STATUS, Step } from 'react-joyride';
import create from 'zustand';

function logGroup(type: string, data: any) {
  console.groupCollapsed(type);
  console.log(data);
  console.groupEnd();
}

const onboardingSteps: Step[] = [
  // step 1
  {
    content:
      'This is Structs.sh, a student-developed project that aims to push the limits of algorithm visualisation!',
    placement: 'center',
    target: 'body',
    title: 'Welcome to Structs.sh',
    disableScrolling: true,
    disableScrollParentFix: true,
  },
  // step 2
  {
    content:
      'You can access this onboarding at any time if you ever get stuck. Additionally, you can also use the dropdown menu for any specific feature. Please press skip if you wish to end the onboarding process early',
    placement: 'auto',
    target: '.onboardingButton',
    title: 'The Onboarding Menu',
    spotlightPadding: 0,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
    disableScrolling: true,
    disableScrollParentFix: true,
  },
  // step 3
  {
    content: 'This is the workspace feature, where you can store your code in different C files.',
    target: '.workspace',
    placement: 'right',
    spotlightPadding: 0,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
    title: 'Sidebar',
    disableScrolling: true,
    disableScrollParentFix: true,
  },
  // step 4
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
    disableScrolling: true,
    disableScrollParentFix: true,
  },
  // step 5
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
    disableScrolling: true,
    disableScrollParentFix: true,
  },
  // step 6
  {
    content: 'You can see any files or folders you have created by opening the root directory.',
    placement: 'right',
    target: '.rootContent',
    title: 'The Root Directory',
    spotlightPadding: 0,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
    disableScrolling: true,
    disableScrollParentFix: true,
  },
  // step 7
  {
    content:
      'Lets open a file for demonstration purposes. Please start by opening the root directory.',
    placement: 'right',
    target: '.rootContent',
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
    disableScrolling: true,
    disableScrollParentFix: true,
  },
  // step 8
  {
    content:
      'Any files created will be placed in the most recently opened folder, defaulting to the root directory.',
    placement: 'right',
    target: '.rootContent',
    title: 'Root Directory Content',
    spotlightPadding: 0,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
    disableScrolling: true,
    disableScrollParentFix: true,
  },
  // step 9
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
    disableScrolling: true,
    disableScrollParentFix: true,
  },
  // step 10
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
    disableScrolling: true,
    disableScrollParentFix: true,
  },
  // step 11
  {
    content:
      'After you are finished writing your code, you can compile by pressing this button. Why not give it a press?',
    placement: 'top',
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
    disableScrolling: true,
    disableScrollParentFix: true,
  },
  // step 12
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
    disableScrolling: true,
    disableScrollParentFix: true,
  },
  // step 13
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
    disableScrolling: true,
    disableScrollParentFix: true,
  },
  // step 14
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
    disableScrolling: true,
    disableScrollParentFix: true,
  },
  // step 15
  {
    content:
      'To visualise the code, press this button to buffer the visualisation states. Use the buttons and sliders to then proceed between each visualisation state.',
    placement: 'right',
    target: '.playButton',
    title: 'How to Visualise the Code',
    spotlightPadding: 0,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
    disableScrolling: true,
    disableScrollParentFix: true,
  },
  // step 16
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
    disableScrolling: true,
    disableScrollParentFix: true,
  },
  // step 17
  {
    content:
      'And now we are the end of the onboarding. Thank you and we hope that you will enjoy what Structs.sh has to offer. If you have any feedback, please send forward to any members of the Structs subcommittee.',
    placement: 'center',
    target: 'body',
    title: 'Enjoy Structs.sh!',
    disableScrolling: true,
    disableScrollParentFix: true,
  },
];

interface State {
  run: boolean;
  workspaceOpen: boolean;
  stepIndex: number;
  steps: Step[];

  setRun: (value: boolean) => void;
  setWorkspaceOpen: (value: boolean) => void;
  setStepIndex: (index: number) => void;
  setSteps: (steps: Step[]) => void;
}

export const onboardingStore = create<State>((set) => ({
  run: false,
  workspaceOpen: false,
  stepIndex: 0,
  steps: onboardingSteps,

  // Define actions to update the state
  setRun: (value) => set({ run: value }),
  setWorkspaceOpen: (value) => set({ workspaceOpen: value }),
  setStepIndex: (index) => set({ stepIndex: index }),
  setSteps: (steps) => set({ steps }),
}));

export const handleClickStart = (event: React.MouseEvent<HTMLElement>) => {
  event.preventDefault();
  onboardingStore.getState().setRun(true);
};

export const handleJoyrideCallback = (data: CallBackProps) => {
  const { action, index, status, type } = data;
  if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
    onboardingStore.getState().setRun(false);
    onboardingStore.getState().setStepIndex(0);
  } else if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)) {
    const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
    if (onboardingStore.getState().workspaceOpen && index === 6) {
      onboardingStore.getState().setRun(false);
      onboardingStore.getState().setWorkspaceOpen(false);
      onboardingStore.getState().setStepIndex(nextStepIndex);

      setTimeout(() => {
        onboardingStore.getState().setRun(true);
      }, 400);
    } else if (index === 8) {
      onboardingStore.getState().setRun(false);
      onboardingStore.getState().setWorkspaceOpen(false);
      onboardingStore.getState().setStepIndex(nextStepIndex);

      setTimeout(() => {
        onboardingStore.getState().setRun(true);
      }, 400);
    } else if (index === 10) {
      onboardingStore.getState().setRun(false);
      onboardingStore.getState().setWorkspaceOpen(false);
      onboardingStore.getState().setStepIndex(nextStepIndex);

      setTimeout(() => {
        onboardingStore.getState().setRun(true);
      }, 400);
    } else {
      onboardingStore.getState().setWorkspaceOpen(false);
      onboardingStore.getState().setStepIndex(nextStepIndex);
    }
  }
  logGroup(type === EVENTS.TOUR_STATUS ? `${type}:${status}` : type, data);
};

export const handleWorkspaceOpen = () => {
  if (onboardingStore.getState().stepIndex === 6) {
    onboardingStore.getState().setRun(false);
  }
  onboardingStore.getState().setWorkspaceOpen(!onboardingStore.getState().workspaceOpen);
  if (onboardingStore.getState().stepIndex === 6) {
    onboardingStore.getState().setStepIndex(7);
  }
};

export const handleCompileClicked = () => {
  if (onboardingStore.getState().stepIndex === 10) {
    onboardingStore.getState().setRun(false);
  }
  if (onboardingStore.getState().stepIndex === 10) {
    onboardingStore.getState().setStepIndex(11);
  }
};
