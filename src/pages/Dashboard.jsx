import { useEffect, useState } from 'react';
import commanderData from '../commander.json';

export default function Dashboard() {
  const [commander, setCommander] = useState(null);

  useEffect(() => {
    // In a real app, fetch from API here
    setCommander(commanderData);
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(commander.ranks).map(([type, value]) => (
          <div key={type} className="bg-slate-700 p-4 rounded-xl text-center shadow">
            <h3 className="text-lg font-semibold">{type.charAt(0).toUpperCase() + type.slice(1)} Rank</h3>
            <p className="text-xl text-green-300">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
