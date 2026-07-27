const Kaaj = require("../models/kaaj.model");
const { successResponse, errorResponse } = require("../utils/response");

// @desc  Add new kaaj
// @route POST /api/kaaj
const addKaaj = async (req, res) => {
  try {
    const {
      karigorName,
      karigorPhone,
      kaajName,
      properties,
      notes,
      issueDate,
      issueOjon,
    } = req.body;

    // Validate required fields
    if (!karigorName || !kaajName || !properties || !issueDate || !issueOjon) {
      return errorResponse(res, 400, "Please provide all required fields");
    }

    const kaaj = await Kaaj.create({
      karigorName,
      karigorPhone: karigorPhone || null,
      kaajName,
      properties,
      notes: notes || null,
      issueDate,
      issueOjon,
      createdBy: req.user._id,
    });

    return successResponse(res, 201, "Kaaj added successfully", kaaj);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc  Get all kaaj
// @route GET /api/kaaj
const getAllKaaj = async (req, res) => {
  try {
    const { search, status } = req.query;

    // Build query
    let query = {};

    // Search by karigor name or kaaj name
    if (search) {
      query.$or = [
        { karigorName: { $regex: search, $options: "i" } },
        { kaajName: { $regex: search, $options: "i" } },
      ];
    }

    // Get all records
    let kaajList = await Kaaj.find(query).sort({ createdAt: -1 });

    // Filter by status if provided
    if (status) {
      kaajList = kaajList.filter((kaaj) => kaaj.status === status);
    }

    // Add status and extraOjon to each record
    const result = kaajList.map((kaaj) => {
      const obj = kaaj.toJSON();
      return obj;
    });

    return successResponse(res, 200, "Kaaj fetched successfully", result);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc  Get single kaaj
// @route GET /api/kaaj/:id
const getKaaj = async (req, res) => {
  try {
    const kaaj = await Kaaj.findById(req.params.id);
    if (!kaaj) {
      return errorResponse(res, 404, "Kaaj not found");
    }
    return successResponse(res, 200, "Kaaj fetched", kaaj.toJSON());
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc  Update kaaj
// @route PUT /api/kaaj/:id
const updateKaaj = async (req, res) => {
  try {
    const kaaj = await Kaaj.findById(req.params.id);
    if (!kaaj) {
      return errorResponse(res, 404, "Kaaj not found");
    }

    const {
      karigorName,
      karigorPhone,
      kaajName,
      properties,
      notes,
      issueDate,
      issueOjon,
      receiveOjon,
      receiveDate,
    } = req.body;

    // Update fields
    if (karigorName) kaaj.karigorName = karigorName;
    if (karigorPhone !== undefined) kaaj.karigorPhone = karigorPhone;
    if (kaajName) kaaj.kaajName = kaajName;
    if (properties) kaaj.properties = properties;
    if (notes !== undefined) kaaj.notes = notes;
    if (issueDate) kaaj.issueDate = issueDate;
    if (issueOjon) kaaj.issueOjon = issueOjon;
    if (receiveOjon !== undefined) kaaj.receiveOjon = receiveOjon;
    if (receiveDate !== undefined) kaaj.receiveDate = receiveDate;

    await kaaj.save();

    return successResponse(res, 200, "Kaaj updated successfully", kaaj.toJSON());
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc  Delete kaaj
// @route DELETE /api/kaaj/:id
const deleteKaaj = async (req, res) => {
  try {
    const kaaj = await Kaaj.findById(req.params.id);
    if (!kaaj) {
      return errorResponse(res, 404, "Kaaj not found");
    }

    // Only allow delete if kaaj is completed
    if (!kaaj.receiveDate) {
      return errorResponse(
        res,
        400,
        "Cannot delete incomplete kaaj. Please mark as received first."
      );
    }

    await Kaaj.findByIdAndDelete(req.params.id);
    return successResponse(res, 200, "Kaaj deleted successfully");
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc  Export completed kaaj
// @route GET /api/kaaj/export
const exportKaaj = async (req, res) => {
  try {
    const ExcelJS = require("exceljs");

    // Get completed kaaj only
    const completedKaaj = await Kaaj.find({
      receiveDate: { $ne: null },
    }).sort({ createdAt: -1 });

    if (!completedKaaj.length) {
      return errorResponse(res, 404, "No completed kaaj to export");
    }

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Completed Kaaj");

    // Define columns
    worksheet.columns = [
      { header: "Karigor Name", key: "karigorName", width: 20 },
      { header: "Karigor Phone", key: "karigorPhone", width: 15 },
      { header: "Kaaj Name", key: "kaajName", width: 20 },
      { header: "Properties", key: "properties", width: 30 },
      { header: "Notes", key: "notes", width: 20 },
      { header: "Issue Date", key: "issueDate", width: 15 },
      { header: "Issue Ojon (g)", key: "issueOjon", width: 15 },
      { header: "Receive Ojon (g)", key: "receiveOjon", width: 15 },
      { header: "Extra Ojon (g)", key: "extraOjon", width: 15 },
      { header: "Receive Date", key: "receiveDate", width: 15 },
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD700" },
    };

    // Add rows
    completedKaaj.forEach((kaaj) => {
      const obj = kaaj.toJSON();
      worksheet.addRow({
        karigorName: obj.karigorName,
        karigorPhone: obj.karigorPhone || "-",
        kaajName: obj.kaajName,
        properties: obj.properties,
        notes: obj.notes || "-",
        issueDate: new Date(obj.issueDate).toLocaleDateString("en-IN"),
        issueOjon: obj.issueOjon,
        receiveOjon: obj.receiveOjon || "-",
        extraOjon: obj.extraOjon || "-",
        receiveDate: new Date(obj.receiveDate).toLocaleDateString("en-IN"),
      });
    });

    // Send file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=karigor-report-${Date.now()}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  addKaaj,
  getAllKaaj,
  getKaaj,
  updateKaaj,
  deleteKaaj,
  exportKaaj,
};