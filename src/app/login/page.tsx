'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval: any;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleVerify = () => {
    if (otp === '999999') {
      router.push('/dashboard');
    } else if (otp.length === 6) {
      router.push('/home');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {step === 1 ? (
        <div className="flex flex-col gap-6 mt-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold">Welcome to MyPG</h2>
            <p className="text-gray-500">Enter your phone number to login</p>
          </div>
          <input
            type="tel"
            className="w-full p-4 border border-gray-300 rounded-lg text-lg"
            placeholder="10-digit mobile number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={10}
          />
          <button 
            className="w-full py-4 bg-blue-600 text-white rounded-lg font-medium text-lg disabled:opacity-50"
            onClick={() => setStep(2)}
            disabled={phone.length < 10}
          >
            Get OTP
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6 mt-12">
          <div className="flex flex-col gap-2">
            <button className="text-left text-blue-600 font-medium mb-4" onClick={() => setStep(1)}>← Back</button>
            <h2 className="text-3xl font-bold">Enter OTP</h2>
            <p className="text-gray-500">Sent to +91 {phone}</p>
          </div>
          <input
            type="number"
            className="w-full p-4 border border-gray-300 rounded-lg text-lg tracking-widest text-center"
            placeholder="• • • • • •"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
          />
          <button 
            className="w-full py-4 bg-blue-600 text-white rounded-lg font-medium text-lg disabled:opacity-50"
            onClick={handleVerify}
            disabled={otp.length < 6}
          >
            Verify & Login
          </button>
          
          <div className="p-3 bg-blue-50 rounded-lg mt-2">
            <p className="text-sm text-blue-800">
              Testing tips: Enter OTP <b>999999</b> to log in as an Active Tenant (Dashboard). Enter any other 6 digits to log in as a Prospect (Home).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
