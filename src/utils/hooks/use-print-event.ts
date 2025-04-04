import {useState} from 'react';

export const usePrintEvent = (): boolean => {
  const [isPrinted, setIsPrinted] = useState(false);

  addEventListener('beforeprint', () => {
    setIsPrinted(true);
  });

  addEventListener('afterprint', () => {
    setIsPrinted(false);
  });

  return isPrinted;
};
