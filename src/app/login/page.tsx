'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { VStack, HStack } from '@astryxdesign/core/Layout';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Button } from '@astryxdesign/core/Button';
import { Link } from '@astryxdesign/core/Link';
import { Icon } from '@astryxdesign/core/Icon';
import { Card } from '@astryxdesign/core/Card';

export default function Login() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval: any;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = () => {
    if (phone.length >= 10) {
      setStep(2);
      setTimer(30);
    }
  };

  const handleVerify = () => {
    if (otp === '999999') {
      router.push('/dashboard');
    } else if (otp.length === 6) {
      router.push('/home');
    }
  };

  return (
    <VStack gap={6} xstyle={{ padding: 24, minHeight: '100vh', justifyContent: 'center' }}>
      {step === 1 ? (
        <VStack gap={6}>
          <VStack gap={2}>
            <Heading level={2}>Enter your phone number</Heading>
            <Text color="secondary">We'll send you an OTP to verify.</Text>
          </VStack>

          <TextInput
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(e: any) => setPhone(e.target.value)}
            placeholder="Enter 10-digit number"
            maxLength={10}
          />

          <Button 
            label="Send OTP" 
            variant="primary" 
            onClick={handleSendOtp} 
            disabled={phone.length < 10} 
          />

          <HStack xstyle={{ justifyContent: 'center', marginTop: 16 }}>
            <Text color="secondary">Not a tenant? </Text>
            <Link href="/" xstyle={{ marginLeft: 4 }}>Change role</Link>
          </HStack>
        </VStack>
      ) : (
        <VStack gap={6}>
          <VStack gap={2}>
            <HStack gap={2} xstyle={{ alignItems: 'center' }}>
              <Icon icon="arrow_back" size={24} onClick={() => setStep(1)} xstyle={{ cursor: 'pointer' }} />
              <Heading level={2}>Enter OTP</Heading>
            </HStack>
            <Text color="secondary">Sent to +91 {phone}</Text>
          </VStack>

          <TextInput
            label="6-digit OTP"
            type="number"
            value={otp}
            onChange={(e: any) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            maxLength={6}
          />

          <Button 
            label="Verify & Login" 
            variant="primary" 
            onClick={handleVerify} 
            disabled={otp.length < 6} 
          />

          <Card xstyle={{ padding: 12, backgroundColor: '#eff6ff', marginTop: 12 }}>
            <Text type="supporting" color="secondary">
              Testing tips: Enter OTP <b>999999</b> to log in as an Active Tenant (Dashboard). Enter any other 6 digits to log in as a Prospect (Home).
            </Text>
          </Card>

          <HStack xstyle={{ justifyContent: 'center', marginTop: 16 }}>
            {timer > 0 ? (
              <Text color="secondary">Resend OTP in {timer}s</Text>
            ) : (
              <Link onClick={() => setTimer(30)}>Resend OTP</Link>
            )}
          </HStack>
        </VStack>
      )}
    </VStack>
  );
}
