import mongoose from 'mongoose';

const userSubjectLevelSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
    },
    level: {
        type: Number,
        required: true,
        enum: [1, 2, 3],
    }
}, {
    timestamps: true
});

export const UserSubjectLevel = mongoose.model('UserSubjectLevel', userSubjectLevelSchema);
