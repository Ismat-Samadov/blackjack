import { Card as CardType } from "@/types/game";

interface CardProps {
  card: CardType;
  index?: number;
}

const suitSymbols = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};

const suitColors = {
  hearts: "text-red-500",
  diamonds: "text-red-500",
  clubs: "text-gray-900",
  spades: "text-gray-900",
};

export default function Card({ card, index = 0 }: CardProps) {
  if (!card.faceUp) {
    return (
      <div
        className="relative w-20 h-28 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-lg border-2 border-blue-400 flex items-center justify-center transition-all hover:scale-105"
        style={{
          transform: `translateX(${index * -15}px)`,
          zIndex: index,
        }}
      >
        <div className="absolute inset-2 border-2 border-blue-400 rounded-md opacity-50"></div>
        <div className="text-blue-300 text-4xl font-bold opacity-30">?</div>
      </div>
    );
  }

  return (
    <div
      className="relative w-20 h-28 bg-white rounded-lg shadow-lg border-2 border-gray-300 p-2 transition-all hover:scale-105"
      style={{
        transform: `translateX(${index * -15}px)`,
        zIndex: index,
      }}
    >
      <div className="flex flex-col h-full">
        <div className={`text-xl font-bold ${suitColors[card.suit]}`}>
          {card.rank}
        </div>
        <div className={`flex-1 flex items-center justify-center text-4xl ${suitColors[card.suit]}`}>
          {suitSymbols[card.suit]}
        </div>
        <div className={`text-xl font-bold self-end ${suitColors[card.suit]}`}>
          {card.rank}
        </div>
      </div>
    </div>
  );
}
