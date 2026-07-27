const cron = require("node-cron");
const Kaaj = require("../models/kaaj.model");
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
        console.log("No overdue items today");
        return;
      }

      // Build email content
      const itemsList = overdueItems
        .map((kaaj, index) => {
          const days = Math.floor(
            (new Date() - new Date(kaaj.issueDate)) /
            (1000 * 60 * 60 * 24)
          );
          return `
            <tr>
              <td style="padding:8px;border:1px solid #ddd">${index + 1}</td>
              <td style="padding:8px;border:1px solid #ddd">${kaaj.karigorName}</td>
              <td style="padding:8px;border:1px solid #ddd">${kaaj.kaajName}</td>
              <td style="padding:8px;border:1px solid #ddd">${kaaj.issueOjon}g</td>
              <td style="padding:8px;border:1px solid #ddd;color:red">${days} days</td>
            </tr>
          `;
        })
        .join("");

      const html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#FFD700;padding:20px;text-align:center">
            <h2 style="margin:0;color:#000">⚠️ Gold Karigor Tracker</h2>
            <p style="margin:5px 0;color:#000">Daily Overdue Alert</p>
          </div>
          <div style="padding:20px">
            <p>Good morning,</p>
            <p>The following kaaj items are <strong style="color:red">overdue (4+ days)</strong>:</p>
            <table style="width:100%;border-collapse:collapse;margin:15px 0">
              <thead>
                <tr style="background:#f5f5f5">
                  <th style="padding:8px;border:1px solid #ddd">#</th>
                  <th style="padding:8px;border:1px solid #ddd">Karigor Name</th>
                  <th style="padding:8px;border:1px solid #ddd">Kaaj Name</th>
                  <th style="padding:8px;border:1px solid #ddd">Issue Ojon</th>
                  <th style="padding:8px;border:1px solid #ddd">Days Overdue</th>
                </tr>
              </thead>
              <tbody>${itemsList}</tbody>
            </table>
            <p>Total overdue items: <strong>${overdueItems.length}</strong></p>
            <p>Please follow up with the karigor immediately.</p>
          </div>
          <div style="background:#f5f5f5;padding:15px;text-align:center">
            <p style="margin:0;color:#666;font-size:12px">
              Gold Karigor Tracker — Automated Alert System
            </p>
          </div>
        </div>
      `;

      await sendEmail(
        process.env.MANAGER_EMAIL,
        `⚠️ ${overdueItems.length} Overdue Kaaj Items - Action Required`,
        html
      );

      console.log(`Alert email sent for ${overdueItems.length} overdue items`);
    } catch (error) {
      console.error("Alert job error:", error.message);
    }
  });

  console.log("Daily alert job scheduled for 10:00 AM");
};

module.exports = startAlertJob;