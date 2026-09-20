'use client';

import { VStack, HStack } from '@astryxdesign/core/Layout';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Card } from '@astryxdesign/core/Card';
import { Button } from '@astryxdesign/core/Button';
import { Icon } from '@astryxdesign/core/Icon';

export default function TenantDashboard() {
  return (
    <VStack gap={6} xstyle={{ padding: 24, minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <HStack xstyle={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <VStack>
          <Heading level={2}>Sunrise PG</Heading>
          <Text color="secondary">Room 204B, Tower A</Text>
        </VStack>
        <Icon name="notifications" size={28} />
      </HStack>

      <Card>
        <VStack gap={4} xstyle={{ padding: 20 }}>
          <HStack xstyle={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <VStack>
              <Text type="supporting" color="secondary">Rent Due</Text>
              <Heading level={3}>₹8,500</Heading>
              <Text color="secondary">Due by 5th Oct</Text>
            </VStack>
            <Icon name="payment" size={32} />
          </HStack>
          <HStack gap={4}>
            <Button label="Pay via UPI" variant="primary" xstyle={{ flex: 1 }} />
            <Button label="I paid cash" variant="secondary" xstyle={{ flex: 1 }} />
          </HStack>
        </VStack>
      </Card>

      <Card>
        <VStack gap={4} xstyle={{ padding: 20 }}>
          <HStack gap={2} xstyle={{ alignItems: 'center' }}>
            <Icon name="restaurant" size={20} />
            <Heading level={4}>Today's Menu</Heading>
          </HStack>
          <HStack xstyle={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <VStack>
              <Text weight="bold">Lunch</Text>
              <Text color="secondary">Paneer, Dal, Roti</Text>
            </VStack>
            <Button label="Opt Out" variant="secondary" />
          </HStack>
          <HStack xstyle={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <VStack>
              <Text weight="bold">Dinner</Text>
              <Text color="secondary">Aloo Gobi, Rice</Text>
            </VStack>
            <Button label="Opt Out" variant="secondary" />
          </HStack>
        </VStack>
      </Card>

      <Heading level={4} xstyle={{ marginTop: 12 }}>Quick Actions</Heading>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <VStack gap={2} xstyle={{ alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Icon name="build" size={28} />
          <Text type="supporting">Issue</Text>
        </VStack>
        <VStack gap={2} xstyle={{ alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Icon name="cleaning_services" size={28} />
          <Text type="supporting">Clean</Text>
        </VStack>
        <VStack gap={2} xstyle={{ alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Icon name="event_busy" size={28} />
          <Text type="supporting">Leave</Text>
        </VStack>
        <VStack gap={2} xstyle={{ alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Icon name="local_laundry_service" size={28} />
          <Text type="supporting">Laundry</Text>
        </VStack>
        <VStack gap={2} xstyle={{ alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Icon name="wifi" size={28} />
          <Text type="supporting">WiFi</Text>
        </VStack>
        <VStack gap={2} xstyle={{ alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Icon name="contacts" size={28} />
          <Text type="supporting">Contacts</Text>
        </VStack>
      </div>
    </VStack>
  );
}
