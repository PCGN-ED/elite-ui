import { useEffect, useState } from 'react';

export default function Colonization() {
  const [support, setSupport] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('https://elite-backend-production.up.railway.app/api/colonization', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setSupport(data));
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🌌 Colonization Contributions</h1>
      {support.length === 0 ? (
        <p className="text-gray-400">No deliveries logged yet.</p>
      ) : (
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-gray-300 border-b border-gray-600">
              <th className="py-2">System</th>
              <th className="py-2">Station</th>
              <th className="py-2">Commodity</th>
              <th className="py-2">Quantity</th>
              <th className="py-2">Credits</th>
              <th className="py-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {support.map((entry, index) => (
              <tr key={index} className="border-b border-gray-700">
                <td className="py-1">{entry.system || '-'}</td>
                <td className="py-1">{entry.station || '-'}</td>
                <td className="py-1">{entry.commodity || '-'}</td>
                <td className="py-1">{entry.quantity || 0}</td>
                <td className="py-1">{entry.credits?.toLocaleString() || 0} CR</td>
                <td className="py-1 text-xs text-gray-400">{new Date(entry.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
