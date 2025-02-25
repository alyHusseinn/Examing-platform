import { UserSubjectLevel } from '../models/UserSubjectLevel.js';
import { ExamAttempt } from '../models/ExamAttempt.js';
import { AuthRequest } from "../middleware/auth.js";
import { Response } from 'express';
import { User } from '../models/User.js';

export const getUserStats = async (req: AuthRequest, res: Response) => {
  try {
    let id = req.user.id;
    if(req.user.role == 'admin') {
        id = req.params.id;
    }

    const examAttempts = await ExamAttempt.find({ user: id });
    const userSubjectLevels = await UserSubjectLevel.find({ user: id });
    const user = await User.findById(id).select("-password");
    
    const stats = {
      user,
      totalExams: examAttempts.length,
      passedExams: examAttempts.filter(attempt => attempt.completed).length,
      averageScore: examAttempts.reduce((acc, curr) => acc + curr.score, 0) / examAttempts.length || 0,
      subjectsInProgress: userSubjectLevels.length,
      studyHours: Math.round(examAttempts.length * 0.5), // Assuming each exam takes 30 minutes
      highestLevel: Math.max(...userSubjectLevels.map(level => level.level), 0)
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user statistics' });
  }
}; 