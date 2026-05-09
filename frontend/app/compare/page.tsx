"use client";
import { useEffect, useState } from "react";
import API from "@/lib/api";
import Navbar from "@/components/Navbar";

interface College {
  id: number;
  name: string;
  location: string;
  state: string;
  fees: number;
  rating: number;
  courses: string[];
  placement: number;
  established: number;
}

export default function ComparePage() {
  const [allColleges, setAllColleges] = useState<College[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [compared, setCompared] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get("/colleges").then((res) => setAllColleges(res.data));
  }, []);

  const toggleSelect = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      if (selected.length >= 3) {
        alert("You can compare maximum 3 colleges!");
        return;
      }
      setSelected([...selected, id]);
    }
  };

  const handleCompare = async () => {
    if (selected.length < 2) {
      alert("Please select at least 2 colleges to compare!");
      return;
    }
    setLoading(true);
    try {
      const res = await API.get(`/compare?ids=${selected.join(",")}`);
      setCompared(res.data);
    } catch {
      alert("Failed to compare colleges");
    } finally {
      setLoading(false);
    }
  };

  // Find winner for each numeric field
  const getWinner = (key: keyof College, higherIsBetter: boolean) => {
    if (compared.length === 0) return -1;
    let winnerIdx = 0;
    compared.forEach((c, i) => {
      const curr = c[key] as number;
      const best = compared[winnerIdx][key] as number;
      if (higherIsBetter ? curr > best : curr < best) winnerIdx = i;
    });
    return compared[winnerIdx].id;
  };

  const winnerId = {
    rating: getWinner("rating", true),
    fees: getWinner("fees", false),       // lower is better
    placement: getWinner("placement", true),
    established: getWinner("established", false), // older is better
  };

  const cellClass = (collegeId: number, key: keyof typeof winnerId) => {
    return winnerId[key] === collegeId
      ? "bg-green-50 text-green-700 font-bold"
      : "text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-blue-700 text-white py-10 px-6 text-center">
        <h1 className="text-3xl font-bold mb-2">⚖️ Compare Colleges</h1>
        <p className="text-blue-200">Select 2 or 3 colleges to compare side by side</p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* College Selection */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Select Colleges ({selected.length}/3 selected)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allColleges.map((college) => (
              <div
                key={college.id}
                onClick={() => toggleSelect(college.id)}
                className={`border-2 rounded-lg p-3 cursor-pointer transition ${
                  selected.includes(college.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selected.includes(college.id)
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selected.includes(college.id) && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{college.name}</p>
                    <p className="text-xs text-gray-500">{college.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleCompare}
            disabled={selected.length < 2 || loading}
            className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Comparing..." : "Compare Selected Colleges"}
          </button>
        </div>

        {/* Legend */}
        {compared.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
              🏆 Best in category
            </span>
            <span className="text-xs text-gray-500">Green highlight = winner in that category</span>
          </div>
        )}

        {/* Comparison Table */}
        {compared.length > 0 && (
          <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
            <h2 className="text-lg font-bold text-gray-800 mb-6">📊 Comparison Result</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="text-left p-3 text-gray-600 font-semibold">Feature</th>
                  {compared.map((c) => (
                    <th key={c.id} className="text-center p-3 text-blue-700 font-bold">
                      {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Location */}
                <tr className="bg-white">
                  <td className="p-3 font-medium text-gray-700">📍 Location</td>
                  {compared.map((c) => (
                    <td key={c.id} className="p-3 text-center text-gray-800">{c.location}</td>
                  ))}
                </tr>
                {/* State */}
                <tr className="bg-gray-50">
                  <td className="p-3 font-medium text-gray-700">🏛️ State</td>
                  {compared.map((c) => (
                    <td key={c.id} className="p-3 text-center text-gray-800">{c.state}</td>
                  ))}
                </tr>
                {/* Rating */}
                <tr className="bg-white">
                  <td className="p-3 font-medium text-gray-700">⭐ Rating</td>
                  {compared.map((c) => (
                    <td key={c.id} className={`p-3 text-center rounded ${cellClass(c.id, "rating")}`}>
                      {winnerId.rating === c.id ? "🏆 " : ""}{c.rating}
                    </td>
                  ))}
                </tr>
                {/* Fees */}
                <tr className="bg-gray-50">
                  <td className="p-3 font-medium text-gray-700">💰 Annual Fees</td>
                  {compared.map((c) => (
                    <td key={c.id} className={`p-3 text-center rounded ${cellClass(c.id, "fees")}`}>
                      {winnerId.fees === c.id ? "🏆 " : ""}₹{c.fees.toLocaleString()}
                    </td>
                  ))}
                </tr>
                {/* Placement */}
                <tr className="bg-white">
                  <td className="p-3 font-medium text-gray-700">💼 Avg Placement</td>
                  {compared.map((c) => (
                    <td key={c.id} className={`p-3 text-center rounded ${cellClass(c.id, "placement")}`}>
                      {winnerId.placement === c.id ? "🏆 " : ""}{c.placement} LPA
                    </td>
                  ))}
                </tr>
                {/* Established */}
                <tr className="bg-gray-50">
                  <td className="p-3 font-medium text-gray-700">📅 Established</td>
                  {compared.map((c) => (
                    <td key={c.id} className={`p-3 text-center rounded ${cellClass(c.id, "established")}`}>
                      {winnerId.established === c.id ? "🏆 " : ""}{c.established}
                    </td>
                  ))}
                </tr>
                {/* Courses */}
                <tr className="bg-white">
                  <td className="p-3 font-medium text-gray-700">📚 Courses</td>
                  {compared.map((c) => (
                    <td key={c.id} className="p-3 text-center">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {c.courses.map((course) => (
                          <span key={course} className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">
                            {course}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}