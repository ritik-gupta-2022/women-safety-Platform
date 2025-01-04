import express from "express";
import { anonymousComplaint, deleteComplaint, getAllAnonymousComplaints, getAllComplaints, getComplaintsByUser, registerComplaint, updateComplaintStatus } from "../controllers/complaint.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/register-complaint", verifyToken, registerComplaint);
router.get("/all-complaints", verifyToken, getAllComplaints);
router.get("/get-complaints", verifyToken, getComplaintsByUser);
router.delete("/delete-complaint/:complaintId", verifyToken, deleteComplaint)
router.post("/anonymous-complaint", verifyToken, anonymousComplaint);
router.get("/get-all-anonymous-complaints", verifyToken, getAllAnonymousComplaints);
router.put("/update-status/:complaintId", verifyToken, updateComplaintStatus);

export default router;