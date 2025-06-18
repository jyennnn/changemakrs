'use client';


import { useEffect, useRef } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface Props {
  sessionCount: number;
  triggerPlay: boolean; // set to true after user logs a new session
}

export default function ChangemakrsAnimation() {
  return (
    <div className="flex justify-center">
      <DotLottieReact
        src="https://lottie.host/09960d68-3550-4f23-a1d7-0b7fafe62245/iZQAuRWIMD.lottie"
        loop
        autoplay
        style={{ width: 300, height: 300 }}
      />
    </div>
  );
}

