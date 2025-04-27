import { useEffect, useState } from 'react';

export default function Colonization() {
  const [support, setSupport] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [openProjects, setOpenProjects] = useState({}); // track open/collapsed state

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

  const fullProgress = requirements.reduce((acc, entry) => {
    if (!acc[entry.market_id]) acc[entry.market_id] = { provided: 0, required: 0 };
    acc[entry.market_id].provided += Number(entry.provided) || 0;
    acc[entry.market_id].required += Number(entry.required) || 0;
    return acc;
  }, {});

  const toggleProject = (key) => {
    setOpenProjects(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // 🛠 NEW: Split active vs completed
  const activeProjects = [];
  const completedProjects = [];

  Object.entries(grouped).forEach(([location, entries]) => {
    const progressValue = entries[0]?.progress !== undefined ? parseFloat(entries[0].progress) : 0;
    if (progressValue >= 1) {
      completedProjects.push([location, entries]);
    } else {
      activeProjects.push([location, entries]);
    }
  });

  return (
    <div className="p-6 max-w-5xl mx-auto bg-[#0d0d0d] text-[#e0e0e0]">
      {/* Active Projects */}
      <h1 className="text-3xl font-bold mb-6 text-[#ffa500]">🌌 Your Colonization Contributions</h1>

      {activeProjects.length === 0 ? (
        <p className="text-[#999] mb-8">No active construction projects at the moment.</p>
      ) : (
        activeProjects.map(([location, entries], i) => {
          const [system, station] = location.split(' / ');
          const marketId = entries[0]?.market_id;
          const displayStation = station.includes('ColonisationShip') ? 'System Colonisation Ship' : station;
          const progressValue = entries[0]?.progress !== undefined ? parseFloat(entries[0].progress) : 0;
          const isOpen = openProjects[location] ?? true; // Default to open

          return (
            <div key={i} className="mb-8 border border-[#2a2a2a] rounded-xl bg-[#1c1c1c]">
              <div
                onClick={() => toggleProject(location)}
                className="cursor-pointer bg-[#1c1c1c] hover:bg-[#262626] p-4 flex justify-between items-center rounded-t-xl"
              >
                <h2 className="text-xl font-bold text-[#ff8c00]">🪐 {system} — {displayStation}</h2>
                <span className="text-[#ccc] text-sm">{isOpen ? '▼' : '►'}</span>
              </div>

              {isOpen && (
                <div className="p-4 border-t border-[#2a2a2a]">
                  <div className="text-sm text-[#ccc] mb-4">
                    <strong className="text-[#ffa500]">Total per commodity:</strong>
                    <ul className="ml-4 list-disc mt-2">
                      {[...new Set(entries.map(e => e.commodity))].map((commodity, idx) => {
                        const totalQty = entries
                          .filter(e => e.commodity === commodity)
                          .reduce((sum, e) => sum + (e.quantity || 0), 0);
                        return <li key={idx}>{commodity}: {totalQty}</li>;
                      })}
                    </ul>
                  </div>

                  <div className="mt-2 mb-4">
                    <div className="text-sm text-[#ffa500] font-bold mb-1">
                      🚧 Construction Progress: {Math.round(progressValue * 100)}%
                    </div>
                    <div className="w-full bg-[#333] h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#ffa500]"
                        style={{ width: `${Math.min(Math.round(progressValue * 100), 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {groupedRequirements[marketId] && (
                    <div className="mt-4 text-sm text-[#ccc]">
                      <strong className="text-[#ffa500]">Still Required:</strong>
                      <ul className="ml-4 list-disc mt-2">
                        {groupedRequirements[marketId].map((req, idx) => (
                          <li key={idx}>{req.commodity}: {req.required - req.provided}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Completed Projects */}
      {completedProjects.length > 0 && (
        <>
          <h2 className="text-3xl font-bold mb-6 text-green-400 mt-12">✅ Completed Stations</h2>

          {completedProjects.map(([location, entries], i) => {
            const [system, station] = location.split(' / ');
            const displayStation = station.includes('ColonisationShip') ? 'System Colonisation Ship' : station;
            const isOpen = openProjects[location] ?? false; // Default to collapsed

            return (
              <div key={i} className="mb-8 border border-green-600 rounded-xl bg-[#1c1c1c]">
                <div
                  onClick={() => toggleProject(location)}
                  className="cursor-pointer bg-[#1c1c1c] hover:bg-[#262626] p-4 flex justify-between items-center rounded-t-xl"
                >
                  <h2 className="text-xl font-bold text-green-400">🪐 {system} — {displayStation}</h2>
                  <span className="text-[#ccc] text-sm">{isOpen ? '▼' : '►'}</span>
                </div>

                {isOpen && (
                  <div className="p-4 border-t border-[#2a2a2a]">
                    <p className="text-sm text-green-400 font-bold">✅ Station construction completed!</p>
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
