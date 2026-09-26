const gold = "#B8960C";
const near = "#1A1A1A";
const warm = "#6B6560";
const divC = "#E8E4DC";
const ivory = "#FAFAF7";

const statusConfig = {
  green:  { label: "On Time",   color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  yellow: { label: "Pending",   color: "#ca8a04", bg: "#fefce8", border: "#fde68a" },
  red:    { label: "Overdue",   color: "#dc2626", bg: "#fff5f5", border: "#fecaca" },
  done:   { label: "Completed", color: gold,      bg: "#fefdf7", border: "#fde68a" },
};

export default function KaajTable({ kaajList, onEdit, onDelete, sortField, sortOrder, onSort }) {

  const SortBtn = ({ field }) => (
    <span className="ml-1 text-xs"
      style={{ color: sortField === field ? gold : "#ccc" }}>
      {sortField === field ? (sortOrder === "asc" ? "↑" : "↓") : "↕"}
    </span>
  );

  const fmtDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  const fmtIST = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit", month: "short",
      hour: "2-digit", minute: "2-digit", hour12: true,
    });
  };

  const thStyle = {
    padding: "10px 14px",
    textAlign: "left",
    fontSize: "10px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    color: warm,
    background: "#F2EDE3",
    borderBottom: `1px solid ${divC}`,
    whiteSpace: "nowrap",
  };

  const tdStyle = {
    padding: "14px",
    borderBottom: `1px solid #F5F0E8`,
    verticalAlign: "top",
  };

  return (
    <div style={{ background: ivory, border: `1px solid ${divC}` }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr>
              <th style={thStyle}>#</th>
              <th style={{ ...thStyle, cursor: "pointer" }}
                onClick={() => onSort("karigorName")}>
                Karigor <SortBtn field="karigorName" />
              </th>
              <th style={thStyle}>Kaaj Details</th>
              <th style={{ ...thStyle, cursor: "pointer" }}
                onClick={() => onSort("issueDate")}>
                Issue Date <SortBtn field="issueDate" />
              </th>
              <th style={thStyle}>Issue Ojon</th>
              <th style={thStyle}>Receive Ojon</th>
              <th style={thStyle}>Extra</th>
              <th style={thStyle}>Receive Date</th>
              <th style={{ ...thStyle, cursor: "pointer" }}
                onClick={() => onSort("daysPending")}>
                Status <SortBtn field="daysPending" />
              </th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {kaajList.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ ...tdStyle, textAlign: "center", padding: "64px" }}>
                  <p className="serif" style={{ color: "#C4BFB8", fontSize: "1.1rem", fontStyle: "italic" }}>
                    No records found
                  </p>
                  <p style={{ color: "#D4CFCA", fontSize: "12px", marginTop: "8px", letterSpacing: "0.1em" }}>
                    Add a new kaaj to get started
                  </p>
                </td>
              </tr>
            ) : (
              kaajList.map((k, i) => {
                const s = statusConfig[k.status] || statusConfig.green;
                const rowBg =
                  k.status === "red" ? "#fff8f8"
                  : k.status === "yellow" ? "#fffef5"
                  : ivory;
                return (
                  <tr key={k._id}
                    style={{ background: rowBg }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F0E8")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = rowBg)}>

                    {/* # */}
                    <td style={{ ...tdStyle, color: "#C4BFB8", fontSize: "11px" }}>
                      {i + 1}
                    </td>

                    {/* Karigor */}
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                          width: "28px", height: "28px",
                          background: gold,
                          color: "#fff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "11px", fontWeight: "700",
                          flexShrink: 0,
                        }}>
                          {k.karigorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                            <span style={{ fontWeight: "600", color: near }}>
                              {k.karigorName}
                            </span>
                            <span style={{
                              fontSize: "10px", fontWeight: "600",
                              padding: "1px 7px",
                              border: `1px solid ${k.kaajType === "repair" ? "#fed7aa" : "#fde68a"}`,
                              background: k.kaajType === "repair" ? "#fff7ed" : "#fefce8",
                              color: k.kaajType === "repair" ? "#ea580c" : gold,
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                            }}>
                              {k.kaajType === "repair" ? "Repair" : "New"}
                            </span>
                          </div>
                          {k.karigorPhone && (
                            <p style={{ fontSize: "11px", color: "#C4BFB8", marginTop: "2px" }}>
                              {k.karigorPhone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Kaaj Details */}
                    <td style={{ ...tdStyle, maxWidth: "200px" }}>
                      <p style={{ fontWeight: "600", color: near }}>{k.kaajName}</p>
                      <p style={{ fontSize: "11px", color: warm, marginTop: "2px" }}>
                        {k.properties}
                      </p>
                      {k.notes && (
                        <p style={{ fontSize: "11px", color: "#60a5fa", marginTop: "2px", fontStyle: "italic" }}>
                          {k.notes}
                        </p>
                      )}
                      <div style={{ marginTop: "6px" }}>
                        <p style={{ fontSize: "10px", color: "#C4BFB8", letterSpacing: "0.04em" }}>
                          Created: {fmtIST(k.createdAt)}
                        </p>
                        <p style={{ fontSize: "10px", color: "#D4CFCA", letterSpacing: "0.04em" }}>
                          Updated: {fmtIST(k.updatedAt)}
                        </p>
                      </div>
                    </td>

                    {/* Issue Date */}
                    <td style={{ ...tdStyle, color: warm, whiteSpace: "nowrap", fontSize: "12px" }}>
                      {fmtDate(k.issueDate)}
                    </td>

                    {/* Issue Ojon */}
                    <td style={tdStyle}>
                      <span style={{ fontWeight: "600", color: near }}>
                        {k.issueOjon}
                        <span style={{ fontSize: "10px", color: warm, marginLeft: "2px" }}>g</span>
                      </span>
                    </td>

                    {/* Receive Ojon */}
                    <td style={tdStyle}>
                      {k.receiveOjon ? (
                        <span style={{ fontWeight: "600", color: near }}>
                          {k.receiveOjon}
                          <span style={{ fontSize: "10px", color: warm, marginLeft: "2px" }}>g</span>
                        </span>
                      ) : (
                        <span style={{ color: "#D4CFCA" }}>—</span>
                      )}
                    </td>

                    {/* Extra */}
                    <td style={tdStyle}>
                      {k.extraOjon != null ? (
                        <span style={{
                          fontWeight: "600",
                          color: parseFloat(k.extraOjon) > 0 ? "#16a34a"
                            : parseFloat(k.extraOjon) < 0 ? "#dc2626"
                            : warm,
                        }}>
                          {k.extraOjon}
                          <span style={{ fontSize: "10px", color: warm, marginLeft: "2px" }}>g</span>
                        </span>
                      ) : (
                        <span style={{ color: "#D4CFCA" }}>—</span>
                      )}
                    </td>

                    {/* Receive Date */}
                    <td style={{ ...tdStyle, color: warm, whiteSpace: "nowrap", fontSize: "12px" }}>
                      {fmtDate(k.receiveDate)}
                    </td>

                    {/* Status */}
                    <td style={tdStyle}>
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "3px 10px",
                        border: `1px solid ${s.border}`,
                        background: s.bg,
                        color: s.color,
                        fontSize: "11px",
                        fontWeight: "600",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}>
                        <span style={{
                          width: "5px", height: "5px",
                          borderRadius: "50%",
                          background: s.color,
                          flexShrink: 0,
                        }} />
                        {s.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={tdStyle}>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        <button onClick={() => onEdit(k)}
                          className="transition-colors duration-200"
                          style={{
                            fontSize: "11px",
                            fontWeight: "600",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            padding: "4px 12px",
                            border: `1px solid ${divC}`,
                            color: warm,
                            background: "transparent",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = gold;
                            e.currentTarget.style.color = gold;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = divC;
                            e.currentTarget.style.color = warm;
                          }}>
                          Edit
                        </button>
                        {k.status === "done" && (
                          <button onClick={() => onDelete(k)}
                            className="transition-colors duration-200"
                            style={{
                              fontSize: "11px",
                              fontWeight: "600",
                              letterSpacing: "0.12em",
                              textTransform: "uppercase",
                              padding: "4px 12px",
                              border: "1px solid #fecaca",
                              color: "#dc2626",
                              background: "transparent",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#fff5f5")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <style>{`.serif { font-family: Georgia, 'Times New Roman', serif; }`}</style>
    </div>
  );
}