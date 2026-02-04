'use client';

import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useEffect } from 'react';

export default function MiniKitInit() {
  const { setFrameReady, isFrameReady } = useMiniKit();

  useEffect(() => {
    if (!isFrameReady) setFrameReady();
  }, [setFrameReady, isFrameReady]);

  return null;
}
