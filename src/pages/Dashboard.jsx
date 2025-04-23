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

  if (!commander) return <div className="p-6 bg-[#0d0d0d] text-[#e0e0e0]">Please log in to view your dashboard.</div>;

  const totalCredits = activity.reduce((sum, a) => sum + (a.credits || 0), 0);
  const totalQuantity = activity.reduce((sum, a) => sum + (a.quantity || 0), 0);

  return (
    <div className="p-6 max-w-5xl mx-auto bg-[#0d0d0d] text-[#e0e0e0]">
      <h1 className="text-3xl font-bold mb-4 text-[#ffa500]">Welcome, CMDR {commander.username}</h1>

      <div className="bg-[#1c1c1c] p-4 rounded-2xl shadow-md mb-6 border border-[#2a2a2a]">
        <h2 className="text-xl font-bold mb-2 text-[#ff8c00]">📊 24h Trade Summary</h2>
        <p className="text-lg">
          🪙 Total Credits Traded: <span className="font-semibold text-green-300">
            {totalCredits.toLocaleString()} CR
          </span>
        </p>
        <p className="text-lg">
          📦 Total Commodities Moved: <span className="font-semibold text-blue-300">
            {totalQuantity}
          </span>
        </p>
      </div>

      <div className="bg-[#1c1c1c] p-4 rounded-2xl shadow-md mt-6 border border-[#2a2a2a]">
        <h2 className="text-xl font-bold mb-2 text-[#ff8c00]">🔐 EDMC Plugin API Token</h2>
        {apiToken ? (
          <>
            <div className="bg-[#333] p-2 rounded text-green-300 font-mono mb-2 overflow-x-auto">
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
          <p className="text-[#999]">Generating token...</p>
        )}
      </div>
    </div>
  );
}
