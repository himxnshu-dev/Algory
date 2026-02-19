import asyncHandler from 'express-async-handler';
import Problem from '../models/Problem.js';

const getProblems = asyncHandler(async (req, res) => {
    const filter = { userId: req.user._id };

    if (req.query.topic) filter.topic = req.query.topic;
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;
    if (req.query.status) filter.status = req.query.status;

    const problems = await Problem.find(filter).sort({ createdAt: -1 });
    res.json(problems);
});

const createProblem = asyncHandler(async (req, res) => {
    const { title, platform, topic, difficulty, status, solutionCode } = req.body;

    const problem = await Problem.create({
        userId: req.user._id,
        title,
        platform: platform || 'LeetCode',
        topic,
        difficulty,
        status: status || 'Unsolved',
        solutionCode: solutionCode || '',
    });

    res.status(201).json(problem);
});

const updateProblem = asyncHandler(async (req, res) => {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
        res.status(404);
        throw new Error('Problem not found');
    }

    if (problem.userId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }

    const updated = await Problem.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.json(updated);
});

const deleteProblem = asyncHandler(async (req, res) => {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
        res.status(404);
        throw new Error('Problem not found');
    }

    if (problem.userId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }

    await Problem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Problem removed' });
});

const getProblemStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    oneYearAgo.setHours(0, 0, 0, 0);

    const [statusStats, topicStats, difficultyStats, totalCount, dailyActivity] =
        await Promise.all([
            Problem.aggregate([
                { $match: { userId } },
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]),
            Problem.aggregate([
                { $match: { userId } },
                { $group: { _id: '$topic', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
            Problem.aggregate([
                { $match: { userId } },
                { $group: { _id: '$difficulty', count: { $sum: 1 } } },
            ]),
            Problem.countDocuments({ userId }),
            Problem.aggregate([
                {
                    $match: {
                        userId,
                        createdAt: { $gte: oneYearAgo },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                        },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
        ]);

    const statusMap = {};
    statusStats.forEach((s) => (statusMap[s._id] = s.count));

    const dailyMap = {};
    dailyActivity.forEach((d) => (dailyMap[d._id] = d.count));

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i <= 365; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        if (dailyMap[key]) {
            tempStreak++;
            if (i === 0 || currentStreak > 0) currentStreak = tempStreak;
        } else {
            if (i === 0) {
                currentStreak = 0;
            }
            if (tempStreak > longestStreak) longestStreak = tempStreak;
            if (currentStreak === 0 && i > 0) {
                tempStreak = 0;
            } else {
                tempStreak = 0;
            }
        }
    }
    if (tempStreak > longestStreak) longestStreak = tempStreak;

    res.json({
        total: totalCount,
        solved: statusMap['Solved'] || 0,
        revision: statusMap['Revision'] || 0,
        unsolved: statusMap['Unsolved'] || 0,
        topicDistribution: topicStats.map((t) => ({
            name: t._id,
            count: t.count,
        })),
        difficultyDistribution: difficultyStats.map((d) => ({
            name: d._id,
            count: d.count,
        })),
        dailyActivity: dailyActivity.map((d) => ({
            date: d._id,
            count: d.count,
        })),
        currentStreak,
        longestStreak,
    });
});

export {
    getProblems,
    createProblem,
    updateProblem,
    deleteProblem,
    getProblemStats,
};
