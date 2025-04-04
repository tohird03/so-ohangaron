import {useEffect, useRef} from 'react';
import {reaction} from 'mobx';

export const useReaction = (expression: any, effect: any, options?: TrueObject) => {
  const expressionRef = useRef(expression);
  const optionsRef = useRef(options);

  useEffect(() => reaction(
    expressionRef.current,
    effect,
    optionsRef.current
  ), [effect]);
};
