import { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import KaajTable from "../components/KaajTable";
import KaajModal from "../components/KaajModal";

export default function Dashboard() {
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [kaajList, setKaajList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchKaaj = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await api.get("/kaaj", { params });
      setKaajList(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKaaj();
    setCurrentPage(1);
  }, [search, statusFilter]);

  const handleEdit = (kaaj) => {
    setEditData(kaaj);
    setModalOpen(true);
  };

  const handleDelete = (kaaj) => {
    setDeleteConfirm(kaaj);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/kaaj/${deleteConfirm._id}`);
      toast.success("Kaaj deleted successfully");
      setDeleteConfirm(null);
      fetchKaaj();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };
  const handleSort = (field) => {
  if (sortField === field) {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  } else {
    setSortField(field);
    setSortOrder("asc");
  }
  setCurrentPage(1);
};

  const handleExport = async () => {
    try {
      const res = await api.get("/kaaj/export", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `karigor-report-${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Export successful");
    } catch (error) {
      toast.error("No completed kaaj to export");
    }
  };

  const stats = {
    total: kaajList.length,
    green: kaajList.filter((k) => k.status === "green").length,
    yellow: kaajList.filter((k) => k.status === "yellow").length,
    red: kaajList.filter((k) => k.status === "red").length,
    done: kaajList.filter((k) => k.status === "done").length,
  };

  //const startIndex = (currentPage - 1) * itemsPerPage;
  //const endIndex = startIndex + itemsPerPage;
  // Sort logic
const sortedList = [...kaajList].sort((a, b) => {
  if (sortField === "karigorName") {
    return sortOrder === "asc"
      ? a.karigorName.localeCompare(b.karigorName)
      : b.karigorName.localeCompare(a.karigorName);
  }
  if (sortField === "issueDate") {
    return sortOrder === "asc"
      ? new Date(a.issueDate) - new Date(b.issueDate)
      : new Date(b.issueDate) - new Date(a.issueDate);
  }
  if (sortField === "daysPending") {
    const daysA = a.receiveDate
      ? 0
      : Math.floor((new Date() - new Date(a.issueDate)) / 86400000);
    const daysB = b.receiveDate
      ? 0
      : Math.floor((new Date() - new Date(b.issueDate)) / 86400000);
    return sortOrder === "asc" ? daysA - daysB : daysB - daysA;
  }
  if (sortField === "createdAt") {
    return sortOrder === "asc"
      ? new Date(a.createdAt) - new Date(b.createdAt)
      : new Date(b.createdAt) - new Date(a.createdAt);
  }
  return 0;
});

const totalPages = Math.ceil(sortedList.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const currentItems = sortedList.slice(startIndex, endIndex);

  const statCards = [
    {
      label: "Total Records",
      value: stats.total,
      icon: "📋",
      bg: "bg-white",
      text: "text-gray-800",
      border: "border-gray-100",
      sub: "text-gray-500",
    },
    {
      label: "On Time",
      value: stats.green,
      icon: "✅",
      bg: "bg-white",
      text: "text-green-700",
      border: "border-green-100",
      sub: "text-green-500",
    },
    {
      label: "Pending (2+ days)",
      value: stats.yellow,
      icon: "⚠️",
      bg: "bg-white",
      text: "text-yellow-700",
      border: "border-yellow-100",
      sub: "text-yellow-500",
    },
    {
      label: "Overdue (4+ days)",
      value: stats.red,
      icon: "🔴",
      bg: "bg-white",
      text: "text-red-700",
      border: "border-red-100",
      sub: "text-red-500",
    },
    {
      label: "Completed",
      value: stats.done,
      icon: "🏆",
      bg: "bg-white",
      text: "text-blue-700",
      border: "border-blue-100",
      sub: "text-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Karigor Work Dashboard
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Track and manage all karigor work items
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className={`${stat.bg} border ${stat.border} rounded-2xl p-5 shadow-sm`}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className={`text-3xl font-bold ${stat.text}`}>
                {stat.value}
              </p>
              <p className={`text-xs font-medium mt-1 ${stat.sub}`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-100">
          <div className="flex flex-wrap gap-3 items-center justify-between">

            {/* Search + Filter */}
            <div className="flex gap-3 flex-1 flex-wrap">

              {/* Search */}
              <div className="relative flex-1 min-w-48">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by karigor or kaaj name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm bg-gray-50"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50 text-gray-700"
              >
              <option value="">All Status</option>
              <option value="green">✅ On Time</option>
              <option value="yellow">⚠️ Pending</option>
              <option value="red">🔴 Overdue</option>
              <option value="done">🏆 Done</option>
              </select>
              
              {/* Items per page */}
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50 text-gray-700"
              >
                <option value={10}>10 / page</option>
                <option value={25}>25 / page</option>
                <option value={50}>50 / page</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-4 py-2.5 rounded-xl text-sm font-semibold transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Excel
              </button>
              <button
                onClick={() => {
                  setEditData(null);
                  setModalOpen(true);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-md shadow-yellow-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Kaaj
              </button>
            </div>

          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-24 text-center">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin h-10 w-10 text-yellow-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-gray-400 font-medium">Loading records...</p>
            </div>
          </div>
        ) : (
          <>
            <KaajTable
  kaajList={currentItems}
  onEdit={handleEdit}
  onDelete={handleDelete}
  sortField={sortField}
  sortOrder={sortOrder}
  onSort={handleSort}
/>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 bg-white rounded-2xl px-5 py-3.5 shadow-sm border border-gray-100 flex-wrap gap-3">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-gray-700">
                    {startIndex + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-gray-700">
                    {Math.min(endIndex, sortedList.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-700">
                    {sortedList.length}
                  </span>{" "}
                  records
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                  >
                    «
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => p - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                  >
                    ‹ Prev
                  </button>
                  {(() => {
                    const pages = [];
                    const showPages = 2;
                    if (currentPage > showPages + 1) {
                      pages.push(
                        <button key={1} onClick={() => setCurrentPage(1)}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition">
                          1
                        </button>
                      );
                      if (currentPage > showPages + 2) {
                        pages.push(
                          <span key="d1" className="px-1 text-gray-400 text-sm">...</span>
                        );
                      }
                    }
                    for (let i = Math.max(1, currentPage - showPages); i <= Math.min(totalPages, currentPage + showPages); i++) {
                      pages.push(
                        <button key={i} onClick={() => setCurrentPage(i)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${currentPage === i ? "bg-yellow-400 text-white border border-yellow-400 shadow-sm" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                          {i}
                        </button>
                      );
                    }
                    if (currentPage < totalPages - showPages) {
                      if (currentPage < totalPages - showPages - 1) {
                        pages.push(<span key="d2" className="px-1 text-gray-400 text-sm">...</span>);
                      }
                      pages.push(
                        <button key={totalPages} onClick={() => setCurrentPage(totalPages)}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition">
                          {totalPages}
                        </button>
                      );
                    }
                    return pages;
                  })()}
                  <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                  >
                    Next ›
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      <KaajModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSuccess={fetchKaaj}
        editData={editData}
      />

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Delete Record?
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                This action cannot be undone.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-1">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Karigor:</span>{" "}
                  {deleteConfirm.karigorName}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Kaaj:</span>{" "}
                  {deleteConfirm.kaajName}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition shadow-lg shadow-red-100"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}