import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStats } from '../features/problems/problemSlice';
import StatsCard from '../components/StatsCard';
import Spinner from '../components/Spinner';
import ActivityHeatmap from '../components/ActivityHeatmap';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';

const COLORS = ['#818cf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#38bdf8', '#fb923c'];
const DIFFICULTY_COLORS = { Easy: '#34d399', Medium: '#fbbf24', Hard: '#f87171' };

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-surface-900 border border-surface-700 rounded-lg px-3 py-2 shadow-xl">
                <p className="text-sm text-white font-medium">{label || payload[0].name}</p>
                <p className="text-xs text-surface-400">
                    Count: <span className="text-indigo-400 font-semibold">{payload[0].value}</span>
                </p>
            </div>
        );
    }
    return null;
};

const DashboardPage = () => {
    const dispatch = useDispatch();
    const { stats, isLoading } = useSelector((state) => state.problems);

    useEffect(() => {
        dispatch(getStats());
    }, [dispatch]);

    if (isLoading || !stats) return <Spinner />;

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
                <p className="text-surface-500 text-sm mt-1">Your preparation overview</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard label="Total Problems" value={stats.total} accent="indigo" />
                <StatsCard label="Solved" value={stats.solved} accent="emerald" />
                <StatsCard label="Need Revision" value={stats.revision} accent="amber" />
                <StatsCard label="Unsolved" value={stats.unsolved} accent="rose" />
            </div>

            <ActivityHeatmap
                dailyActivity={stats.dailyActivity}
                currentStreak={stats.currentStreak}
                longestStreak={stats.longestStreak}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-surface-900 border border-surface-800 rounded-xl p-6">
                    <h2 className="text-sm font-semibold text-white mb-4">Topic Distribution</h2>
                    {stats.topicDistribution?.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.topicDistribution} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: '#737373', fontSize: 11 }}
                                    axisLine={{ stroke: '#262626' }}
                                    tickLine={false}
                                    angle={-35}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis
                                    tick={{ fill: '#737373', fontSize: 11 }}
                                    axisLine={{ stroke: '#262626' }}
                                    tickLine={false}
                                    allowDecimals={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
                                    {stats.topicDistribution.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[300px] text-surface-600 text-sm">
                            No data yet - add some problems to see your distribution
                        </div>
                    )}
                </div>

                <div className="bg-surface-900 border border-surface-800 rounded-xl p-6">
                    <h2 className="text-sm font-semibold text-white mb-4">Difficulty Breakdown</h2>
                    {stats.difficultyDistribution?.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={stats.difficultyDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={65}
                                    outerRadius={100}
                                    paddingAngle={3}
                                    dataKey="count"
                                    nameKey="name"
                                    stroke="none"
                                >
                                    {stats.difficultyDistribution.map((entry) => (
                                        <Cell
                                            key={entry.name}
                                            fill={DIFFICULTY_COLORS[entry.name] || '#818cf8'}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    iconType="circle"
                                    iconSize={8}
                                    formatter={(value) => (
                                        <span className="text-surface-400 text-xs ml-1">{value}</span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[300px] text-surface-600 text-sm">
                            No data yet - add some problems to see difficulty breakdown
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
