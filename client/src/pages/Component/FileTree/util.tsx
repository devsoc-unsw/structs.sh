import axios from 'axios';
import { SERVER_URL } from 'utils/constants';

export const PLACEHOLDER_WORKSPACE = 'PLACEHOLDER_WORKSPACE';
export const PLACEHOLDER_USERNAME = 'benp123';

// Use this on login
export const loadWorkspaces = async (username) => {
  let workspaces = [];
  await axios
    .get(`${SERVER_URL}/api/retrieveWorkspaces`, {
      params: {
        username: 'benp123',
      },
    })
    .then((response) => {
      if (response.data.hasOwnProperty('error')) {
        return workspaces;
      }

      workspaces = response.data.workspaces;
    });

  return workspaces;
};

export const loadCode = async (program, username, workspaceName) => {
  let code = '// Write your code here!!!!!';
  if (program == '') {
    return code;
  }

  await axios
    .get(`${SERVER_URL}/api/retrieveFile`, {
      params: {
        username,
        workspace: workspaceName,
        filename: program,
      },
    })
    .then((response) => {
      code = response.data.content;
      if (response.data.hasOwnProperty('error')) {
        return code;
      }

      code = response.data.content;
    });

  return code;
};
