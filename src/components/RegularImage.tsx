// Regular image component for basic animations
import React from 'react';
import { ImageItem } from '../types';

interface RegularImageProps {
  item: ImageItem;
  style: React.CSSProperties;
}

export const RegularImage = React.memo<RegularImageProps>(({ item, style }) => (
  <img
    key={item.id}
    src={item.src}
    alt=""
    style={style}
    className="select-none"
  />
));
