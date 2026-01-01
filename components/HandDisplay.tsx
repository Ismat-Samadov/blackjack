import { Hand } from "@/types/game";
import Card from "./Card";

interface HandDisplayProps {
  hand: Hand;
  title: string;
  showValue?: boolean;
}

export default function HandDisplay({ hand, title, showValue = true }: HandDisplayProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="flex items-center" style={{ paddingLeft: `${(hand.cards.length - 1) * 15}px` }}>
        {hand.cards.map((card, index) => (
          <Card key={index} card={card} index={index} />
        ))}
      </div>
      {showValue && (
        <div className="text-xl font-semibold text-white">
          Value: <span className="text-yellow-400">{hand.value}</span>
          {hand.isSoft && <span className="text-sm text-gray-300 ml-2">(Soft)</span>}
        </div>
      )}
      {hand.isBlackjack && (
        <div className="text-2xl font-bold text-green-400 animate-pulse">BLACKJACK!</div>
      )}
      {hand.isBusted && (
        <div className="text-2xl font-bold text-red-400 animate-pulse">BUSTED!</div>
      )}
    </div>
  );
}
