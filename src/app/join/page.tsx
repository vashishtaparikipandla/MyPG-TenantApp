'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { VStack, HStack } from '@astryxdesign/core/Layout';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Button } from '@astryxdesign/core/Button';
import { Icon } from '@astryxdesign/core/Icon';
import { Card } from '@astryxdesign/core/Card';

export default function JoinPG() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1 = Enter Code, 2 = Preview, 3 = Request Form
  const [code, setCode] = useState('');
  
  // Dummy PG data
  const pgData = {
    name: 'Sunrise PG',
    area: 'Koramangala, Bangalore',
    category: 'Premium Co-living',
    gender: 'Unisex',
    amenities: 'WiFi, AC, Laundry, Meals',
    availability: 'Waitlist only'
  };

  const handleVerifyCode = () => {
    if (code.length === 6) {
      setStep(2);
    }
  };

  const handleRequestJoin = () => {
    setStep(3);
  };

  const handleSubmitRequest = () => {
    alert("Request Sent! The owner will review it.");
    router.push('/home'); // In a real app, this would route to a request tracker
  };

  return (
    <VStack gap={6} xstyle={{ padding: 24, minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {step === 1 && (
        <VStack gap={6}>
          <HStack gap={2} xstyle={{ alignItems: 'center' }}>
            <Icon icon="arrow_back" size={24} onClick={() => router.back()} xstyle={{ cursor: 'pointer' }} />
            <Heading level={2}>Join a PG</Heading>
          </HStack>
          
          <Text color="secondary">Enter the 6-character code provided by the PG owner.</Text>
          
          <TextInput
            label="PG Code"
            value={code}
            onChange={(e: any) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. SUN123"
            maxLength={6}
          />
          
          <Button 
            label="Find PG" 
            variant="primary" 
            onClick={handleVerifyCode} 
            disabled={code.length < 6} 
          />
        </VStack>
      )}

      {step === 2 && (
        <VStack gap={6}>
          <HStack gap={2} xstyle={{ alignItems: 'center' }}>
            <Icon icon="arrow_back" size={24} onClick={() => setStep(1)} xstyle={{ cursor: 'pointer' }} />
            <Heading level={2}>PG Preview</Heading>
          </HStack>
          
          <Card xstyle={{ padding: 20 }}>
            <VStack gap={4}>
              <Heading level={3}>{pgData.name}</Heading>
              <Text color="secondary">{pgData.area} • {pgData.category}</Text>
              
              <VStack gap={2}>
                <HStack gap={2}><Icon icon="group" size={20} color="secondary" /><Text>{pgData.gender}</Text></HStack>
                <HStack gap={2}><Icon icon="wifi" size={20} color="secondary" /><Text>{pgData.amenities}</Text></HStack>
                <HStack gap={2}><Icon icon="info" size={20} color="secondary" /><Text color="secondary">{pgData.availability}</Text></HStack>
              </VStack>
            </VStack>
          </Card>
          
          <Button label="Request to Join" variant="primary" onClick={handleRequestJoin} />
        </VStack>
      )}

      {step === 3 && (
        <VStack gap={6}>
          <HStack gap={2} xstyle={{ alignItems: 'center' }}>
            <Icon icon="arrow_back" size={24} onClick={() => setStep(2)} xstyle={{ cursor: 'pointer' }} />
            <Heading level={2}>Request Form</Heading>
          </HStack>
          
          <Text color="secondary">Submit your details to the owner of {pgData.name}.</Text>
          
          <TextInput label="Preferred Room Type" placeholder="e.g. Double Sharing" />
          <TextInput label="Expected Move-in Date" type="date" />
          <TextInput label="Note to Owner (Optional)" placeholder="Any special requests?" />
          
          <Card xstyle={{ padding: 16, backgroundColor: '#eff6ff' }}>
            <Text type="supporting" color="secondary">By requesting, your name and phone number will be shared with the PG owner.</Text>
          </Card>
          
          <Button label="Submit Request" variant="primary" onClick={handleSubmitRequest} />
        </VStack>
      )}
    </VStack>
  );
}
