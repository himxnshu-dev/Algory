import express from 'express';
import {
    getProblems,
    createProblem,
    updateProblem,
    deleteProblem,
    getProblemStats,
} from '../controllers/problemController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getProblems).post(protect, createProblem);
router.get('/stats', protect, getProblemStats);
router
    .route('/:id')
    .put(protect, updateProblem)
    .delete(protect, deleteProblem);

export default router;
