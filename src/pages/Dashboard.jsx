import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [commander, setCommander] = useState(null);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    fetch('https://elite-backend-production.up.railway.app/api/commander')
      .then((res) => res.json())
      .then((data) => setCommander(data));

    fetch('https://elite-backend-production.up.railway.app/api/activity')
      .then((res) => res.json())
      .then((data) => setActivity(data.reverse())); // Show newest first
  }, []);

  if (!commander) return <div className="p-6">Loading Commander Data...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome, {commander.name}</h1>

      <div className="bg-gray-800 p-4 rounded-2xl shadow-md mb-6">
        <p className="text-lg">📍 Current System: <span className="font-semibold">{commander.system}</span></p>
        <p className="text-lg">🛰️ Faction: <span className="font-semibold">{commander.faction}</span></p>
        <p className="text-lg">👑 Powerplay: <span className="font-semibold">{commander.power}</span></p>
        <p className="text-lg">💳 Credits: <span className="font-semibold">{commander.credits.toLocaleString()} CR</span></p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(commander.ranks).map(([type, value]) => (
          <div key={type} className="bg-slate-700 p-4 rounded-xl text-center shadow">
            <h3 className="text-lg font-semibold">{type.charAt(0).toUpperCase() + type.slice(1)} Rank</h3>
            <p className="text-xl text-green-300">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-800 p-4 rounded-2xl shadow-md">
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
