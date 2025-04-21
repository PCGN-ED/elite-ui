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
