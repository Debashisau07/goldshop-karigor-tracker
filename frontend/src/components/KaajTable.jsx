const statusConfig = {
  green: {
    bg: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
    label: "On Time",
    row: "",
  },
  yellow: {
    bg: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    dot: "bg-yellow-500",
    label: "Pending",
    row: "bg-yellow-50/50",
  },
  red: {
    bg: "bg-red-50 text-red-700 border border-red-200",
    dot: "bg-red-500",
    label: "Overdue",
    row: "bg-red-50/50",
  },
  done: {
    bg: "bg-blue-50 text-blue-700 border border-blue-200",
    dot: "bg-blue-500",
    label: "Completed",
    row: "bg-blue-50/30",
  },
};

export default function KaajTable({
  kaajList,
  onEdit,
  onDelete,
  sortField,
  sortOrder,
  onSort,
}) {
  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <span className="text-gray-300 ml-1">↕</span>;
    }
    return (
      <span className="text-yellow-500 ml-1">
        {sortOrder === "asc" ? "↑" : "↓"}
      </span>
    );
  };
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  const formatIST = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th
                onClick={() => onSort("karigorName")}
                className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
              >
                Karigor <SortIcon field="karigorName" />
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Kaaj Details
              </th>
              <th
                onClick={() => onSort("issueDate")}
                className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
              >
                Issue Date <SortIcon field="issueDate" />
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Issue Ojon
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Receive Ojon
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Extra
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Receive Date
              </th>
              <th
                onClick={() => onSort("daysPending")}
                className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
              >
                Status <SortIcon field="daysPending" />
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {kaajList.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl">
                      📋
                    </div>
                    <p className="text-gray-400 font-medium">
                      No records found
                    </p>
                    <p className="text-gray-300 text-xs">
                      Add a new kaaj to get started
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              kaajList.map((kaaj, index) => {
                const status = statusConfig[kaaj.status] || statusConfig.green;
                return (
                  <tr
                    key={kaaj._id}
                    className={`${status.row} hover:bg-gray-50 transition-colors`}
                  >
                    <td className="px-5 py-4 text-gray-400 font-medium text-xs">
                      {index + 1}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {kaaj.karigorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {kaaj.karigorName}
                          </p>
                          {kaaj.karigorPhone && (
                            <p className="text-gray-400 text-xs">
                              {kaaj.karigorPhone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-800">
                        {kaaj.kaajName}
                      </p>
                      <p className="text-gray-400 text-xs truncate max-w-40 mt-0.5">
                        {kaaj.properties}
                      </p>
                      {kaaj.notes && (
                        <p className="text-blue-400 text-xs mt-0.5 italic">
                          Note: {kaaj.notes}
                        </p>
                      )}
                      <div className="mt-1.5 space-y-0.5">
                        <p className="text-grey-300 text-xs">
                          🕐 Created: {formatIST(kaaj.createdAt)}
                        </p>
                        <p className="text-grey-300 text-xs">
                          🕐 Updated: {formatIST(kaaj.updatedAt)}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-xs whitespace-nowrap">
                      {formatDate(kaaj.issueDate)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-gray-800">
                        {kaaj.issueOjon}
                        <span className="text-gray-400 font-normal text-xs ml-0.5">
                          g
                        </span>
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {kaaj.receiveOjon ? (
                        <span className="font-semibold text-gray-800">
                          {kaaj.receiveOjon}
                          <span className="text-gray-400 font-normal text-xs ml-0.5">
                            g
                          </span>
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {kaaj.extraOjon ? (
                        <span className="font-semibold text-orange-500">
                          {kaaj.extraOjon}
                          <span className="text-orange-300 font-normal text-xs ml-0.5">
                            g
                          </span>
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-xs whitespace-nowrap">
                      {formatDate(kaaj.receiveDate)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${status.bg}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                        />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEdit(kaaj)}
                          className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </button>
                        {kaaj.status === "done" && (
                          <button
                            onClick={() => onDelete(kaaj)}
                            className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
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
    </div>
  );
}
