'use client';

import {Button} from '@astryxdesign/core/Button';
import {VStack} from '@astryxdesign/core/Layout';

export default function Page() {
  return (
    <VStack gap={2} xstyle={{ padding: 20 }}>
      <h1>Tenant App (Powered by Astryx)</h1>
      <Button label="Hello Astryx" onClick={() => alert('Hi from Tenant App!')} />
    </VStack>
  );
}
