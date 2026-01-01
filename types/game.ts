export type Suit = "hearts" | "diamonds" | "clubs" | "spades";
export type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

export interface Card {
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
}

export interface Hand {
  cards: Card[];
  value: number;
  isSoft: boolean; // True if hand contains an Ace counted as 11
  isBlackjack: boolean;
  isBusted: boolean;
}

export type GamePhase = "betting" | "playing" | "dealer" | "gameOver";

export interface GameState {
  playerHand: Hand;
  dealerHand: Hand;
  deck: Card[];
  chips: number;
  bet: number;
  phase: GamePhase;
  message: string;
}
