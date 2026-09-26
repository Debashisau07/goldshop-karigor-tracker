import { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const gold = "#B8960C";
const ivory = "#FAFAF7";
const near = "#1A1A1A";
const warm = "#6B6560";
const divC = "#E8E4DC";

export default function KaajModal({ isOpen, onClose, onSuccess, editData }) {
  const [loading, setLoading] = useState(false);
  const empty = {
    karigorName: "", karigorPhone: "", kaajType: "new",
    kaajName: "", properties: "", notes: "",
    issueDate: new Date().toISOString().split("T")[0],
    issueOjon: "", receiveOjon: "", receiveDate: "",
  };
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (editData) {
      setForm({
        karigorName: editData.karigorName || "",
        karigorPhone: editData.karigorPhone || "",
        kaajType: editData.kaajType || "new",
        kaajName: editData.kaajName || "",
        properties: editData.properties || "",
        notes: editData.notes || "",
        issueDate: editData.issueDate?.split("T")[0] || "",
        issueOjon: editData.issueOjon || "",
        receiveOjon: editData.receiveOjon || "",
        receiveDate: editData.receiveDate?.split("T")[0] || "",
      });
    } else {
      setForm(empty);
    }
  }, [editData, isOpen]);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editData) {
        await api.put(`/kaaj/${editData._id}`, form);
        toast.success("Record updated");
      } else {
        await api.post("/kaaj", form);
        toast.success("Kaaj added");
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: `1px solid ${divC}`,
    padding: "10px 0",
    fontSize: "13px",
    color: near,
    outline: "none",
    letterSpacing: "0.04em",
    transition: "border-color 0.2s",
  };

  const lbl = {
    display: "block",
    fontSize: "10px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    color: gold,
    marginBottom: "6px",
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(26,26,26,0.65)" }}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto border"
        style={{ background: ivory, borderColor: divC }}>

        {/* Header */}
        <div className="px-8 py-6 border-b flex items-center justify-between"
          style={{ borderColor: divC }}>
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <div className="h-px w-5" style={{ background: gold }} />
              <span style={{ ...lbl, marginBottom: 0 }}>
                {editData ? "Edit Record" : "New Record"}
              </span>
            </div>
            <h2 className="serif"
              style={{ fontSize: "1.4rem", fontWeight: "400", color: near }}>
              {editData ? "Update Kaaj Details" : "Add New Kaaj"}
            </h2>
          </div>
          <button onClick={onClose}
            style={{ color: warm, fontSize: "18px", background: "none", border: "none", cursor: "pointer" }}
            onMouseEnter={(e) => (e.target.style.color = near)}
            onMouseLeave={(e) => (e.target.style.color = warm)}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "32px" }}>

          {/* Kaaj Type */}
          <div style={{ marginBottom: "28px" }}>
            <label style={lbl}>Kaaj Type *</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {[
                { val: "new", label: "New Work", icon: "✦" },
                { val: "repair", label: "Repair", icon: "⚙" },
              ].map((opt) => (
                <button key={opt.val} type="button"
                  onClick={() => setForm({ ...form, kaajType: opt.val })}
                  style={{
                    padding: "12px",
                    border: `1px solid ${form.kaajType === opt.val ? gold : divC}`,
                    background: form.kaajType === opt.val ? "#fefdf7" : "transparent",
                    color: form.kaajType === opt.val ? gold : warm,
                    fontSize: "12px",
                    fontWeight: "600",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}>
                  <span>{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fields */}
          {[
            { name: "karigorName", label: "Karigor Name", required: true, placeholder: "e.g. Rahim Mia" },
            { name: "karigorPhone", label: "Phone (Optional)", required: false, placeholder: "e.g. 01711000001" },
            { name: "kaajName", label: "Kaaj Name", required: true, placeholder: "e.g. Necklace Design" },
          ].map((f) => (
            <div key={f.name} style={{ marginBottom: "24px" }}>
              <label style={lbl}>{f.label} {f.required && "*"}</label>
              <input name={f.name} value={form[f.name]}
                onChange={set} required={f.required}
                placeholder={f.placeholder}
                style={inp}
                onFocus={(e) => (e.target.style.borderBottomColor = gold)}
                onBlur={(e) => (e.target.style.borderBottomColor = divC)}
              />
            </div>
          ))}

          {/* Properties */}
          <div style={{ marginBottom: "24px" }}>
            <label style={lbl}>Properties *</label>
            <textarea name="properties" value={form.properties}
              onChange={set} required rows={2}
              placeholder="e.g. 2 gold chains, 1 pendant"
              style={{ ...inp, resize: "none", paddingTop: "10px" }}
              onFocus={(e) => (e.target.style.borderBottomColor = gold)}
              onBlur={(e) => (e.target.style.borderBottomColor = divC)}
            />
          </div>

          {/* Issue Date + Ojon */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
            <div>
              <label style={lbl}>Issue Date *</label>
              <input type="date" name="issueDate" value={form.issueDate}
                onChange={set} required
                style={{ ...inp, colorScheme: "light" }}
                onFocus={(e) => (e.target.style.borderBottomColor = gold)}
                onBlur={(e) => (e.target.style.borderBottomColor = divC)}
              />
            </div>
            <div>
              <label style={lbl}>Issue Ojon (g) *</label>
              <input type="number" name="issueOjon" value={form.issueOjon}
                onChange={set} required step="0.01" placeholder="e.g. 45.5"
                style={inp}
                onFocus={(e) => (e.target.style.borderBottomColor = gold)}
                onBlur={(e) => (e.target.style.borderBottomColor = divC)}
              />
            </div>
          </div>

          {/* Receive section */}
          <div style={{
            border: `1px dashed ${divC}`,
            padding: "20px",
            marginBottom: "24px",
          }}>
            <p style={{ ...lbl, color: warm, marginBottom: "16px" }}>
              Fill when work is returned
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={lbl}>Receive Date</label>
                <input type="date" name="receiveDate" value={form.receiveDate}
                  onChange={set}
                  style={{ ...inp, colorScheme: "light" }}
                  onFocus={(e) => (e.target.style.borderBottomColor = gold)}
                  onBlur={(e) => (e.target.style.borderBottomColor = divC)}
                />
              </div>
              <div>
                <label style={lbl}>Receive Ojon (g)</label>
                <input type="number" name="receiveOjon" value={form.receiveOjon}
                  onChange={set} step="0.01" placeholder="e.g. 44.8"
                  style={inp}
                  onFocus={(e) => (e.target.style.borderBottomColor = gold)}
                  onBlur={(e) => (e.target.style.borderBottomColor = divC)}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: "32px" }}>
            <label style={lbl}>Notes (Optional)</label>
            <input name="notes" value={form.notes}
              onChange={set} maxLength={200}
              placeholder="Any special instructions..."
              style={inp}
              onFocus={(e) => (e.target.style.borderBottomColor = gold)}
              onBlur={(e) => (e.target.style.borderBottomColor = divC)}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <button type="button" onClick={onClose}
              style={{
                padding: "14px",
                border: `1px solid ${divC}`,
                background: "transparent",
                color: warm,
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = near)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = divC)}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              style={{
                padding: "14px",
                background: loading ? warm : near,
                color: ivory,
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = gold)}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.background = near)}>
              {loading ? "Saving..." : editData ? "Update" : "Save Kaaj"}
            </button>
          </div>
        </form>

        <style>{`.serif { font-family: Georgia, 'Times New Roman', serif; }`}</style>
      </div>
    </div>
  );
}