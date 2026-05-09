"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/lib/api";
import Navbar from "@/components/Navbar";

interface Answer {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

interface Question {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  answers: Answer[];
}

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
  description: string;
  questions: Question[];
}

export default function CollegeDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState({ author: "", content: "" });
  const [answerMap, setAnswerMap] = useState<{ [key: number]: { author: string; content: string } }>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const res = await API.get(`/colleges/${id}`);
        setCollege(res.data);
      } catch {
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    fetchCollege();
  }, [id]);

  const submitQuestion = async () => {
    if (!question.author || !question.content) return;
    setSubmitting(true);
    try {
      await API.post(`/colleges/${id}/questions`, question);
      setQuestion({ author: "", content: "" });
      const res = await API.get(`/colleges/${id}`);
      setCollege(res.data);
    } catch {
      alert("Failed to submit question");
    } finally {
      setSubmitting(false);
    }
  };

  const submitAnswer = async (questionId: number) => {
    const ans = answerMap[questionId];
    if (!ans?.author || !ans?.content) return;
    try {
      await API.post(`/questions/${questionId}/answers`, ans);
      setAnswerMap((prev) => ({ ...prev, [questionId]: { author: "", content: "" } }));
      const res = await API.get(`/colleges/${id}`);
      setCollege(res.data);
    } catch {
      alert("Failed to submit answer");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="text-center py-20 text-gray-500">
        <div className="text-5xl mb-4">🔍</div>
        <p>Loading college details...</p>
      </div>
    </div>
  );

  if (!college) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-blue-700 text-white py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => router.back()} className="text-blue-200 text-sm mb-4 hover:text-white">
            ← Back
          </button>
          <h1 className="text-3xl font-bold mb-2">{college.name}</h1>
          <p className="text-blue-200">📍 {college.location}, {college.state}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Rating", value: `⭐ ${college.rating}` },
            { label: "Annual Fees", value: `₹${college.fees.toLocaleString()}` },
            { label: "Avg Placement", value: `${college.placement} LPA` },
            { label: "Established", value: college.established },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">About</h2>
          <p className="text-gray-600">{college.description}</p>
        </div>

        {/* Courses */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Courses Offered</h2>
          <div className="flex flex-wrap gap-2">
            {college.courses.map((course) => (
              <span key={course} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                {course}
              </span>
            ))}
          </div>
        </div>

        {/* Q&A Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">❓ Q&A</h2>

          {/* Ask Question */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">Ask a Question</h3>
            <input
              type="text"
              placeholder="Your name"
              value={question.author}
              onChange={(e) => setQuestion({ ...question, author: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2 outline-none"
            />
            <textarea
              placeholder="Your question..."
              value={question.content}
              onChange={(e) => setQuestion({ ...question, content: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 outline-none resize-none"
              rows={3}
            />
            <button
              onClick={submitQuestion}
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post Question"}
            </button>
          </div>

          {/* Questions List */}
          {college.questions.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No questions yet. Be the first to ask!</p>
          ) : (
            <div className="space-y-6">
              {college.questions.map((q) => (
                <div key={q.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-800 text-sm">🙋 {q.author}</span>
                    <span className="text-xs text-gray-400">{new Date(q.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-700 mb-4">{q.content}</p>

                  {/* Answers */}
                  {q.answers.length > 0 && (
                    <div className="ml-4 space-y-2 mb-4">
                      {q.answers.map((ans) => (
                        <div key={ans.id} className="bg-blue-50 rounded-lg p-3">
                          <span className="font-semibold text-blue-700 text-sm">💬 {ans.author}: </span>
                          <span className="text-gray-700 text-sm">{ans.content}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Answer Input */}
                  <div className="ml-4 space-y-2">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={answerMap[q.id]?.author || ""}
                      onChange={(e) => setAnswerMap((prev) => ({ ...prev, [q.id]: { ...prev[q.id], author: e.target.value } }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Write an answer..."
                      value={answerMap[q.id]?.content || ""}
                      onChange={(e) => setAnswerMap((prev) => ({ ...prev, [q.id]: { ...prev[q.id], content: e.target.value } }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
                    />
                    <button
                      onClick={() => submitAnswer(q.id)}
                      className="bg-gray-700 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-800 transition"
                    >
                      Post Answer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}