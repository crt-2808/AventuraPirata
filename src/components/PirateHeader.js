const PirateHeader = () => {
  return (
    <div className="bg-amber-900 py-6 px-4 rounded-b-xl shadow-lg relative overflow-hidden">
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-7xl text-amber-300">⚓</div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-7xl text-amber-300">🏴‍☠️</div>
      <h1 className="text-5xl font-bold text-amber-300 text-center relative z-10">Aventura Pirata</h1>
      <p className="text-amber-100 text-center mt-2 relative z-10">¡Encuentra tu tesoro!</p>
    </div>
  );
};
export default PirateHeader;