// Lyric component for displaying animated text
import React from 'react';
import { LyricItem } from '../types';

interface LyricComponentProps {
  item: LyricItem;
  style: React.CSSProperties;
}

export const LyricComponent = React.memo<LyricComponentProps>(({ item, style }) => (
  <div
    key={item.id}
    style={style}
    className="text-white"
  >
    {item.text}
  </div>
));
