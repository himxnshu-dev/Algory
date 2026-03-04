import { useMemo } from 'react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

const getIntensity = (count) => {
    if (count === 0) return 'bg-surface-800/60 border-surface-700/30';
    if (count === 1) return 'bg-indigo-900/60 border-indigo-800/40';
    if (count === 2) return 'bg-indigo-700/70 border-indigo-600/40';
    if (count <= 4) return 'bg-indigo-500/80 border-indigo-400/40';
    return 'bg-indigo-400 border-indigo-300/50';
};

const ActivityHeatmap = ({ dailyActivity = [], currentStreak = 0, longestStreak = 0 }) => {
    const { weeks, monthLabels, totalActive } = useMemo(() => {
        const activityMap = {};
        dailyActivity.forEach((d) => (activityMap[d.date] = d.count));

        const today = new Date();
        today.setUTCHours(23, 59, 59, 999);

        const start = new Date(today);
        start.setUTCDate(start.getUTCDate() - 363 - start.getUTCDay());
        start.setUTCHours(0, 0, 0, 0);

        const weeks = [];
        const monthLabels = [];
        let totalActive = 0;
        let currentDate = new Date(start);
        let lastMonth = -1;

        for (let week = 0; week < 53; week++) {
            const days = [];
            for (let day = 0; day < 7; day++) {
                if (currentDate <= today) {
                    const key = currentDate.toISOString().split('T')[0];
                    const count = activityMap[key] || 0;
                    if (count > 0) totalActive++;
                    days.push({
                        date: key,
                        count,
                        month: currentDate.getUTCMonth(),
                        dayOfWeek: day,
                    });

                    if (currentDate.getUTCMonth() !== lastMonth && day === 0) {
                        monthLabels.push({ label: MONTHS[currentDate.getUTCMonth()], week });
                        lastMonth = currentDate.getUTCMonth();
                    }
                }
                currentDate.setUTCDate(currentDate.getUTCDate() + 1);
            }
            if (days.length > 0) weeks.push(days);
        }

        return { weeks, monthLabels, totalActive };
    }, [dailyActivity]);

    return (
        <div className="bg-surface-900 border border-surface-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-white">Activity</h2>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="text-center">
                            <p className="text-lg font-bold text-white leading-none">{currentStreak}</p>
                            <p className="text-[10px] text-surface-500 mt-0.5">Current streak</p>
                        </div>
                        <div className="w-px h-8 bg-surface-700" />
                        <div className="text-center">
                            <p className="text-lg font-bold text-white leading-none">{longestStreak}</p>
                            <p className="text-[10px] text-surface-500 mt-0.5">Longest streak</p>
                        </div>
                        <div className="w-px h-8 bg-surface-700" />
                        <div className="text-center">
                            <p className="text-lg font-bold text-white leading-none">{totalActive}</p>
                            <p className="text-[10px] text-surface-500 mt-0.5">Active days</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="inline-flex flex-col gap-0 min-w-fit">
                    <div className="relative mb-1" style={{ marginLeft: '28px', height: '14px' }}>
                        {monthLabels.map((m, i) => (
                            <span
                                key={i}
                                className="absolute text-[10px] text-surface-500"
                                style={{ left: `${m.week * 12}px` }}
                            >
                                {m.label}
                            </span>
                        ))}
                    </div>

                    <div className="flex gap-0">
                        <div className="flex flex-col gap-[2px] mr-2 pt-0">
                            {DAYS.map((d, i) => (
                                <div key={i} className="h-[10px] w-5 text-[9px] text-surface-600 leading-[10px] text-right pr-1">
                                    {d}
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-[2px]">
                            {weeks.map((week, wi) => (
                                <div key={wi} className="flex flex-col gap-[2px]">
                                    {week.map((day, di) => (
                                        <div
                                            key={`${wi}-${di}`}
                                            className={`w-[10px] h-[10px] rounded-[2px] border transition-colors duration-200 ${getIntensity(
                                                day.count
                                            )} hover:ring-1 hover:ring-indigo-400/50 cursor-default`}
                                            title={`${day.date}: ${day.count} problem${day.count !== 1 ? 's' : ''}`}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-1.5 mt-3">
                        <span className="text-[10px] text-surface-600 mr-1">Less</span>
                        {[0, 1, 2, 3, 5].map((count) => (
                            <div
                                key={count}
                                className={`w-[10px] h-[10px] rounded-[2px] border ${getIntensity(count)}`}
                            />
                        ))}
                        <span className="text-[10px] text-surface-600 ml-1">More</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityHeatmap;
