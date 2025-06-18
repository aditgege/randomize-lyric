import React from 'react';
import { ImageItem } from '../../types';
import MatahariWheel from './MatahariWheel';

// MatahariImage component for timed appearances (keeps existing behavior)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MatahariImage = React.memo<{ item: ImageItem }>(({ item }) => {
  // item parameter is required by interface but not used in wheel animation
  return <MatahariWheel />;
});

export default MatahariImage;
