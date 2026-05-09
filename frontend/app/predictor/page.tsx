"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import API from "@/lib/api";

interface CollegePrediction {
  id: number;
  name: string;
  location: string;
  fees: number;
  rating: number;
  placement: number;
  chance: "High" | "Medium" | "Low";
}

export default function PredictorPage() {
  const [exam, setExam] = useState("JEE");
  const [rank, setRank] = useState("");
  const [results, setResults] = useState<CollegePrediction[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!rank) return;
    setLoading(true);
    try {
      const res = await API.get("/predict", {
        params: { exam, rank },
      });
      setResults(res.data);
      setSearched(true);
    } catch {
      alert("Failed to get predictions");
    } finally {
      setLoading(false);
    }
  };

  const chanceColor = (chance: string) => {
    if (chance === "High") return "bg-green-100 text-green-700";
    if (chance === "Medium") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-blue-700 text-white py-10 px-6 text-center">
        <h1 className="text-3xl font-bold mb-2">🎯 College Predictor</h1>
        <p className="text-blue-200">
          Enter your exam and rank to find colleges you can get into
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Enter Your Details</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Exam
            </label>
            <div className="grid grid-cols-4 gap-3">
              {["JEE", "EAMCET", "BITSAT", "WBJEE"].map((e) => (
                <button
                  key={e}
                  onClick={() => { setExam(e); setSearched(false); setRank(""); }}
                  className={`py-3 rounded-lg font-semibold text-sm transition ${
                    exam === e
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {exam === "BITSAT" ? "Your Score" : "Your Rank"}
            </label>
            <input
              type="number"
              placeholder={
                exam === "BITSAT"
                  ? "Enter your BITSAT score (out of 390)"
                  : `Enter your ${exam} rank`
              }
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 outline-none focus:border-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              {exam === "JEE" && "💡 Top 5000 = High chance at IITs"}
              {exam === "EAMCET" && "💡 Top 10000 = High chance at top colleges"}
              {exam === "BITSAT" && "💡 Score above 340 = High chance at BITS Pilani"}
              {exam === "WBJEE" && "💡 Top 5000 = High chance at Jadavpur University"}
            </p>
          </div>

          <button
            onClick={handlePredict}
            disabled={!rank || loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Finding colleges..." : "🔍 Predict My Colleges"}
          </button>
        </div>

        {searched && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800">
              📋 {results.length} Colleges found for {exam}{" "}
              {exam === "BITSAT" ? "Score" : "Rank"} {rank}
            </h2>
            {results.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
                <p className="text-4xl mb-2">😕</p>
                <p>No colleges found. Try a different rank!</p>
              </div>
            ) : (
              results.map((college) => (
                <div
                  key={college.id}
                  className="bg-white rounded-xl shadow p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-gray-800">{college.name}</h3>
                    <p className="text-sm text-gray-500">📍 {college.location}</p>
                    <div className="flex gap-3 mt-1 text-xs text-gray-500">
                      <span>⭐ {college.rating}</span>
                      <span>💰 ₹{college.fees.toLocaleString()}</span>
                      <span>💼 {college.placement} LPA</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${chanceColor(college.chance)}`}>
                      {college.chance} Chance
                    </span>
                    <Link
                      href={`/colleges/${college.id}`}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}