import mongoose from 'mongoose';
const examAttemptSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    answers: [{
            type: Number,
            required: true
        }],
    score: {
        type: Number,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
export const ExamAttempt = mongoose.model('ExamAttempt', examAttemptSchema);
