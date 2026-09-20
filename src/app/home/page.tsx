'use client';

export default function Home() {
  return (
    <div className="min-h-screen p-6 bg-gray-50 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold">Hi there,</h2>
        <p className="text-gray-500">Welcome to MyPG</p>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h4 className="text-lg font-bold">Join a PG</h4>
          <p className="text-sm text-gray-500">Have a code from your owner?</p>
        </div>
        <div className="flex flex-col gap-2">
          <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium" onClick={() => window.location.href = '/join'}>Enter PG Code</button>
          <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium">Scan QR</button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-bold">My Requests</h4>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg flex justify-center border border-dashed border-gray-300">
          <p className="text-sm text-gray-500">No active join requests.</p>
        </div>
      </div>
    </div>
  );
}
