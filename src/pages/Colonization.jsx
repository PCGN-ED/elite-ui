import { useEffect, useState } from 'react';

export default function Colonization() {
  const [support, setSupport] = useState([]);
  const [requirements, setRequirements] = useState([]);

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

    fetch('https://elite-backend-production.up.railway.app/api/colonization/requirements')
      .then(res => res.json())
      .then(data => setRequirements(data));
  }, []);

  const grouped = support.reduce((acc, entry) => {
    const key = `${entry.system} / ${entry.station}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {});

  const groupedRequirements = requirements.reduce((acc, entry) => {
    if (!acc[entry.market_id]) acc[entry.market_id] = [];
    acc[entry.market_id].push(entry);
    return acc;
  }, {});

  // Include fully completed commodities in the progress bar by querying the full depot_commodities instead
  const fullProgress = requirements.reduce((acc, entry) => {
    if (!acc[entry.market_id]) acc[entry.market_id] = { provided: 0, required: 0 };
    acc[entry.market_id].provided += Number(entry.provided) || 0;
    acc[entry.market_id].required += Number(entry.required) || 0;
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-5xl mx-auto bg-[#0d0d0d] text-[#e0e0e0]">
      <h1 className="text-3xl font-bold mb-6 text-[#ffa500]">🌌 Your Colonization Contributions</h1>
      {support.length === 0 ? (
        <p className="text-[#999]">No deliveries logged yet.</p>
      ) : (
        Object.entries(grouped).map(([location, entries], i) => {
          const [system, station] = location.split(' / ');
          const marketId = entries[0]?.market_id;
          const displayStation = station.includes('ColonisationShip') ? 'System Colonisation Ship' : station;
          return (
            <div key={i} className="mb-8 border border-[#2a2a2a] rounded-xl bg-[#1c1c1c] p-4">
              <h2 className="text-xl font-bold mb-2 text-[#ff8c00]">🪐 {system} — {displayStation}</h2>
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-[#ffcc00] border-b border-[#333]">
                    <th className="py-2">Commodity</th>
                    <th className="py-2">Quantity</th>
                    <th className="py-2">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, index) => (
                    <tr key={index} className="border-b border-[#2a2a2a] hover:bg-[#262626]">
                      <td className="py-1">{entry.commodity || '-'}</td>
                      <td className="py-1">{entry.quantity || 0}</td>
                      <td className="py-1 text-xs text-[#999]">{new Date(entry.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2 text-sm text-[#ccc]">
                <strong className="text-[#ffa500]">Total per commodity:</strong>
                <ul className="ml-4 list-disc">
                  {[...new Set(entries.map(e => e.commodity))].map((commodity, idx) => {
                    const totalQty = entries.filter(e => e.commodity === commodity).reduce((sum, e) => sum + (e.quantity || 0), 0);
                    return <li key={idx}>{commodity}: {totalQty}</li>;
                  })}
                </ul>
                </div>
                <div className="mt-2 text-sm text-[#ffa500] font-bold">
                  🚧 Construction Progress: {
                    fullProgress[marketId]
                      ? `${fullProgress[marketId].provided.toLocaleString()} / ${fullProgress[marketId].required.toLocaleString()} (${Math.round((fullProgress[marketId].provided / fullProgress[marketId].required) * 100)}%)`
                      : '0 / 0 (0%)'
                  }
                </div>
              {groupedRequirements[marketId] && (
                <div className="mt-4 text-sm text-[#ccc]">
                  <strong className="text-[#ffa500]">Still Required:</strong>
                  <ul className="ml-4 list-disc">
                    {groupedRequirements[marketId].map((req, idx) => (
                      <li key={idx}>{req.commodity}: {req.required - req.provided}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
