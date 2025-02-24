import mongoose from 'mongoose';
const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
export const Subject = mongoose.model('Subject', subjectSchema);
