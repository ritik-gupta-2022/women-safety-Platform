import express from "express";
import { addEmergencyContact, deleteContact, getEmergencyContacts } from "../controllers/emergencyContact.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/add-contact", verifyToken,addEmergencyContact);
router.get("/get-contacts", verifyToken,getEmergencyContacts);
router.delete("/delete-contact/:contactId/:userId", verifyToken, deleteContact);

export default router;