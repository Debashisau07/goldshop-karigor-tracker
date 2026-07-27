const express = require("express");
const router = express.Router();
const {
  addKaaj,
  getAllKaaj,
  getKaaj,
  updateKaaj,
  deleteKaaj,
  exportKaaj,
} = require("../controllers/kaaj.controller");
const { protect } = require("../middleware/auth.middleware");
const { managerOrAdmin } = require("../middleware/role.middleware");

// All routes protected
router.use(protect);
router.use(managerOrAdmin);

// Export must be before /:id
// otherwise Express thinks "export" is an id
router.get("/export", exportKaaj);

router.get("/", getAllKaaj);
router.post("/", addKaaj);
router.get("/:id", getKaaj);
router.put("/:id", updateKaaj);
router.delete("/:id", deleteKaaj);

module.exports = router;