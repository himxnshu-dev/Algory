import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProblem } from '../features/problems/problemSlice';

const TOPICS = [
    'Arrays', 'Strings', 'Linked List', 'Stack', 'Queue', 'Trees',
    'Graphs', 'Dynamic Programming', 'Greedy', 'Backtracking',
    'Binary Search', 'Sorting', 'Hashing', 'Math', 'Bit Manipulation', 'Other',
];

const AddProblemPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        platform: 'LeetCode',
        topic: 'Arrays',
        difficulty: 'Easy',
        status: 'Unsolved',
        solutionCode: '',
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, isError, message } = useSelector((state) => state.problems);

    const onChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(createProblem(formData));
        if (!result.error) {
            navigate('/problems');
        }
    };

    const inputClass =
        'w-full bg-surface-900 border border-surface-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-surface-600 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-colors outline-none';
    const labelClass = 'block text-sm text-surface-400 font-medium mb-1.5';

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white tracking-tight">Add Problem</h1>
                <p className="text-surface-500 text-sm mt-1">Log a new DSA problem</p>
            </div>

            {isError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
                    {message}
                </div>
            )}

            <form onSubmit={onSubmit} className="bg-surface-900 border border-surface-800 rounded-xl p-6 space-y-5">
                <div>
                    <label className={labelClass}>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={onChange}
                        required
                        className={inputClass}
                        placeholder="Two Sum"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Platform</label>
                        <input
                            type="text"
                            name="platform"
                            value={formData.platform}
                            onChange={onChange}
                            className={inputClass}
                            placeholder="LeetCode"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Topic</label>
                        <select name="topic" value={formData.topic} onChange={onChange} className={inputClass}>
                            {TOPICS.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Difficulty</label>
                        <select name="difficulty" value={formData.difficulty} onChange={onChange} className={inputClass}>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Status</label>
                        <select name="status" value={formData.status} onChange={onChange} className={inputClass}>
                            <option value="Unsolved">Unsolved</option>
                            <option value="Solved">Solved</option>
                            <option value="Revision">Revision</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className={labelClass}>Solution Code</label>
                    <textarea
                        name="solutionCode"
                        value={formData.solutionCode}
                        onChange={onChange}
                        rows={10}
                        className={`${inputClass} font-mono text-xs leading-relaxed resize-y`}
                        placeholder="Paste your solution code here..."
                    />
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors"
                    >
                        {isLoading ? 'Saving...' : 'Save Problem'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/problems')}
                        className="text-surface-400 hover:text-white text-sm font-medium px-4 py-2.5 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProblemPage;
