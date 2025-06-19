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

      if (sessionCount === 0) {
        player.setSegment(0, 0);
        player.play(); 
        return;
      }

      const sectionIndex = (sessionCount - 1) % 5;

      let start = 0;
      let end = 0;

      switch (sectionIndex) {
        case 0:
          start = 1;
          end = 29;
          break;
        case 1:
          start = 30;
          end = 59;
          break;
        case 2:
          start = 60;
          end = 89;
          break;
        case 3:
          start = 90;
          end = 119;
          break;
        case 4:
          start = 120;
          end = 179;
          break;
      }

      player.setSegment(start, end);
      player.play();
    });
  }, [sessionCount]);

  return (
    <div>
      <canvas
        id="dotlottie-canvas"
      />
    </div>
  );
}
