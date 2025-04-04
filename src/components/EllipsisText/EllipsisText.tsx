import React, {CSSProperties, FC} from 'react';
import {Typography} from 'antd';
import type {TextProps} from 'antd/es/typography/Text';

type Props = {
  text: string;
  width: string;
} & TextProps;

export const EllipsisText: FC<Props> = ({text, width, ...props}) => {
  const titleStyle: CSSProperties = {
    cursor: 'pointer',
    width,
  };

  return (
    <Typography.Text
      {...props}
      style={titleStyle}
      ellipsis={{tooltip: true}}
    >
      {text}
    </Typography.Text>
  );
};
