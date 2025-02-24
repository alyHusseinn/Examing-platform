import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'student' | 'admin';
  points: number;
  // resetPasswordToken: string;
  // resetPasswordExpires: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  points: {
    type: Number,
    default: 0
  },
  // resetPasswordToken: String,
  // resetPasswordExpires: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate reset password token
// userSchema.methods.getResetPasswordToken = function() {
//   const resetToken = crypto.randomBytes(20).toString('hex');
//   this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
//   this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
//   return resetToken;
// };

export const User = mongoose.model<IUser>('User', userSchema);