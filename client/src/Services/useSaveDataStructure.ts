import { useState } from 'react';
import axios from 'axios';
import { SERVER_URL } from '@/utils/constants';

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

interface SaveParams {
  owner: string;
  topic: string | null;
  name: string;
  data: unknown;
}

export const useSaveDataStructure = () => {
  const [status, setStatus] = useState<SaveStatus>('idle');

  const save = (params: SaveParams) => {
    setStatus('saving');
    return axios
      .post(`${SERVER_URL}/api/save`, {
        owner: params.owner,
        type: params.topic,
        name: params.name,
        data: params.data,
      })
      .then(() => {
        setStatus('success');
      })
      .catch((error) => {
        console.error('Error saving data structure:', error);
        setStatus('error');
      });
  };

  return { save, status };
};
