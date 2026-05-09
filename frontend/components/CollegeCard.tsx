"use client";
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

export default function CollegeCard({ college }: { college: College }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-5 border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-lg font-bold text-gray-800">{college.name}</h2>
        <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-2 py-1 rounded-full">
          ⭐ {college.rating}
        </span>
      </div>

      {/* Location */}
      <p className="text-gray-500 text-sm mb-3">
        📍 {college.location}, {college.state}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-500">Annual Fees</p>
          <p className="text-sm font-semibold text-gray-800">
            ₹{college.fees.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-500">Avg Placement</p>
          <p className="text-sm font-semibold text-gray-800">
            {college.placement} LPA
          </p>
        </div>
      </div>

      {/* Courses */}
      <div className="flex flex-wrap gap-1 mb-4">
        {college.courses.slice(0, 3).map((course) => (
          <span
            key={course}
            className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full"
          >
            {course}
          </span>
        ))}
        {college.courses.length > 3 && (
          <span className="text-xs text-gray-400">
            +{college.courses.length - 3} more
          </span>
        )}
      </div>

      {/* Button */}
      <Link
        href={`/colleges/${college.id}`}
        className="block text-center bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
      >
        View Details →
      </Link>
    </div>
  );
}