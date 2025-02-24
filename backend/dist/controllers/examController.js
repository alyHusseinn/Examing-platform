import { validationResult, check } from 'express-validator';
import { User } from '../models/User.js';
import { Exam } from '../models/Exam.js';
import { UserSubjectLevel } from '../models/UserSubjectLevel.js';
import { ExamAttempt } from '../models/ExamAttempt.js';
var DifficultyLevel;
(function (DifficultyLevel) {
    DifficultyLevel["EASY"] = "easy";
    DifficultyLevel["INTERMEDIATE"] = "intermediate";
    DifficultyLevel["HARD"] = "hard";
})(DifficultyLevel || (DifficultyLevel = {}));
const PASSING_SCORE = 7;
const QUESTIONS_COUNT = 10;
const examAccessRules = [
    { level: 0, difficulty: DifficultyLevel.EASY },
    { level: 1, difficulty: DifficultyLevel.INTERMEDIATE },
    { level: 2, difficulty: DifficultyLevel.HARD }
];
const hasAccessToExam = (userLevel, examDifficulty) => {
    if (!userLevel && examDifficulty !== DifficultyLevel.EASY)
        return false;
    const rule = examAccessRules.find(rule => rule.level === userLevel);
    return rule?.difficulty === examDifficulty;
};
const calculateScore = (userAnswers, correctAnswers) => {
    let score = 0;
    for (let i = 0; i < QUESTIONS_COUNT; i++) {
        if (userAnswers[i] == correctAnswers[i].correctAnswer) {
            score++;
        }
    }
    return score;
};
const updateUserLevel = async (userSubjectLevel, userId, subject) => {
    if (userSubjectLevel) {
        userSubjectLevel.level++;
        await userSubjectLevel.save();
    }
    else {
        await UserSubjectLevel.create({
            user: userId,
            subject,
            level: 1
        });
    }
};
const updateExamAttempt = async (userId, examId, score, answers) => {
    const examAttempt = await ExamAttempt.findOne({
        user: userId,
        exam: examId
    });
    if (examAttempt) {
        examAttempt.score = score;
        examAttempt.answers = Object.values(answers).map((answer) => parseInt(answer));
        examAttempt.completed = score >= PASSING_SCORE;
        await examAttempt.save();
    }
    else {
        await ExamAttempt.create({
            user: userId,
            exam: examId,
            answers: Object.values(answers).map((answer) => parseInt(answer)),
            score,
            completed: score >= PASSING_SCORE
        });
    }
};
const getExamById = async (req, res) => {
    try {
        const { id } = req.params;
        const { difficulty } = req.query;
        const exam = await Exam.findOne({ subject: id, difficulty: difficulty });
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        if (req.user.role == 'admin') {
            const attempts = await ExamAttempt.find({ exam: exam._id }).populate('user').select('user score');
            return res.json({ exam, attempts });
        }
        const userSubjectLevel = await UserSubjectLevel.findOne({
            user: req.user.id,
            subject: exam.subject
        });
        // if (!hasAccessToExam(userSubjectLevel?.level || null, exam.difficulty)) {
        //     return res.status(403).json({ message: 'You do not have access to this exam' });
        // }
        // delete the exam.questions.correctAnswer
        exam.questions.forEach((question) => {
            delete question.correctAnswer;
        });
        res.json(exam);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching exam' });
    }
};
const submitExam = [
    check('answers').isLength({ min: QUESTIONS_COUNT }),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { id } = req.params;
            const { difficulty } = req.query;
            const { answers } = req.body;
            const exam = await Exam.findOne({ subject: id, difficulty: difficulty });
            if (!exam) {
                return res.status(404).json({ message: 'Exam not found' });
            }
            const userSubjectLevel = await UserSubjectLevel.findOne({
                user: req.user.id,
                subject: exam.subject
            });
            // if (!hasAccessToExam(userSubjectLevel?.level || null, exam.difficulty)) {
            //     return res.status(403).json({ message: 'You do not have access to this exam' });
            // }
            const score = calculateScore(answers, exam.questions);
            await updateExamAttempt(req.user.id, exam._id, score, answers);
            if (score >= PASSING_SCORE) {
                await updateUserLevel(userSubjectLevel, req.user.id, exam.subject);
                await User.findByIdAndUpdate(req.user.id, { $inc: { points: score * 10 } });
            }
            res.json({ score });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error submitting exam' });
        }
    }
];
export const routes = {
    getExamById,
    submitExam
};
