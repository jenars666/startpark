import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  googleId: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: String,
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
});

userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

export default mongoose.model('User', userSchema);
