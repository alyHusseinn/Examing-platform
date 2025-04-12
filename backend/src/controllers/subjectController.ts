import { Request, Response } from 'express';
import { validationResult, check } from 'express-validator';
import { Subject } from '../models/Subject.js';
import { UserSubjectLevel } from '../models/UserSubjectLevel.js';
import { AIService } from '../services/gemini.js';
import { Exam } from '../models/Exam.js';
// import { ExamAttempt } from '../models/ExamAttempt.js';
import mongoose from 'mongoose';

// Types
interface AuthRequest extends Request {
    user?: any;
}
// Validation
const subjectValidation = [
    check('name').notEmpty().withMessage('Subject name is required'),
    check('description').notEmpty().withMessage('Description is required'),
];

// Helper functions
const createExamForDifficulty = async (subjectId: mongoose.Types.ObjectId, difficulty: string, questions: any) => {
    return Exam.create({
        subject: subjectId,
        difficulty,
        questions: questions.questions.map((question: any) => ({
            text: question.text,
            options: question.options,
            correctAnswer: question.correctAnswer,
            difficulty
        })),
        resources: questions.resources,
    });
};

const handleValidationErrors = (req: Request) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw { status: 400, errors: errors.array() };
    }
};

// Controllers
export class SubjectController {
    static async createSubject(req: AuthRequest, res: Response) {
        try {
            handleValidationErrors(req);
            const { name, description } = req.body;
            // Generate questions for each difficulty level separately
            const [easyExam, intermediateExam, hardExam] = await Promise.all([
                AIService.generateQuestions(name, description, 'easy'),
                AIService.generateQuestions(name, description, 'intermediate'),
                AIService.generateQuestions(name, description, 'hard')
            ]);            
            
            const subject = await Subject.create({ name, description });


            // Create exams for all difficulty levels
            await Promise.all([
                createExamForDifficulty(subject._id, 'easy', easyExam),
                createExamForDifficulty(subject._id, 'intermediate', intermediateExam),
                createExamForDifficulty(subject._id, 'hard', hardExam)
            ]);


            return res.status(201).json({ message: 'Subject created successfully', id: subject._id });
        } catch (error: any) {
            console.error('Error creating subject:', error);
            const status = error.status || 500;
            const message = error.status ? error.errors : 'Error creating subject';
            return res.status(status).json({ 
                message,
                error: error.message 
            });
        }
    }

    static async getAllSubjects(req: AuthRequest, res: Response) {
        try {
            const subjects = await Subject.find();
            
            // Get user levels for all subjects
            const userLevels = await UserSubjectLevel.find({
                user: req?.user?._id,
                subject: { $in: subjects.map(s => s._id) }
            });

            // Create a map using subject IDs as strings for direct lookup
            const levelMap = new Map(
                userLevels.map(ul => [ul?.subject?.toString(), ul.level])
            );

            // Merge subjects with their levels
            const subjectsWithLevel = subjects.map(subject => ({
                ...subject.toObject(),
                level: levelMap.get(subject._id.toString()) || 0
            }));

            return res.status(200).json(subjectsWithLevel);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching subjects' });
        }
    }

    static async getSubjectById(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            
            // Validate MongoDB ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'Invalid subject ID format' });
            }

            const [subject, userSubjectLevel] = await Promise.all([
                Subject.findById(id),
                UserSubjectLevel.findOne({
                    subject: id,
                    user: req?.user._id
                })
            ]);

            if (!subject) {
                return res.status(404).json({ message: 'Subject not found' });
            }

            return res.status(200).json({
                ...subject.toObject(),
                level: userSubjectLevel?.level || 0
            });
        } catch (error) {
            console.error('Error fetching subject:', error);
            return res.status(500).json({ message: 'Error fetching subject' });
        }
    }

    static async deleteSubject(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;

            // Delete associated exams
            await Exam.deleteMany({ subject: id });
            
            // Delete associated user subject levels
            await UserSubjectLevel.deleteMany({ subject: id });

            // // Delete Attempts
            // await ExamAttempt.deleteMany({ subject: id });

            // Delete the subject
            const subject = await Subject.findByIdAndDelete(id);
            
            if (!subject) {
                return res.status(404).json({ message: 'Subject not found' });
            }

            return res.status(200).json({ message: 'Subject deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting subject' });
        }
    }
}

// Export routes with validation
export const routes = {
    createSubject: [...subjectValidation, SubjectController.createSubject],
    getAllSubjects: SubjectController.getAllSubjects,
    getSubjectById: SubjectController.getSubjectById,
    deleteSubject: SubjectController.deleteSubject
};