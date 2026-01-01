import { Card, Hand, Suit, Rank } from "@/types/game";

const suits: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
const ranks: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

// Create a new deck of cards
export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank, faceUp: false });
    }
  }
  return deck;
}

// Shuffle the deck using Fisher-Yates algorithm
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get the numeric value of a card
export function getCardValue(rank: Rank): number {
  if (rank === "A") return 11;
  if (["J", "Q", "K"].includes(rank)) return 10;
  return parseInt(rank);
}

// Calculate hand value and determine if it's soft (has an Ace counted as 11)
export function calculateHand(cards: Card[]): { value: number; isSoft: boolean } {
  let value = 0;
  let aces = 0;

  for (const card of cards) {
    const cardValue = getCardValue(card.rank);
    value += cardValue;
    if (card.rank === "A") aces++;
  }

  // Adjust for Aces if hand is over 21
  let isSoft = aces > 0;
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
    isSoft = aces > 0;
  }

  return { value, isSoft };
}

// Create a hand object from cards
export function createHand(cards: Card[]): Hand {
  const { value, isSoft } = calculateHand(cards);
  const isBlackjack = cards.length === 2 && value === 21;
  const isBusted = value > 21;

  return {
    cards,
    value,
    isSoft,
    isBlackjack,
    isBusted,
  };
}

// Deal a card from the deck
export function dealCard(deck: Card[], faceUp: boolean = true): { card: Card; newDeck: Card[] } {
  const newDeck = [...deck];
  const card = newDeck.pop();
  if (!card) throw new Error("No cards left in deck");
  card.faceUp = faceUp;
  return { card, newDeck };
}

// Deal initial hands (2 cards each, dealer's second card face down)
export function dealInitialHands(deck: Card[]): {
  playerCards: Card[];
  dealerCards: Card[];
  newDeck: Card[];
} {
  let currentDeck = [...deck];
  const playerCards: Card[] = [];
  const dealerCards: Card[] = [];

  // Deal first card to player (face up)
  const p1 = dealCard(currentDeck, true);
  playerCards.push(p1.card);
  currentDeck = p1.newDeck;

  // Deal first card to dealer (face up)
  const d1 = dealCard(currentDeck, true);
  dealerCards.push(d1.card);
  currentDeck = d1.newDeck;

  // Deal second card to player (face up)
  const p2 = dealCard(currentDeck, true);
  playerCards.push(p2.card);
  currentDeck = p2.newDeck;

  // Deal second card to dealer (face down)
  const d2 = dealCard(currentDeck, false);
  dealerCards.push(d2.card);
  currentDeck = d2.newDeck;

  return { playerCards, dealerCards, newDeck: currentDeck };
}

// Reveal dealer's hidden card
export function revealDealerCard(cards: Card[]): Card[] {
  return cards.map((card) => ({ ...card, faceUp: true }));
}

// Determine if dealer should hit (dealer hits on soft 17)
export function shouldDealerHit(hand: Hand): boolean {
  return hand.value < 17 || (hand.value === 17 && hand.isSoft);
}

// Determine game outcome
export function determineWinner(
  playerHand: Hand,
  dealerHand: Hand,
  bet: number
): { message: string; payout: number } {
  if (playerHand.isBusted) {
    return { message: "You busted! Dealer wins.", payout: 0 };
  }

  if (dealerHand.isBusted) {
    return { message: "Dealer busted! You win!", payout: bet * 2 };
  }

  if (playerHand.isBlackjack && !dealerHand.isBlackjack) {
    return { message: "Blackjack! You win!", payout: Math.floor(bet * 2.5) };
  }

  if (dealerHand.isBlackjack && !playerHand.isBlackjack) {
    return { message: "Dealer has Blackjack. You lose.", payout: 0 };
  }

  if (playerHand.value > dealerHand.value) {
    return { message: "You win!", payout: bet * 2 };
  }

  if (playerHand.value < dealerHand.value) {
    return { message: "Dealer wins.", payout: 0 };
  }

  return { message: "It's a tie! Your bet is returned.", payout: bet };
}
