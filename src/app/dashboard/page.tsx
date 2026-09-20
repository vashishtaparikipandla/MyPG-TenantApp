'use client';

export default function TenantDashboard() {
  return (
    <div className="min-h-screen p-6 bg-gray-50 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Sunrise PG</h2>
          <p className="text-gray-500">Room 204B, Tower A</p>
        </div>
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">🔔</div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 font-medium">Rent Due</p>
            <h3 className="text-2xl font-bold text-red-600">₹8,500</h3>
            <p className="text-sm text-gray-500">Due by 5th Oct</p>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-xl">💳</div>
        </div>
        <div className="flex gap-4">
          <button className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium">Pay via UPI</button>
          <button className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium">I paid cash</button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
        <h4 className="text-lg font-bold flex items-center gap-2">🍲 Today's Menu</h4>
        <div className="flex justify-between items-center border-b pb-3 border-gray-100">
          <div>
            <p className="font-bold">Lunch</p>
            <p className="text-sm text-gray-500">Paneer, Dal, Roti</p>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600">Opt Out</button>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold">Dinner</p>
            <p className="text-sm text-gray-500">Aloo Gobi, Rice</p>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600">Opt Out</button>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-bold mb-4 mt-2">Quick Actions</h4>
        <div className="grid grid-cols-3 gap-4">
          {[
            {icon: '🔧', label: 'Issue'},
            {icon: '🧹', label: 'Clean'},
            {icon: '🚪', label: 'Leave'},
            {icon: '👕', label: 'Laundry'},
            {icon: '📶', label: 'WiFi'},
            {icon: '📞', label: 'Contacts'}
          ].map(action => (
            <div key={action.label} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-2">
              <span className="text-2xl">{action.icon}</span>
              <span className="text-sm text-gray-600 font-medium">{action.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
