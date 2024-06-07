import axios from 'axios';
import { PLACEHOLDER_USERNAME } from './Util/util';
import { SERVER_URL } from '../../../utils/constants';

export interface FileStub {
  name: string;
  text: string;
}

export class AxiosAgent {
  username: string = PLACEHOLDER_USERNAME;

  retrieveFiles(currWorkSpaceName: string, callback: (files: FileStub[]) => void) {
    axios
      .get(`${SERVER_URL}/api/retrieveFilesInWorkspace`, {
        params: {
          username: PLACEHOLDER_USERNAME,
          workspaceName: currWorkSpaceName,
        },
      })
      .then((response) => {
        console.log('Debugging!!!', response);
        if (!Object.prototype.hasOwnProperty.call(response.data, 'error')) {
          callback(response.data.files);
        } else {
          callback([]);
        }
      })
      .catch((error) => {
        console.error('Error while retrieving files:', error);
        callback([]);
      });
  }

  saveFile(
    currWorkSpaceName: string,
    fileName: string,
    data: string,
    callback: (files: FileStub[]) => void,
    errorCallBack: () => void
  ) {
    axios
      .post(`${SERVER_URL}/api/saveFile`, {
        username: PLACEHOLDER_USERNAME,
        workspace: currWorkSpaceName,
        filename: fileName,
        fileData: data,
      })
      .then((response) => {
        console.log('Debugging!!!', response);
        if (!Object.prototype.hasOwnProperty.call(response.data, 'error')) {
          callback(response.data.files);
        } else {
          errorCallBack();
        }
      })
      .catch((error) => {
        console.error('Error while retrieving files:', error);
        errorCallBack();
      });
  }
}
