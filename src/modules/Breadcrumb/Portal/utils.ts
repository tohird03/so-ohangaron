export type PropsOffsetReturn = {
  offset: DOMRect;
  bottomMiddle: {
    top: number;
    left: number;
  };
  topMiddle: {
    top: number;
    left: number;
  };
};

export const getOffset = (element: HTMLElement): PropsOffsetReturn => {
  const offset = element.getBoundingClientRect();
  const bottomMiddle = {
    top: offset.top + offset.height,
    left: offset.left + offset.width / 2,
  };
  const topMiddle = {
    top: offset.top,
    left: offset.left + offset.width / 2,
  };

  return {
    offset,
    bottomMiddle,
    topMiddle,
  };
};
