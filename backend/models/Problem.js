import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    platform: {
      type: String,
      default: 'LeetCode',
      trim: true,
    },
    topic: {
      type: String,
      required: [true, 'Please add a topic'],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: [true, 'Please select difficulty'],
    },
    status: {
      type: String,
      enum: ['Unsolved', 'Solved', 'Revision'],
      default: 'Unsolved',
    },
    solutionCode: {
      type: String,
      default: '',
    },
    aiFeedback: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Problem = mongoose.model('Problem', problemSchema);
export default Problem;
