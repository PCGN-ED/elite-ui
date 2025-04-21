import { useEffect, useState } from 'react';

export default function Dashboard() {
  const storedCommander = localStorage.getItem('commander');
  const commander = storedCommander ? JSON.parse(storedCommander) : null;
  const [activity, setActivity] = useState([]);
  const [apiToken, setApiToken] = useState(null);

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

    fetch('https://elite-backend-production.up.railway.app/api/commander/token', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setApiToken(data.api_token));
  }, []);

  if (!commander) return <div className="p-6">Please log in to view your dashboard.</div>;

  const totalCredits = activity.reduce((sum, a) => sum + (a.credits || 0), 0);
  const totalQuantity = activity.reduce((sum, a) => sum + (a.quantity || 0), 0);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome, CMDR {commander.username}</h1>

      <div className="bg-gray-800 p-4 rounded-2xl shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-2">📊 24h Trade Summary</h2>
        <p className="text-lg">🪙 Total Credits Traded: <span className="font-semibold text-green-300">{totalCredits.toLocaleString()} CR</span></p>
        <p className="text-lg">📦 Total Commodities Moved: <span className="font-semibold text-blue-300">{totalQuantity}</span></p>
      </div>

      <div className="bg-gray-800 p-4 rounded-2xl shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-2">📜 Recent Commander Activity (Last 24h)</h2>
        {activity.length === 0 ? (
          <p className="text-gray-400">No recent activity logged.</p>
        ) : (
          <>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-300 border-b border-gray-600">
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
                    className={`border-b border-gray-700 ${entry.type.includes('sell') ? 'bg-green-900/30' : entry.type.includes('buy') ? 'bg-blue-900/30' : ''}`}
                  >
                    <td className="py-1 capitalize">{entry.type}</td>
                    <td className="py-1">{entry.commodity || '-'}</td>
                    <td className="py-1">{entry.quantity || 0}</td>
                    <td className="py-1">{entry.credits?.toLocaleString() || 0} CR</td>
                    <td className="py-1 text-xs text-gray-400">{new Date(entry.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-600 text-gray-300">
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

      <div className="bg-gray-800 p-4 rounded-2xl shadow-md mt-6">
        <h2 className="text-xl font-bold mb-2">🔐 EDMC Plugin API Token</h2>
        {apiToken ? (
          <>
            <div className="bg-gray-700 p-2 rounded text-green-300 font-mono mb-2 overflow-x-auto">
              {apiToken}
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(apiToken)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Copy Token
            </button>
          </>
        ) : (
          <p className="text-gray-400">Generating token...</p>
        )}
      </div>
    </div>
  );
}
