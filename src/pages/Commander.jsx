import { useEffect, useState } from 'react';

export default function Commander() {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('https://elite-backend-production.up.railway.app/api/activity', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const since = Date.now() - 24 * 60 * 60 * 1000;
        const filtered = data.filter(a => new Date(a.timestamp).getTime() >= since);
        setActivity(filtered);
      });
  }, []);

  const totalCredits = activity.reduce((sum, a) => sum + (a.credits || 0), 0);
  const totalQuantity = activity.reduce((sum, a) => sum + (a.quantity || 0), 0);

  return (
    <div className="p-6 max-w-5xl mx-auto bg-[#0d0d0d] text-[#e0e0e0]">
      <h1 className="text-3xl font-bold mb-4 text-[#ffa500]">🧑‍🚀 Commander Activity Report</h1>

      <div className="bg-[#1c1c1c] p-4 rounded-2xl shadow-md mb-6 border border-[#2a2a2a]">
        <h2 className="text-2xl font-bold mb-2 text-[#ff8c00]">📜 Recent Activity (Last 24h)</h2>
        {activity.length === 0 ? (
          <p className="text-[#999]">No recent activity logged.</p>
        ) : (
          <>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-[#ffcc00] border-b border-[#333]">
                  <th className="py-2">Type</th>
                  <th className="py-2">Commodity</th>
                  <th className="py-2">Quantity</th>
                  <th className="py-2">Credits</th>
                  <th className="py-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {activity.map((entry, index) => (
                  <tr
                    key={index}
                    className={`border-b border-[#2a2a2a] hover:bg-[#262626] ${entry.type.includes('sell') ? 'bg-green-900/30' : entry.type.includes('buy') ? 'bg-blue-900/30' : ''}`}
                  >
                    <td className="py-1 capitalize">{entry.type}</td>
                    <td className="py-1">{entry.commodity || '-'}</td>
                    <td className="py-1">{entry.quantity || 0}</td>
                    <td className="py-1">{entry.credits?.toLocaleString() || 0} CR</td>
                    <td className="py-1 text-xs text-[#999]">{new Date(entry.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-[#444] text-[#ffcc00]">
                  <td colSpan="2" className="py-2 font-bold text-right">Totals:</td>
                  <td className="py-2 font-bold">{totalQuantity}</td>
                  <td className="py-2 font-bold">{totalCredits.toLocaleString()} CR</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
