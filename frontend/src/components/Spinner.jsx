const Spinner = () => {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="relative">
                <div className="w-8 h-8 border-2 border-surface-700 rounded-full"></div>
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
        </div>
    );
};

export default Spinner;
