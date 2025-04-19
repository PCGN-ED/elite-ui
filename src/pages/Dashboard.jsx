import { useEffect, useState } from 'react';

export default function Dashboard() {
  const storedCommander = localStorage.getItem('commander');
  const commander = storedCommander ? JSON.parse(storedCommander) : null;
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
      .then((data) => setActivity(data.reverse()));
  }, []);

  if (!commander) return <div className="p-6">Please log in to view your dashboard.</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome, CMDR {commander.username}</h1>

      <div className="bg-gray-800 p-4 rounded-2xl shadow-md mb-6">
        <p className="text-lg">📧 Email: <span className="font-semibold">{commander.email}</span></p>
        <p className="text-lg">🆔 Commander ID: <span className="font-semibold">{commander.id}</span></p>
      </div>

      <div className="bg-gray-800 p-4 rounded-2xl shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-2">📜 Recent Commander Activity</h2>
        {activity.length === 0 ? (
          <p className="text-gray-400">No recent activity logged.</p>
        ) : (
          <ul className="space-y-2">
            {activity.map((entry) => (
              <li key={entry.id} className="border-b border-gray-600 pb-2">
                <p className="text-md"><span className="text-green-400 font-semibold">{entry.type}</span>: {entry.details}</p>
                <p className="text-xs text-gray-400">🕒 {new Date(entry.timestamp).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
