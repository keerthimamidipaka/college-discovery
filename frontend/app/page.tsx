"use client";
import { useEffect, useState, useCallback } from "react";
import API from "@/lib/api";
import CollegeCard from "@/components/CollegeCard";
import Navbar from "@/components/Navbar";
import Link from "next/link";

interface College {
  id: number;
  name: string;
  location: string;
  state: string;
  fees: number;
  rating: number;
  courses: string[];
  placement: number;
}

export default function Home() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [course, setCourse] = useState("");

  const fetchColleges = useCallback(async (s: string, st: string, c: string) => {
    setLoading(true);
    try {
      const res = await API.get("/colleges", {
        params: {
          search: s || undefined,
          state: st || undefined,
          course: c || undefined,
        },
      });
      setColleges(res.data);
    } catch (error) {
      console.error("Failed to fetch colleges");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchColleges("", "", ""); }, []);
  useEffect(() => {
    const timer = setTimeout(() => fetchColleges(search, state, course), 400);
    return () => clearTimeout(timer);
  }, [search]);
  useEffect(() => { fetchColleges(search, state, course); }, [state, course]);

  const clearFilters = () => { setSearch(""); setState(""); setCourse(""); };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white py-20 px-6 text-center overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full"></div>
          <div className="absolute top-20 right-40 w-20 h-20 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10">
          <div className="inline-block bg-white bg-opacity-20 text-white text-sm font-semibold px-4 py-1 rounded-full mb-4">
            🎓 India's College Discovery Platform
          </div>
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Find Your <span className="text-yellow-300">Dream College</span>
          </h1>
          <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">
            Explore, compare, and predict your chances at top colleges across India
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <span className="absolute left-4 top-3.5 text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Search colleges by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-4 rounded-xl text-gray-800 outline-none shadow-lg text-lg"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >✕</button>
            )}
          </div>

          {/* Quick Stats */}
          <div className="flex justify-center gap-8 mt-10">
            {[
              { label: "Colleges", value: "10+" },
              { label: "States", value: "7+" },
              { label: "Courses", value: "5+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-yellow-300">{stat.value}</p>
                <p className="text-blue-200 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex gap-4 overflow-x-auto">
          <Link href="/compare" className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition whitespace-nowrap">
            ⚖️ Compare Colleges
          </Link>
          <Link href="/predictor" className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition whitespace-nowrap">
            🎯 College Predictor
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap gap-4 items-center">
        <p className="text-gray-700 font-medium text-sm">Filter by:</p>
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white"
        >
          <option value="">All States</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Delhi">Delhi</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
          <option value="Rajasthan">Rajasthan</option>
          <option value="Karnataka">Karnataka</option>
          <option value="West Bengal">West Bengal</option>
          <option value="Telangana">Telangana</option>
        </select>

        <select
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white"
        >
          <option value="">All Courses</option>
          <option value="B.Tech">B.Tech</option>
          <option value="M.Tech">M.Tech</option>
          <option value="MBA">MBA</option>
          <option value="MCA">MCA</option>
          <option value="PhD">PhD</option>
        </select>

        {(search || state || course) && (
          <button
            onClick={clearFilters}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition"
          >
            ✕ Clear All
          </button>
        )}

        <p className="text-gray-400 text-sm ml-auto">
          {loading ? "🔍 Searching..." : `${colleges.length} colleges found`}
        </p>
      </div>

      {/* College Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        {loading ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl font-medium">Finding colleges...</p>
          </div>
        ) : colleges.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-6xl mb-4">😕</div>
            <p className="text-xl font-medium mb-2">No colleges found</p>
            <p className="text-gray-400">Try different search terms or filters</p>
            <button onClick={clearFilters} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-6 text-sm">
        <p>🎓 CollegeFinder — Helping students find their dream college</p>
      </footer>
    </div>
  );
}