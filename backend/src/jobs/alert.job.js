const cron = require("node-cron");
const Kaaj = require("../models/kaaj.model");
const User = require("../models/user.model");
const sendEmail = require("../config/email");

const startAlertJob = () => {
  // Runs every day at 10:00 AM
  cron.schedule("0 10 * * *", async () => {
    console.log("Running daily alert job...");

    try {
      // Get all pending kaaj
      const allKaaj = await Kaaj.find({ receiveDate: null });

      // Filter red items (4+ days)
      const overdueItems = allKaaj.filter(
        (kaaj) => kaaj.status === "red"
      );

      if (!overdueItems.length) {
        console.log("No overdue items today. No emails sent.");
        return;
      }

      // Get ALL active managers from DB
      const managers = await User.find({
        role: "manager",
        isActive: true,
        name: { $ne: "pending" },
      }).select("email name");

      if (!managers.length) {
        console.log("No active managers found. No emails sent.");
        return;
      }

      console.log(
        `Found ${overdueItems.length} overdue items`
      );
      console.log(
        `Sending alerts to ${managers.length} managers`
      );

      // Build overdue items table
      const itemsList = overdueItems
        .map((kaaj, index) => {
          const days = Math.floor(
            (new Date() - new Date(kaaj.issueDate)) /
            (1000 * 60 * 60 * 24)
          );
          return `
            <tr>
              <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;color:#374151">
                ${index + 1}
              </td>
              <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827">
                ${kaaj.karigorName}
              </td>
              <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;color:#374151">
                ${kaaj.kaajName}
              </td>
              <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;color:#374151">
                ${kaaj.issueOjon}g
              </td>
              <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6">
                <span style="background:#FEE2E2;color:#DC2626;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600">
                  ${days} days overdue
                </span>
              </td>
            </tr>
          `;
        })
        .join("");

      // Send email to each manager
      for (const manager of managers) {
        const html = `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb">

            <!-- Header -->
            <div style="background:linear-gradient(135deg,#F59E0B,#D97706);padding:30px;text-align:center">
              <div style="font-size:32px;margin-bottom:8px">💛</div>
              <h1 style="color:white;margin:0;font-size:22px;font-weight:700">
                Gold Karigor Tracker
              </h1>
              <p style="color:#FEF3C7;margin:6px 0 0;font-size:14px">
                Daily Overdue Alert — ${new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <!-- Body -->
            <div style="background:#ffffff;padding:30px">
              <p style="color:#374151;font-size:16px;margin:0 0 8px">
                Good morning, <strong>${manager.name}</strong> 👋
              </p>
              <p style="color:#6B7280;font-size:14px;margin:0 0 20px">
                The following karigor work items require your immediate attention:
              </p>

              <!-- Alert box -->
              <div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:12px;padding:16px;margin-bottom:24px;display:flex;align-items:center;gap:12px">
                <span style="font-size:24px">🔴</span>
                <div>
                  <p style="margin:0;font-weight:700;color:#DC2626;font-size:16px">
                    ${overdueItems.length} item${overdueItems.length > 1 ? "s" : ""} overdue
                  </p>
                  <p style="margin:4px 0 0;color:#EF4444;font-size:13px">
                    These have not been received for 4+ days
                  </p>
                </div>
              </div>

              <!-- Table -->
              <table style="width:100%;border-collapse:collapse;font-size:14px">
                <thead>
                  <tr style="background:#F9FAFB">
                    <th style="padding:10px 12px;text-align:left;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid #E5E7EB">
                      #
                    </th>
                    <th style="padding:10px 12px;text-align:left;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid #E5E7EB">
                      Karigor Name
                    </th>
                    <th style="padding:10px 12px;text-align:left;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid #E5E7EB">
                      Kaaj Name
                    </th>
                    <th style="padding:10px 12px;text-align:left;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid #E5E7EB">
                      Issue Ojon
                    </th>
                    <th style="padding:10px 12px;text-align:left;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid #E5E7EB">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                </tbody>
              </table>

              <!-- Action message -->
              <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:12px;padding:16px;margin-top:24px">
                <p style="margin:0;color:#92400E;font-size:14px;font-weight:600">
                  ⚡ Action Required
                </p>
                <p style="margin:6px 0 0;color:#B45309;font-size:13px">
                  Please follow up with these karigor workers immediately
                  and update the status in the system once work is received.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background:#F9FAFB;padding:20px;text-align:center;border-top:1px solid #E5E7EB">
              <p style="margin:0;color:#9CA3AF;font-size:12px">
                This is an automated alert from
                <strong>Gold Karigor Tracker</strong>
              </p>
              <p style="margin:6px 0 0;color:#D1D5DB;font-size:11px">
                Sent to: ${manager.email}
              </p>
            </div>

          </div>
        `;

        await sendEmail(
          manager.email,
          `🔴 ${overdueItems.length} Overdue Kaaj Alert - Action Required`,
          html
        );

        console.log(`✅ Alert sent to: ${manager.email}`);
      }

      console.log(
        `Alert job complete. Emails sent to ${managers.length} managers.`
      );

    } catch (error) {
      console.error("Alert job error:", error.message);
    }
  });

  console.log("Daily alert job scheduled for 10:00 AM");
};

module.exports = startAlertJob;

