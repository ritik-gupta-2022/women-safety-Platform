import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Resolved'],
        default: 'Pending',
    },
    location: {
        type: String,
        required: true,
    },
    isAnonymous: {
        type: Boolean,
        default: false, 
    },
}, { timestamps: true })

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;