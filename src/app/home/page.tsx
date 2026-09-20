'use client';

import { VStack, HStack } from '@astryxdesign/core/Layout';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Card } from '@astryxdesign/core/Card';
import { Button } from '@astryxdesign/core/Button';
import { Icon } from '@astryxdesign/core/Icon';

export default function ProspectHome() {
  return (
    <VStack gap={6} xstyle={{ padding: 24, minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <VStack gap={1}>
        <Heading level={2}>Home</Heading>
        <Text color="secondary">Welcome to PG Wonders</Text>
      </VStack>

      <Card>
        <VStack gap={4} xstyle={{ padding: 20 }}>
          <HStack gap={4} xstyle={{ alignItems: 'center' }}>
            <Icon icon="search" size={24} />
            <VStack gap={1}>
              <Heading level={4}>Join a PG</Heading>
              <Text type="supporting" color="secondary">Have a code from your owner?</Text>
            </VStack>
          </HStack>
          <Button label="Enter PG Code" variant="primary" onClick={() => window.location.href = '/join'} />
          <Button label="Scan QR" variant="secondary" />
        </VStack>
      </Card>

      <Card>
        <VStack gap={4} xstyle={{ padding: 20 }}>
          <Heading level={4}>My Requests</Heading>
          <VStack gap={2} xstyle={{ alignItems: 'center', padding: 20 }}>
            <Icon icon="assignment" size={32} />
            <Text color="secondary" xstyle={{ textAlign: 'center' }}>
              You don't have any pending requests. Ask your PG owner for their PG Wonders code.
            </Text>
          </VStack>
        </VStack>
      </Card>

      <Card>
        <VStack gap={4} xstyle={{ padding: 20, opacity: 0.7 }}>
          <HStack xstyle={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Heading level={4}>Explore PGs near you</Heading>
            <Text type="supporting" color="secondary">Coming soon</Text>
          </HStack>
          <Text color="secondary">Find verified PGs in your area. This feature is rolling out soon.</Text>
        </VStack>
      </Card>
    </VStack>
  );
}
