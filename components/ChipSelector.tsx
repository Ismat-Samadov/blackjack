interface ChipSelectorProps {
  chips: number;
  currentBet: number;
  onBetChange: (amount: number) => void;
  disabled?: boolean;
}

const chipValues = [5, 10, 25, 50, 100];

const chipColors = {
  5: "bg-red-500 hover:bg-red-600",
  10: "bg-blue-500 hover:bg-blue-600",
  25: "bg-green-500 hover:bg-green-600",
  50: "bg-purple-500 hover:bg-purple-600",
  100: "bg-yellow-500 hover:bg-yellow-600",
};

export default function ChipSelector({
  chips,
  currentBet,
  onBetChange,
  disabled = false,
}: ChipSelectorProps) {
  const handleChipClick = (value: number) => {
    if (disabled || currentBet + value > chips) return;
    onBetChange(currentBet + value);
  };

  const handleClearBet = () => {
    if (disabled) return;
    onBetChange(0);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-2xl font-bold text-white">
        Your Chips: <span className="text-yellow-400">${chips}</span>
      </div>
      <div className="text-xl text-white">
        Current Bet: <span className="text-green-400">${currentBet}</span>
      </div>
      <div className="flex space-x-3">
        {chipValues.map((value) => (
          <button
            key={value}
            onClick={() => handleChipClick(value)}
            disabled={disabled || currentBet + value > chips}
            className={`w-16 h-16 rounded-full ${
              chipColors[value as keyof typeof chipColors]
            } text-white font-bold text-lg shadow-lg transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-4 border-white`}
          >
            ${value}
          </button>
        ))}
      </div>
      <button
        onClick={handleClearBet}
        disabled={disabled || currentBet === 0}
        className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Clear Bet
      </button>
    </div>
  );
}
