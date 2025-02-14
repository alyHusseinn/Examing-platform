import { Request, Response } from 'express';
import { validationResult, check } from 'express-validator';
import { Subject } from '../models/Subject.js';
import { UserSubjectLevel } from '../models/UserSubjectLevel.js';
import { generateQuestions } from '../services/gemini.js';
import { Exam } from '../models/Exam.js';

interface AuthRequest extends Request {
    user?: any;
}

export const createSubject = [
    check('name').notEmpty().withMessage('Subject name is required'),
    check('description').notEmpty().withMessage('Description is required'),

    async (req: AuthRequest, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, description } = req.body;

        try {
            const subject = await Subject.create({ name, description });
            res.status(201).json(subject);

            const easyQuestions = await generateQuestions(subject.name, subject.description, 'easy');
            const mediumQuestions = await generateQuestions(subject.name, subject.description, 'medium');
            const hardQuestions = await generateQuestions(subject.name, subject.description, 'hard');

            await Exam.create({
                subject: subject._id,
                difficulty: 'easy',
                questions: easyQuestions.questions.map((question: any) => ({
                    text: question.text,
                    options: question.options,
                    correctAnswer: question.correctAnswer,
                    difficulty: 'easy'
                })),
                resources: easyQuestions.resources,
            });

            await Exam.create({
                subject: subject._id,
                difficulty: 'medium',
                questions: mediumQuestions.questions.map((question: any) => ({
                    text: question.text,
                    options: question.options,
                    correctAnswer: question.correctAnswer,
                    difficulty: 'medium'
                })),
                resources: mediumQuestions.resources,
            });

            await Exam.create({
                subject: subject._id,
                difficulty: 'hard',
                questions: hardQuestions.questions.map((question: any) => ({
                    text: question.text,
                    options: question.options,
                    correctAnswer: question.correctAnswer,
                    difficulty: 'hard'
                })),
                resources: hardQuestions.resources,
            });

            res.status(201).json({ message: 'Subject created successfully' });
        }
        catch (error) {
            res.status(500).json({ message: 'Error creating subject' });
        }
    }
]

export const getAllSubjects = async (req: Request, res: Response) => {
    try {
        const subjects = await Subject.find();
        res.status(200).json(subjects);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching subjects' });
    }
}

export const getSubjectById = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        const subject = await Subject.findById(id);
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        const userSubjectLevel = await UserSubjectLevel.findOne({ subject: id, user: req?.user._id });
        res.status(200).json({ ...subject, level: userSubjectLevel?.level || 0 });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching subject' });
    }
}



