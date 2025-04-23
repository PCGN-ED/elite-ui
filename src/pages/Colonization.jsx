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

  const grouped = support.reduce((acc, entry) => {
    const key = `${entry.system} / ${entry.station}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🌌 Your Colonization Contributions</h1>
      {support.length === 0 ? (
        <p className="text-gray-400">No deliveries logged yet.</p>
      ) : (
        Object.entries(grouped).map(([location, entries], i) => {
          const [system, station] = location.split(' / ');
          const displayStation = station.includes('ColonisationShip') ? 'System Colonisation Ship' : station;
          return (
            <div key={i} className="mb-8">
              <h2 className="text-xl font-bold mb-2">🪐 {system} — {displayStation}</h2>
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-300 border-b border-gray-600">
                    <th className="py-2">Commodity</th>
                    <th className="py-2">Quantity</th>
                                        <th className="py-2">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="py-1">{entry.commodity || '-'}</td>
                      <td className="py-1">{entry.quantity || 0}</td>
                                            <td className="py-1 text-xs text-gray-400">{new Date(entry.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2 text-sm text-gray-300">
                <strong>Total per commodity:</strong>
                <ul className="ml-4 list-disc">
                  {[...new Set(entries.map(e => e.commodity))].map((commodity, idx) => {
                    const totalQty = entries.filter(e => e.commodity === commodity).reduce((sum, e) => sum + (e.quantity || 0), 0);
                    return <li key={idx}>{commodity}: {totalQty}</li>;
                  })}
                </ul>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

