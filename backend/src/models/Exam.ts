import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'intermediate', 'hard'],
    required: true
  }
});

const examSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'intermediate', 'hard'],
    required: true
  },
  questions: [questionSchema],
}, {
  timestamps: true
});

export const Exam = mongoose.model('Exam', examSchema);