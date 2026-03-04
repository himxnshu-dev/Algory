const StatsCard = ({ label, value, accent = 'indigo' }) => {
    const accentColors = {
        indigo: 'from-indigo-500/10 to-transparent border-indigo-500/20 text-indigo-400',
        emerald: 'from-emerald-500/10 to-transparent border-emerald-500/20 text-emerald-400',
        amber: 'from-amber-500/10 to-transparent border-amber-500/20 text-amber-400',
        rose: 'from-rose-500/10 to-transparent border-rose-500/20 text-rose-400',
    };

    return (
        <div
            className={`bg-gradient-to-br ${accentColors[accent]} border rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20`}
        >
            <span className="text-surface-400 text-sm font-medium">{label}</span>
            <p className="text-3xl font-bold text-white tracking-tight mt-2">{value}</p>
        </div>
    );
};

export default StatsCard;
