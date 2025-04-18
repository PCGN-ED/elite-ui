export default function Dashboard() {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Welcome, CMDR Maverick</h1>
  
        <div className="bg-gray-800 p-4 rounded-2xl shadow-md mb-6">
          <p className="text-lg">📍 Current System: <span className="font-semibold">Shinrarta Dezhra</span></p>
          <p className="text-lg">🛰️ Faction: <span className="font-semibold">The Voidhawks</span></p>
          <p className="text-lg">👑 Powerplay: <span className="font-semibold">Aisling Duval</span></p>
          <p className="text-lg">💳 Credits: <span className="font-semibold">4,200,000,000 CR</span></p>
        </div>
  
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-700 p-4 rounded-xl text-center shadow">
            <h3 className="text-lg font-semibold">Combat Rank</h3>
            <p className="text-xl text-green-300">Deadly</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-xl text-center shadow">
            <h3 className="text-lg font-semibold">Trade Rank</h3>
            <p className="text-xl text-yellow-300">Elite</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-xl text-center shadow">
            <h3 className="text-lg font-semibold">Explore Rank</h3>
            <p className="text-xl text-blue-300">Elite</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-xl text-center shadow">
            <h3 className="text-lg font-semibold">CQC Rank</h3>
            <p className="text-xl text-pink-300">Semi-Pro</p>
          </div>
        </div>
      </div>
    );
  }
  