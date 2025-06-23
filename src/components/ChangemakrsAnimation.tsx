'use client';

import { useEffect, useRef } from 'react';
import { DotLottie } from '@lottiefiles/dotlottie-web';

interface Props {
  sessionCount: number;
}

export default function ChangemakrsAnimation({ sessionCount }: Props) {
  const playerRef = useRef<DotLottie | null>(null);

  useEffect(() => {
  const canvas = document.getElementById('dotlottie-canvas') as HTMLCanvasElement;
  if (!canvas) return;

  const player = new DotLottie({
    autoplay: false,
    loop: false,
    canvas,
    src: 'https://lottie.host/09960d68-3550-4f23-a1d7-0b7fafe62245/iZQAuRWIMD.lottie',
  });

  player.addEventListener('load', () => {
    playerRef.current = player;

    const sectionIndex = (sessionCount - 1) % 5;
    const segments = [
      [1, 29],
      [30, 59],
      [60, 89],
      [90, 119],
      [120, 179],
    ];
    const [start, end] = segments[sectionIndex] || [0, 0];

    player.setSegment(start, end);
    player.play();
  });

  // Optional: handle errors here if DotLottie supports error events in the future

  return () => {
    player.destroy(); // Clean up on unmount
  };
}, [sessionCount]);


  return (
    <div>
      <canvas
  id="dotlottie-canvas"
  width="900"
  height="900"
  style={{ width: '450px', height: '450px' }}
/>
    </div>
  );
}
