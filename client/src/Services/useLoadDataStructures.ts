import { useState } from 'react';
import axios from 'axios';
import { SERVER_URL } from '@/utils/constants';

type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

export interface LoadOption {
  key: number;
  owner: string;
  type: string;
  name: string;
  data: number[];
}

interface RawLoadOption {
  owner: string;
  type: string;
  name: string;
  data: number[];
}

export const useLoadDataStructures = () => {
  const [options, setOptions] = useState<LoadOption[]>([]);
  const [status, setStatus] = useState<LoadStatus>('idle');

  const fetchOptions = (topic: string | null, user: string | null) => {
    setStatus('loading');
    return axios
      .get(`${SERVER_URL}/api/getOwnedData`, { params: { topicTitle: topic, user } })
      .then((response) => {
        setOptions(
          response.data.map((item: RawLoadOption, index: number) => ({
            key: index,
            owner: item.owner,
            type: item.type,
            name: item.name,
            data: item.data,
          }))
        );
        setStatus('success');
      })
      .catch((error) => {
        console.error('Error Loading data structure:', error);
        setStatus('error');
      });
  };

  return { options, status, fetchOptions };
};
