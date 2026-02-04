import express from "express";
import {
  submitLevel1Decision,
  submitLevel2Decision,
  submitLevel3Decision,
  submitLevel4Decision,
  submitLevel5Decision,
  getPlayerResults,
  getAllPlayerResults,
  checkSubmissionStatus,
} from "../controllers/levelDecision.controller.js";

const router = express.Router();

// Submit decisions by level
router.post("/level1", submitLevel1Decision);
router.post("/level2", submitLevel2Decision);
router.post("/level3", submitLevel3Decision);
router.post("/level4", submitLevel4Decision);
router.post("/level5", submitLevel5Decision);

// Get results
router.get("/results/:playerId/level/:level", getPlayerResults);
router.get("/results/:playerId/all", getAllPlayerResults);

// Check submission status
router.get("/status/:playerId", checkSubmissionStatus);

export default router;
