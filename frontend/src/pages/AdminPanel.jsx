import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteLink, setInviteLink] = useState("");
  const [generatingLink, setGeneratingLink] = useState(false);
  const [copied, setCopied] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const fetchManagers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/auth/managers");
      setManagers(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch managers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const generateInvite = async () => {
    setGeneratingLink(true);
    try {
      const res = await api.post("/auth/generate-invite");
      setInviteLink(res.data.data.inviteLink);
      toast.success("Invite link generated successfully");
    } catch (error) {
      toast.error("Failed to generate invite link");
    } finally {
      setGeneratingLink(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 3000);
  };

  const toggleManager = async (manager) => {
    try {
      await api.patch(`/auth/managers/${manager._id}/deactivate`);
      toast.success(
        `Manager ${manager.isActive ? "deactivated" : "activated"} successfully`
      );
      fetchManagers();
    } catch (error) {
      toast.error("Failed to update manager status");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Admin Panel
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Manage managers and invite links
          </p>
        </div>

        {/* Invite Link Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">
                Generate Invite Link
              </h3>
              <p className="text-gray-500 text-sm">
                Share this link with managers to create their account
              </p>
            </div>
          </div>

          {/* Info boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {[
              { icon: "⏰", text: "Link expires in 7 days" },
              { icon: "👤", text: "One link = one account only" },
              { icon: "🔒", text: "Only shared people can register" },
            ].map((item) => (
              <div
                key={item.text}
                className="bg-gray-50 rounded-xl p-3 flex items-center gap-2"
              >
                <span className="text-lg">{item.icon}</span>
                <p className="text-gray-600 text-xs font-medium">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* Generate button */}
          <button
            onClick={generateInvite}
            disabled={generatingLink}
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white px-6 py-3 rounded-xl font-semibold transition shadow-md shadow-yellow-100 disabled:opacity-50"
          >
            {generatingLink ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Generate New Invite Link
              </>
            )}
          </button>

          {/* Generated link */}
          {inviteLink && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-700 text-xs font-semibold mb-2 uppercase tracking-wide">
                ✅ Invite Link Ready — Share this with the manager
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inviteLink}
                  readOnly
                  className="flex-1 bg-white border border-green-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none"
                />
                <button
                  onClick={copyLink}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    copied
                      ? "bg-green-500 text-white"
                      : "bg-white border border-green-300 text-green-700 hover:bg-green-50"
                  }`}
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <p className="text-green-600 text-xs mt-2">
                ⚠️ This link can only be used once and expires in 7 days
              </p>
            </div>
          )}
        </div>

        {/* Managers List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800">
                All Managers
              </h3>
              <p className="text-gray-500 text-sm mt-0.5">
                {managers.length} manager{managers.length !== 1 ? "s" : ""} registered
              </p>
            </div>
            <button
              onClick={fetchManagers}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm font-medium transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <svg className="animate-spin h-8 w-8 text-yellow-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-gray-400">Loading managers...</p>
            </div>
          ) : managers.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                👤
              </div>
              <p className="text-gray-400 font-medium">
                No managers yet
              </p>
              <p className="text-gray-300 text-sm mt-1">
                Generate an invite link and share it
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {managers.map((manager) => (
                <div
                  key={manager._id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center text-white font-bold">
                      {manager.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {manager.name}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {manager.email}
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        Joined: {formatDate(manager.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status badge */}
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      manager.isActive
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}>
                      {manager.isActive ? "Active" : "Inactive"}
                    </span>

                    {/* Toggle button */}
                    <button
                      onClick={() => toggleManager(manager)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                        manager.isActive
                          ? "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                          : "bg-green-50 hover:bg-green-100 text-green-600 border border-green-200"
                      }`}
                    >
                      {manager.isActive ? "Deactivate" : "Activate"}
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