import { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import KaajTable from "../components/KaajTable";
import KaajModal from "../components/KaajModal";

const gold = "#B8960C";
const ivory = "#FAFAF7";
const near = "#1A1A1A";
const warm = "#6B6560";
const div = "#E8E4DC";

export default function Dashboard() {
  const [kaajList, setKaajList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [kaajTypeFilter, setKaajTypeFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchKaaj = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (kaajTypeFilter && kaajTypeFilter !== "all")
        params.kaajType = kaajTypeFilter;
      const res = await api.get("/kaaj", { params });
      setKaajList(res.data.data);
    } catch {
      toast.error("Failed to fetch records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKaaj();
    setCurrentPage(1);
  }, [search, statusFilter, kaajTypeFilter]);

  const handleSort = (field) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortOrder("asc"); }
    setCurrentPage(1);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/kaaj/${deleteConfirm._id}`);
      toast.success("Record deleted");
      setDeleteConfirm(null);
      fetchKaaj();
    } catch (e) {
      toast.error(e.response?.data?.message || "Delete failed");
    }
  };

  const confirmDeleteAll = async () => {
    try {
      const res = await api.delete("/kaaj/completed/all");
      toast.success(res.data.message);
      setDeleteAllConfirm(false);
      fetchKaaj();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleExport = async () => {
    try {
      const res = await api.get("/kaaj/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("download", `karigor-${Date.now()}.xlsx`);
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("Export successful");
    } catch {
      toast.error("No completed records to export");
    }
  };

  const stats = {
    total: kaajList.length,
    green: kaajList.filter((k) => k.status === "green").length,
    yellow: kaajList.filter((k) => k.status === "yellow").length,
    red: kaajList.filter((k) => k.status === "red").length,
    done: kaajList.filter((k) => k.status === "done").length,
    repair: kaajList.filter((k) => k.kaajType === "repair").length,
  };

  const sorted = [...kaajList].sort((a, b) => {
    if (sortField === "karigorName")
      return sortOrder === "asc"
        ? a.karigorName.localeCompare(b.karigorName)
        : b.karigorName.localeCompare(a.karigorName);
    if (sortField === "issueDate")
      return sortOrder === "asc"
        ? new Date(a.issueDate) - new Date(b.issueDate)
        : new Date(b.issueDate) - new Date(a.issueDate);
    if (sortField === "daysPending") {
      const da = a.receiveDate ? 0 : Math.floor((new Date() - new Date(a.issueDate)) / 86400000);
      const db = b.receiveDate ? 0 : Math.floor((new Date() - new Date(b.issueDate)) / 86400000);
      return sortOrder === "asc" ? da - db : db - da;
    }
    return sortOrder === "asc"
      ? new Date(a.createdAt) - new Date(b.createdAt)
      : new Date(b.createdAt) - new Date(a.createdAt);
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const currentItems = sorted.slice(start, start + itemsPerPage);

  const selectStyle = {
    background: ivory,
    border: `1px solid ${div}`,
    color: near,
    borderRadius: "0px",
    padding: "8px 14px",
    fontSize: "13px",
    outline: "none",
    letterSpacing: "0.04em",
  };

  return (
    <div className="min-h-screen" style={{ background: "#F7F5F0", color: near }}>
      <Navbar />

      <div className="max-w-screen-xl mx-auto px-6 sm:px-10 py-10">

        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-6" style={{ background: gold }} />
            <span className="text-xs tracking-widest font-medium"
              style={{ color: gold, letterSpacing: "0.22em", textTransform: "uppercase" }}>
              Dashboard
            </span>
          </div>
          <h2 className="serif mb-1"
            style={{ fontSize: "2rem", fontWeight: "400", color: near }}>
            Karigor Work Records
          </h2>
          <p className="text-sm" style={{ color: warm, fontWeight: "300" }}>
            Track and manage all karigor work items in real time
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-px mb-10"
          style={{ background: div }}>
          {[
            { label: "Total", value: stats.total, accent: near },
            { label: "On Time", value: stats.green, accent: "#16a34a" },
            { label: "Pending", value: stats.yellow, accent: "#ca8a04" },
            { label: "Overdue", value: stats.red, accent: "#dc2626" },
            { label: "Completed", value: stats.done, accent: gold },
            { label: "Repair", value: stats.repair, accent: "#ea580c" },
          ].map((s) => (
            <div key={s.label} className="p-6 text-center"
              style={{ background: ivory }}>
              <p className="serif mb-1"
                style={{ fontSize: "1.75rem", fontWeight: "400", color: s.accent }}>
                {s.value}
              </p>
              <div className="mx-auto mb-1.5 h-px w-5" style={{ background: div }} />
              <p className="text-xs tracking-widest font-medium"
                style={{ color: warm, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap gap-3 items-center justify-between py-4 border-y"
          style={{ borderColor: div }}>

          {/* Left — filters */}
          <div className="flex flex-wrap gap-3 items-center flex-1">

            {/* Search */}
            <div className="relative flex-1 min-w-48">
              <input
                type="text"
                placeholder="Search karigor or kaaj..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-2 pr-4 text-sm outline-none"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: `1px solid ${div}`,
                  color: near,
                  letterSpacing: "0.03em",
                  paddingLeft: "0",
                }}
                onFocus={(e) => (e.target.style.borderBottomColor = gold)}
                onBlur={(e) => (e.target.style.borderBottomColor = div)}
              />
            </div>

            <select value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              style={selectStyle}>
              <option value="">All Status</option>
              <option value="green">On Time</option>
              <option value="yellow">Pending</option>
              <option value="red">Overdue</option>
              <option value="done">Completed</option>
            </select>

            <select value={kaajTypeFilter}
              onChange={(e) => { setKaajTypeFilter(e.target.value); setCurrentPage(1); }}
              style={selectStyle}>
              <option value="all">All Types</option>
              <option value="new">New Work</option>
              <option value="repair">Repair</option>
            </select>

            <select value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              style={selectStyle}>
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>

          {/* Right — actions */}
          <div className="flex gap-3 items-center flex-wrap">
            <button onClick={handleExport}
              className="text-xs font-medium tracking-widest py-2.5 px-5 transition-all duration-200 border"
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "#16a34a",
                borderColor: "#d1fae5",
                background: "#f0fdf4",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#dcfce7")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#f0fdf4")}>
              Export Excel
            </button>

            {stats.done > 0 && (
              <button
                onClick={() => {
                  if (stats.done === 0) { toast.error("No completed records"); return; }
                  setDeleteAllConfirm(true);
                }}
                className="text-xs font-medium tracking-widest py-2.5 px-5 transition-all duration-200 border"
                style={{
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "#dc2626",
                  borderColor: "#fecaca",
                  background: "#fff5f5",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#fff5f5")}>
                Delete Completed ({stats.done})
              </button>
            )}

            <button
              onClick={() => { setEditData(null); setModalOpen(true); }}
              className="text-xs font-medium tracking-widest py-2.5 px-6 transition-all duration-200"
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                background: near,
                color: ivory,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = gold)}
              onMouseLeave={(e) => (e.currentTarget.style.background = near)}>
              + Add Kaaj
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-24 text-center border" style={{ borderColor: div, background: ivory }}>
            <p className="text-sm tracking-widest" style={{ color: warm, letterSpacing: "0.15em" }}>
              Loading records...
            </p>
          </div>
        ) : (
          <>
            <KaajTable
              kaajList={currentItems}
              onEdit={(k) => { setEditData(k); setModalOpen(true); }}
              onDelete={(k) => setDeleteConfirm(k)}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between py-4 border-t mt-0"
                style={{ borderColor: div }}>
                <p className="text-xs" style={{ color: warm, letterSpacing: "0.08em" }}>
                  Showing {start + 1}–{Math.min(start + itemsPerPage, sorted.length)} of {sorted.length}
                </p>
                <div className="flex items-center gap-1">
                  {["«", "‹"].map((ch, i) => (
                    <button key={ch}
                      onClick={() => setCurrentPage(i === 0 ? 1 : (p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-8 h-8 flex items-center justify-center text-sm border disabled:opacity-30 transition"
                      style={{ borderColor: div, color: warm }}
                      onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.borderColor = gold)}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = div)}>
                      {ch}
                    </button>
                  ))}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const p = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    return (
                      <button key={p}
                        onClick={() => setCurrentPage(p)}
                        className="w-8 h-8 flex items-center justify-center text-xs border transition"
                        style={{
                          borderColor: currentPage === p ? gold : div,
                          background: currentPage === p ? gold : "transparent",
                          color: currentPage === p ? "#fff" : warm,
                        }}>
                        {p}
                      </button>
                    );
                  })}
                  {["›", "»"].map((ch, i) => (
                    <button key={ch}
                      onClick={() => setCurrentPage(i === 0 ? (p) => Math.min(totalPages, p + 1) : totalPages)}
                      disabled={currentPage === totalPages}
                      className="w-8 h-8 flex items-center justify-center text-sm border disabled:opacity-30 transition"
                      style={{ borderColor: div, color: warm }}
                      onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.borderColor = gold)}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = div)}>
                      {ch}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add / Edit Modal */}
      <KaajModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditData(null); }}
        onSuccess={fetchKaaj}
        editData={editData}
      />

      {/* Delete single */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(26,26,26,0.6)" }}>
          <div className="w-full max-w-sm p-10 border"
            style={{ background: ivory, borderColor: div }}>
            <div className="text-center">
              <div className="serif text-4xl mb-4" style={{ color: gold }}>!</div>
              <h3 className="serif mb-2"
                style={{ fontSize: "1.3rem", fontWeight: "400", color: near }}>
                Delete Record?
              </h3>
              <div className="mx-auto my-4 h-px w-8" style={{ background: div }} />
              <div className="text-sm mb-6" style={{ color: warm }}>
                <p><strong>{deleteConfirm.karigorName}</strong></p>
                <p>{deleteConfirm.kaajName}</p>
              </div>
              <p className="text-xs mb-8" style={{ color: "#C4BFB8", letterSpacing: "0.1em" }}>
                This action cannot be undone
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 text-xs tracking-widest font-medium border transition"
                  style={{ textTransform: "uppercase", letterSpacing: "0.15em", borderColor: div, color: warm }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = near)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = div)}>
                  Cancel
                </button>
                <button onClick={confirmDelete}
                  className="flex-1 py-3 text-xs tracking-widest font-medium transition"
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    background: "#dc2626",
                    color: "#fff",
                  }}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete all completed */}
      {deleteAllConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(26,26,26,0.6)" }}>
          <div className="w-full max-w-sm p-10 border"
            style={{ background: ivory, borderColor: div }}>
            <div className="text-center">
              <div className="serif text-4xl mb-4" style={{ color: gold }}>!</div>
              <h3 className="serif mb-2"
                style={{ fontSize: "1.3rem", fontWeight: "400", color: near }}>
                Delete All Completed?
              </h3>
              <div className="mx-auto my-4 h-px w-8" style={{ background: div }} />
              <p className="text-sm mb-3" style={{ color: warm }}>
                This will permanently delete{" "}
                <strong>{stats.done} completed</strong> records.
              </p>
              <p className="text-xs mb-8 py-3 border"
                style={{ color: "#ca8a04", borderColor: "#fef3c7", background: "#fffbeb", letterSpacing: "0.05em" }}>
                Ensure you have exported records before deleting
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteAllConfirm(false)}
                  className="flex-1 py-3 text-xs tracking-widest font-medium border transition"
                  style={{ textTransform: "uppercase", letterSpacing: "0.15em", borderColor: div, color: warm }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = near)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = div)}>
                  Cancel
                </button>
                <button onClick={confirmDeleteAll}
                  className="flex-1 py-3 text-xs tracking-widest font-medium transition"
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    background: "#dc2626",
                    color: "#fff",
                  }}>
                  Delete All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`.serif { font-family: Georgia, 'Times New Roman', serif; }`}</style>
    </div>
  );
}