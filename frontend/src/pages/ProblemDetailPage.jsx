import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProblems, deleteProblem } from '../features/problems/problemSlice';
import { reviewCode, resetAi } from '../features/ai/aiSlice';
import ReactMarkdown from 'react-markdown';
import Spinner from '../components/Spinner';
import {
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineSparkles,
    HiOutlineArrowLeft,
} from 'react-icons/hi';

const difficultyColor = {
    Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Hard: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const statusColor = {
    Solved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Revision: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Unsolved: 'bg-surface-800 text-surface-400 border-surface-700',
};

const ProblemDetailPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { problems, isLoading } = useSelector((state) => state.problems);
    const { feedback, isLoading: aiLoading, isError: aiError, message: aiMessage } = useSelector(
        (state) => state.ai
    );

    const problem = problems.find((p) => p._id === id);

    useEffect(() => {
        if (problems.length === 0) {
            dispatch(getProblems({}));
        }
        return () => {
            dispatch(resetAi());
        };
    }, [dispatch, problems.length]);

    const handleDelete = () => {
        if (window.confirm('Delete this problem?')) {
            dispatch(deleteProblem(id));
            navigate('/problems');
        }
    };

    const handleReview = () => {
        if (problem?.solutionCode) {
            dispatch(reviewCode({ problemId: id, code: problem.solutionCode }));
        }
    };

    if (isLoading && !problem) return <Spinner />;

    if (!problem) {
        return (
            <div className="text-center py-20">
                <p className="text-surface-500 text-sm">Problem not found.</p>
                <Link to="/problems" className="text-indigo-400 hover:text-indigo-300 text-sm mt-2 inline-block">
                    Back to problems
                </Link>
            </div>
        );
    }

    const displayFeedback = feedback || problem.aiFeedback;

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <Link
                to="/problems"
                className="inline-flex items-center gap-1.5 text-surface-500 hover:text-white text-sm transition-colors"
            >
                <HiOutlineArrowLeft className="w-4 h-4" />
                Back to problems
            </Link>

            <div className="bg-surface-900 border border-surface-800 rounded-xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-white">{problem.title}</h1>
                        <p className="text-surface-500 text-sm mt-1">{problem.platform}</p>
                        <div className="flex items-center gap-2 mt-3">
                            <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium border ${difficultyColor[problem.difficulty]}`}>
                                {problem.difficulty}
                            </span>
                            <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium border ${statusColor[problem.status]}`}>
                                {problem.status}
                            </span>
                            <span className="text-xs text-surface-600">
                                {problem.topic}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            to={`/problems/${id}/edit`}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-surface-700 text-sm text-surface-400 hover:text-white hover:bg-surface-800 transition-colors"
                        >
                            <HiOutlinePencil className="w-4 h-4" />
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-surface-700 text-sm text-surface-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-colors"
                        >
                            <HiOutlineTrash className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {problem.solutionCode && (
                <div className="bg-surface-900 border border-surface-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-white">Solution Code</h2>
                        <button
                            onClick={handleReview}
                            disabled={aiLoading}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium hover:bg-indigo-500/20 disabled:opacity-50 transition-colors"
                        >
                            <HiOutlineSparkles className="w-4 h-4" />
                            {aiLoading ? 'Reviewing...' : 'AI Review'}
                        </button>
                    </div>
                    <pre className="bg-surface-950 border border-surface-800 rounded-lg p-4 overflow-x-auto">
                        <code className="text-sm text-surface-300 font-mono leading-relaxed whitespace-pre-wrap">
                            {problem.solutionCode}
                        </code>
                    </pre>
                </div>
            )}

            {aiLoading && (
                <div className="bg-surface-900 border border-surface-800 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-surface-400">AI is analyzing your code...</p>
                    </div>
                </div>
            )}

            {aiError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <p className="text-sm text-red-400">{aiMessage}</p>
                </div>
            )}

            {displayFeedback && !aiLoading && (
                <div className="bg-surface-900 border border-surface-800 rounded-xl p-6">
                    <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <HiOutlineSparkles className="w-4 h-4 text-indigo-400" />
                        AI Review
                    </h2>
                    <div className="markdown-content">
                        <ReactMarkdown>{displayFeedback}</ReactMarkdown>
                    </div>
                </div>
            )}

            <div className="text-xs text-surface-600 pb-4">
                Created: {new Date(problem.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                {problem.updatedAt !== problem.createdAt && (
                    <> · Updated: {new Date(problem.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</>
                )}
            </div>
        </div>
    );
};

export default ProblemDetailPage;
