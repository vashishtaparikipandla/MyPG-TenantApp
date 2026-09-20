'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JoinPG() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');
  
  const pgData = {
    name: 'Sunrise PG',
    area: 'Koramangala, Bangalore',
    category: 'Premium Co-living',
    gender: 'Unisex',
    amenities: 'WiFi, AC, Laundry, Meals',
    availability: 'Waitlist only'
  };

  const handleVerifyCode = () => { if (code.length === 6) setStep(2); };
  const handleRequestJoin = () => setStep(3);
  const handleSubmitRequest = () => {
    alert("Request Sent! The owner will review it.");
    router.push('/home');
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {step === 1 && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <button className="text-blue-600 font-bold" onClick={() => router.back()}>← Back</button>
            <h2 className="text-2xl font-bold ml-2">Join a PG</h2>
          </div>
          <p className="text-gray-500">Enter the 6-character code provided by the PG owner.</p>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">PG Code</label>
            <input
              className="w-full p-4 border border-gray-300 rounded-lg"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. SUN123"
              maxLength={6}
            />
          </div>
          <button 
            className="w-full py-4 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50"
            onClick={handleVerifyCode} 
            disabled={code.length < 6} 
          >Find PG</button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <button className="text-blue-600 font-bold" onClick={() => setStep(1)}>← Back</button>
            <h2 className="text-2xl font-bold ml-2">PG Preview</h2>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
            <h3 className="text-xl font-bold">{pgData.name}</h3>
            <p className="text-gray-500">{pgData.area} • {pgData.category}</p>
            <div className="flex flex-col gap-2 mt-2">
              <p className="text-gray-700"><b>Gender:</b> {pgData.gender}</p>
              <p className="text-gray-700"><b>Amenities:</b> {pgData.amenities}</p>
              <p className="text-gray-700"><b>Availability:</b> {pgData.availability}</p>
            </div>
          </div>
          <button className="w-full py-4 bg-blue-600 text-white rounded-lg font-medium" onClick={handleRequestJoin}>Request to Join</button>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <button className="text-blue-600 font-bold" onClick={() => setStep(2)}>← Back</button>
            <h2 className="text-2xl font-bold ml-2">Request Form</h2>
          </div>
          <p className="text-gray-500">Submit your details to the owner of {pgData.name}.</p>
          <input className="w-full p-4 border border-gray-300 rounded-lg" placeholder="Preferred Room Type (e.g. Double)" />
          <input className="w-full p-4 border border-gray-300 rounded-lg" type="date" placeholder="Expected Move-in Date" />
          <input className="w-full p-4 border border-gray-300 rounded-lg" placeholder="Note to Owner (Optional)" />
          
          <div className="p-3 bg-blue-50 rounded-lg mt-2">
            <p className="text-sm text-blue-800">By requesting, your name and phone number will be shared with the PG owner.</p>
          </div>
          <button className="w-full py-4 bg-blue-600 text-white rounded-lg font-medium" onClick={handleSubmitRequest}>Submit Request</button>
        </div>
      )}
    </div>
  );
}
