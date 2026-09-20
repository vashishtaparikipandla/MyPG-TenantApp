'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PersonaPicker() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (role: string) => {
    if (role === 'Tenant') {
      router.push('/login');
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 flex flex-col justify-center">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-2xl font-bold">Who is using this app?</h1>
        <p className="text-gray-500">Select your role to continue</p>
      </div>

      <div className="flex flex-col gap-4">
        {['Tenant', 'Owner/Manager', 'Staff/Warden'].map(role => (
          <button 
            key={role}
            onClick={() => handleSelect(role)}
            className="p-4 bg-white border border-gray-200 rounded-xl flex items-center justify-between text-left shadow-sm"
          >
            <span className="font-medium">{role}</span>
          </button>
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 p-6 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-2xl z-50">
          <h3 className="text-xl font-bold mb-2">Not in this build</h3>
          <p className="text-gray-600 mb-6">This role isn't part of this build. Only the Tenant flow is available right now.</p>
          <button 
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium"
            onClick={() => setIsOpen(false)}
          >
            Got it
          </button>
        </div>
      )}
    </div>
  );
}
