import { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function KaajModal({ isOpen, onClose, onSuccess, editData }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    karigorName: "",
    karigorPhone: "",
    kaajName: "",
    properties: "",
    notes: "",
    issueDate: new Date().toISOString().split("T")[0],
    issueOjon: "",
    receiveOjon: "",
    receiveDate: "",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        karigorName: editData.karigorName || "",
        karigorPhone: editData.karigorPhone || "",
        kaajName: editData.kaajName || "",
        properties: editData.properties || "",
        notes: editData.notes || "",
        issueDate: editData.issueDate?.split("T")[0] || "",
        issueOjon: editData.issueOjon || "",
        receiveOjon: editData.receiveOjon || "",
        receiveDate: editData.receiveDate?.split("T")[0] || "",
      });
    } else {
      setForm({
        karigorName: "",
        karigorPhone: "",
        kaajName: "",
        properties: "",
        notes: "",
        issueDate: new Date().toISOString().split("T")[0],
        issueOjon: "",
        receiveOjon: "",
        receiveDate: "",
      });
    }
  }, [editData, isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editData) {
        await api.put(`/kaaj/${editData._id}`, form);
        toast.success("Kaaj updated successfully");
      } else {
        await api.post("/kaaj", form);
        toast.success("Kaaj added successfully");
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {editData ? "Edit Kaaj" : "Add New Kaaj"}
            </h2>
            <p className="text-gray-400 text-sm mt-0.5">
              {editData
                ? "Update karigor work item details"
                : "Fill in the karigor work item details"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Karigor Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Karigor Name
              <span className="text-red-400 ml-1">*</span>
              <span className="text-gray-400 font-normal ml-1">(কারিগরের নাম)</span>
            </label>
            <input
              name="karigorName"
              value={form.karigorName}
              onChange={handleChange}
              required
              placeholder="e.g. Rahim Mia"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-800 placeholder-gray-400 transition text-sm"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Phone Number
              <span className="text-gray-400 font-normal ml-1">(Optional)</span>
            </label>
            <input
              name="karigorPhone"
              value={form.karigorPhone}
              onChange={handleChange}
              placeholder="e.g. 01711000001"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-800 placeholder-gray-400 transition text-sm"
            />
          </div>

          {/* Kaaj Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Kaaj Name
              <span className="text-red-400 ml-1">*</span>
              <span className="text-gray-400 font-normal ml-1">(কাজের নাম)</span>
            </label>
            <input
              name="kaajName"
              value={form.kaajName}
              onChange={handleChange}
              required
              placeholder="e.g. Necklace Design, Ring Polish"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-800 placeholder-gray-400 transition text-sm"
            />
          </div>

          {/* Properties */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Properties
              <span className="text-red-400 ml-1">*</span>
              <span className="text-gray-400 font-normal ml-1">(বিবরণ)</span>
            </label>
            <textarea
              name="properties"
              value={form.properties}
              onChange={handleChange}
              required
              rows={2}
              placeholder="e.g. 2 gold chains, 1 pendant, enamel materials"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-800 placeholder-gray-400 transition text-sm resize-none"
            />
          </div>

          {/* Issue Date + Issue Ojon */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Issue Date
                <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="date"
                name="issueDate"
                value={form.issueDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-800 transition text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Issue Ojon (g)
                <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="number"
                name="issueOjon"
                value={form.issueOjon}
                onChange={handleChange}
                required
                step="0.01"
                placeholder="e.g. 45.5"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-800 placeholder-gray-400 transition text-sm"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-gray-200 pt-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Fill below when work is returned
            </p>

            {/* Receive Date + Receive Ojon */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Receive Date
                </label>
                <input
                  type="date"
                  name="receiveDate"
                  value={form.receiveDate}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-800 transition text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Receive Ojon (g)
                </label>
                <input
                  type="number"
                  name="receiveOjon"
                  value={form.receiveOjon}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="e.g. 44.8"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-800 placeholder-gray-400 transition text-sm"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Notes
              <span className="text-gray-400 font-normal ml-1">(Optional — max 200 chars)</span>
            </label>
            <input
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="e.g. Customer waiting urgently"
              maxLength={200}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 text-gray-800 placeholder-gray-400 transition text-sm"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white py-3 rounded-xl font-semibold transition shadow-lg shadow-yellow-100 disabled:opacity-50 text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </span>
              ) : editData ? (
                "Update Kaaj"
              ) : (
                "Save Kaaj"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}