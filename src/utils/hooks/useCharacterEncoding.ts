import {useEffect, useState} from 'react';

export const useCharacterEncoding = () => {
  const [regExFirstName, setRegExFirstName] = useState<boolean>(false);
  const [regExLastName, setRegExLastName] = useState<boolean>(false);

  useEffect(() => {
    if (regExFirstName) {
      setTimeout(() => {
        setRegExFirstName(false);
      }, 6000);
    }

    if (regExLastName) {
      setTimeout(() => {
        setRegExLastName(false);
      }, 4000);
    }
  }, [regExFirstName, regExLastName]);

  return {regExFirstName, regExLastName, setRegExFirstName, setRegExLastName};
};
