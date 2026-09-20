'use client';

import { useRouter } from 'next/navigation';
import { VStack, HStack } from '@astryxdesign/core/Layout';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { ClickableCard } from '@astryxdesign/core/ClickableCard';
import { Icon } from '@astryxdesign/core/Icon';
import { useState } from 'react';
import { BottomSheet } from '@astryxdesign/core/BottomSheet';
import { Button } from '@astryxdesign/core/Button';

export default function PersonaPicker() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const handleSelect = (role: string) => {
    if (role === 'Tenant') {
      router.push('/login');
    } else {
      setSelectedRole(role);
      setIsOpen(true);
    }
  };

  return (
    <>
      <VStack gap={6} xstyle={{ padding: 24, minHeight: '100vh', justifyContent: 'center' }}>
        <VStack gap={2}>
          <Heading level={2}>Welcome to PG Wonders</Heading>
          <Text color="secondary">Choose how you want to continue</Text>
        </VStack>

        <VStack gap={4}>
          <ClickableCard onClick={() => handleSelect('Tenant')}>
            <HStack gap={4} xstyle={{ alignItems: 'center', padding: 16 }}>
              <Icon name="home" size={24} />
              <VStack gap={1}>
                <Text weight="bold">Tenant</Text>
                <Text type="supporting" color="secondary">Staying at a PG, or looking to join one</Text>
              </VStack>
            </HStack>
          </ClickableCard>

          <ClickableCard onClick={() => handleSelect('Manager')}>
            <HStack gap={4} xstyle={{ alignItems: 'center', padding: 16 }}>
              <Icon name="person" size={24} />
              <VStack gap={1}>
                <Text weight="bold">Manager</Text>
                <Text type="supporting" color="secondary">Managing daily operations</Text>
              </VStack>
            </HStack>
          </ClickableCard>

          <ClickableCard onClick={() => handleSelect('Staff')}>
            <HStack gap={4} xstyle={{ alignItems: 'center', padding: 16 }}>
              <Icon name="build" size={24} />
              <VStack gap={1}>
                <Text weight="bold">Staff</Text>
                <Text type="supporting" color="secondary">Housekeeping, maintenance, etc.</Text>
              </VStack>
            </HStack>
          </ClickableCard>

          <ClickableCard onClick={() => handleSelect('Owner')}>
            <HStack gap={4} xstyle={{ alignItems: 'center', padding: 16 }}>
              <Icon name="business" size={24} />
              <VStack gap={1}>
                <Text weight="bold">Owner</Text>
                <Text type="supporting" color="secondary">Managing multiple properties</Text>
              </VStack>
            </HStack>
          </ClickableCard>
          
          <ClickableCard onClick={() => handleSelect('Sales')}>
            <HStack gap={4} xstyle={{ alignItems: 'center', padding: 16 }}>
              <Icon name="tag" size={24} />
              <VStack gap={1}>
                <Text weight="bold">Sales</Text>
                <Text type="supporting" color="secondary">Onboarding and leads</Text>
              </VStack>
            </HStack>
          </ClickableCard>
        </VStack>
      </VStack>

      <BottomSheet isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <VStack gap={4} xstyle={{ padding: 24 }}>
          <Heading level={3}>Not in this build</Heading>
          <Text>This role isn't part of this build. Only the Tenant flow is available right now.</Text>
          <Button label="Got it" onClick={() => setIsOpen(false)} />
        </VStack>
      </BottomSheet>
    </>
  );
}
