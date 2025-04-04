import {useEffect} from 'react';
import axios, {Canceler, CancelToken} from 'axios';

type TUseRequestAbort = (canselText?: string) => [CancelToken, Canceler, (value: any) => boolean];

export const useRequestAbort: TUseRequestAbort = (canselText = '') => {
  // eslint-disable-next-line import/no-named-as-default-member
  const {CancelToken, isCancel} = axios;
  const {token, cancel} = CancelToken.source();

  useEffect(() => () => {
    cancel(canselText);
  }, []);

  return [token, cancel, isCancel];
};
