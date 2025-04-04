import React, {CSSProperties, useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {getOffset} from './utils';

const childrenElementStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
};

type Props = {
  children: React.ReactNode;
  elementRef?: React.RefObject<HTMLElement>;
};

export const Portal = ({children, elementRef}: Props) => {
  const childElementRef = useRef<HTMLDivElement>(null);
  const [elementStyle, setElementStyle] =
    useState<CSSProperties>(childrenElementStyle);

  useEffect(() => {
    if (!elementRef?.current || !childElementRef.current) {
      return;
    }

    const elementOffset = getOffset(childElementRef.current);
    const innerElementOffset = getOffset(elementRef.current);

    setElementStyle((prev) => ({
      ...prev,
      left:
        innerElementOffset.bottomMiddle.left - elementOffset.offset.width / 2,
      top: innerElementOffset.bottomMiddle.top,
      display: 'block',
    }));
  }, [elementRef?.current, childElementRef.current]);

  return createPortal(
    <div style={{display: 'none', ...elementStyle}} ref={childElementRef}>
      {children}
    </div>,
    document.body
  );
};
