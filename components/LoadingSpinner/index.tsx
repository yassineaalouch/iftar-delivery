const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-[#1a472a]/10 flex items-center justify-center">
      <div className="relative w-20 h-20">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-[#1a472a]/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-[#1a472a] rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 