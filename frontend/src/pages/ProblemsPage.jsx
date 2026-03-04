import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProblems, deleteProblem, reset } from '../features/problems/problemSlice';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { HiOutlineTrash, HiOutlinePencil, HiOutlineEye, HiOutlineFilter } from 'react-icons/hi';

const TOPICS = [
    'Arrays', 'Strings', 'Linked List', 'Stack', 'Queue', 'Trees',
    'Graphs', 'Dynamic Programming', 'Greedy', 'Backtracking',
    'Binary Search', 'Sorting', 'Hashing', 'Math', 'Bit Manipulation', 'Other',
];

const difficultyColor = {
    Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Hard: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const statusColor = {
    Solved: 'text-emerald-400',
    Revision: 'text-amber-400',
    Unsolved: 'text-surface-500',
};

const ProblemsPage = () => {
    const dispatch = useDispatch();
    const { problems, isLoading } = useSelector((state) => state.problems);
    const [filters, setFilters] = useState({ topic: '', difficulty: '', status: '' });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const activeFilters = {};
        if (filters.topic) activeFilters.topic = filters.topic;
        if (filters.difficulty) activeFilters.difficulty = filters.difficulty;
        if (filters.status) activeFilters.status = filters.status;
        dispatch(getProblems(activeFilters));
        return () => {
            dispatch(reset());
        };
    }, [dispatch, filters]);

    const handleDelete = (id) => {
        if (window.confirm('Delete this problem?')) {
            dispatch(deleteProblem(id));
        }
    };

    const clearFilters = () => {
        setFilters({ topic: '', difficulty: '', status: '' });
    };

    const hasActiveFilters = filters.topic || filters.difficulty || filters.status;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Problems</h1>
                    <p className="text-surface-500 text-sm mt-1">
                        {problems.length} problem{problems.length !== 1 ? 's' : ''} tracked
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${hasActiveFilters
                            ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400'
                            : 'border-surface-800 text-surface-400 hover:text-white hover:bg-surface-900'
                            }`}
                    >
                        <HiOutlineFilter className="w-4 h-4" />
                        Filters
                    </button>
                    <Link
                        to="/problems/new"
                        className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                        + Add Problem
                    </Link>
                </div>
            </div>

            {showFilters && (
                <div className="bg-surface-900 border border-surface-800 rounded-xl p-4 animate-slide-up">
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-xs text-surface-500 font-medium mb-1.5">Topic</label>
                            <select
                                value={filters.topic}
                                onChange={(e) => setFilters((f) => ({ ...f, topic: e.target.value }))}
                                className="w-full bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/50"
                            >
                                <option value="">All Topics</option>
                                {TOPICS.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-xs text-surface-500 font-medium mb-1.5">Difficulty</label>
                            <select
                                value={filters.difficulty}
                                onChange={(e) => setFilters((f) => ({ ...f, difficulty: e.target.value }))}
                                className="w-full bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/50"
                            >
                                <option value="">All Difficulties</option>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-xs text-surface-500 font-medium mb-1.5">Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                                className="w-full bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500/50"
                            >
                                <option value="">All Statuses</option>
                                <option value="Solved">Solved</option>
                                <option value="Unsolved">Unsolved</option>
                                <option value="Revision">Revision</option>
                            </select>
                        </div>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-surface-500 hover:text-white transition-colors py-2"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            )}

            {isLoading ? (
                <Spinner />
            ) : problems.length === 0 ? (
                <div className="bg-surface-900 border border-surface-800 rounded-xl p-12 text-center">
                    <p className="text-surface-500 text-sm">
                        {hasActiveFilters
                            ? 'No problems match your filters.'
                            : 'No problems yet. Start by adding your first problem!'}
                    </p>
                    {!hasActiveFilters && (
                        <Link
                            to="/problems/new"
                            className="inline-block mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                        >
                            + Add your first problem
                        </Link>
                    )}
                </div>
            ) : (
                <div className="bg-surface-900 border border-surface-800 rounded-xl overflow-hidden">
                    <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-surface-800 text-xs text-surface-500 font-medium uppercase tracking-wider">
                        <div className="col-span-4">Title</div>
                        <div className="col-span-2">Topic</div>
                        <div className="col-span-1">Platform</div>
                        <div className="col-span-2">Difficulty</div>
                        <div className="col-span-1">Status</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>

                    {problems.map((problem) => (
                        <div
                            key={problem._id}
                            className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-3.5 border-b border-surface-800/60 last:border-b-0 hover:bg-surface-800/30 transition-colors group"
                        >
                            <div className="col-span-4">
                                <Link
                                    to={`/problems/${problem._id}`}
                                    className="text-sm font-medium text-white hover:text-indigo-400 transition-colors"
                                >
                                    {problem.title}
                                </Link>
                            </div>
                            <div className="col-span-2 text-sm text-surface-400">{problem.topic}</div>
                            <div className="col-span-1 text-sm text-surface-500">{problem.platform}</div>
                            <div className="col-span-2">
                                <span
                                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${difficultyColor[problem.difficulty]
                                        }`}
                                >
                                    {problem.difficulty}
                                </span>
                            </div>
                            <div className={`col-span-1 text-sm font-medium ${statusColor[problem.status]}`}>
                                {problem.status}
                            </div>
                            <div className="col-span-2 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link
                                    to={`/problems/${problem._id}`}
                                    className="p-1.5 rounded-md text-surface-500 hover:text-white hover:bg-surface-700 transition-colors"
                                >
                                    <HiOutlineEye className="w-4 h-4" />
                                </Link>
                                <Link
                                    to={`/problems/${problem._id}/edit`}
                                    className="p-1.5 rounded-md text-surface-500 hover:text-white hover:bg-surface-700 transition-colors"
                                >
                                    <HiOutlinePencil className="w-4 h-4" />
                                </Link>
                                <button
                                    onClick={() => handleDelete(problem._id)}
                                    className="p-1.5 rounded-md text-surface-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                    <HiOutlineTrash className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProblemsPage;
