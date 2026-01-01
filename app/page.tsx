"use client";

import { useState, useEffect } from "react";
import { GameState, Hand } from "@/types/game";
import {
  createDeck,
  shuffleDeck,
  dealInitialHands,
  createHand,
  dealCard,
  revealDealerCard,
  shouldDealerHit,
  determineWinner,
} from "@/lib/gameLogic";
import HandDisplay from "@/components/HandDisplay";
import ChipSelector from "@/components/ChipSelector";

const INITIAL_CHIPS = 1000;

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    playerHand: { cards: [], value: 0, isSoft: false, isBlackjack: false, isBusted: false },
    dealerHand: { cards: [], value: 0, isSoft: false, isBlackjack: false, isBusted: false },
    deck: [],
    chips: INITIAL_CHIPS,
    bet: 0,
    phase: "betting",
    message: "Place your bet to start!",
  });

  // Initialize deck on mount
  useEffect(() => {
    const deck = shuffleDeck(createDeck());
    setGameState((prev) => ({ ...prev, deck }));
  }, []);

  const handleBetChange = (newBet: number) => {
    setGameState((prev) => ({ ...prev, bet: newBet }));
  };

  const handleDeal = () => {
    if (gameState.bet === 0) {
      setGameState((prev) => ({ ...prev, message: "Please place a bet first!" }));
      return;
    }

    if (gameState.bet > gameState.chips) {
      setGameState((prev) => ({ ...prev, message: "You don't have enough chips!" }));
      return;
    }

    // Reshuffle if deck is running low
    let deck = gameState.deck.length < 20 ? shuffleDeck(createDeck()) : gameState.deck;

    const { playerCards, dealerCards, newDeck } = dealInitialHands(deck);
    const playerHand = createHand(playerCards);
    const dealerHand = createHand(dealerCards);

    // Deduct bet from chips
    const newChips = gameState.chips - gameState.bet;

    // Check for immediate blackjack
    if (playerHand.isBlackjack) {
      const finalDealerHand = createHand(revealDealerCard(dealerCards));
      const { message, payout } = determineWinner(playerHand, finalDealerHand, gameState.bet);
      setGameState({
        playerHand,
        dealerHand: finalDealerHand,
        deck: newDeck,
        chips: newChips + payout,
        bet: gameState.bet,
        phase: "gameOver",
        message,
      });
    } else {
      setGameState({
        playerHand,
        dealerHand,
        deck: newDeck,
        chips: newChips,
        bet: gameState.bet,
        phase: "playing",
        message: "Hit or Stand?",
      });
    }
  };

  const handleHit = () => {
    const { card, newDeck } = dealCard(gameState.deck, true);
    const newCards = [...gameState.playerHand.cards, card];
    const newHand = createHand(newCards);

    if (newHand.isBusted) {
      setGameState({
        ...gameState,
        playerHand: newHand,
        deck: newDeck,
        phase: "gameOver",
        message: "You busted! Dealer wins.",
      });
    } else {
      setGameState({
        ...gameState,
        playerHand: newHand,
        deck: newDeck,
        message: "Hit or Stand?",
      });
    }
  };

  const handleStand = () => {
    // Reveal dealer's hidden card
    let currentDeck = gameState.deck;
    let dealerCards = revealDealerCard(gameState.dealerHand.cards);
    let dealerHand = createHand(dealerCards);

    // Dealer draws cards
    while (shouldDealerHit(dealerHand) && !dealerHand.isBusted) {
      const { card, newDeck } = dealCard(currentDeck, true);
      currentDeck = newDeck;
      dealerCards = [...dealerCards, card];
      dealerHand = createHand(dealerCards);
    }

    // Determine winner
    const { message, payout } = determineWinner(gameState.playerHand, dealerHand, gameState.bet);

    setGameState({
      ...gameState,
      dealerHand,
      deck: currentDeck,
      chips: gameState.chips + payout,
      phase: "gameOver",
      message,
    });
  };

  const handleNewRound = () => {
    if (gameState.chips === 0) {
      setGameState({
        playerHand: { cards: [], value: 0, isSoft: false, isBlackjack: false, isBusted: false },
        dealerHand: { cards: [], value: 0, isSoft: false, isBlackjack: false, isBusted: false },
        deck: shuffleDeck(createDeck()),
        chips: INITIAL_CHIPS,
        bet: 0,
        phase: "betting",
        message: "Welcome back! You've been given new chips. Place your bet!",
      });
    } else {
      setGameState({
        ...gameState,
        playerHand: { cards: [], value: 0, isSoft: false, isBlackjack: false, isBusted: false },
        dealerHand: { cards: [], value: 0, isSoft: false, isBlackjack: false, isBusted: false },
        bet: 0,
        phase: "betting",
        message: "Place your bet!",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">Blackjack</h1>
          <p className="text-xl text-gray-300">Hit, Stand, and Win Big!</p>
        </div>

        {/* Message Display */}
        <div className="text-center mb-6">
          <div className="inline-block bg-black bg-opacity-50 px-8 py-4 rounded-lg">
            <p className="text-2xl font-semibold text-yellow-400">{gameState.message}</p>
          </div>
        </div>

        {/* Game Table */}
        <div className="bg-green-800 rounded-3xl shadow-2xl p-8 mb-8 border-8 border-amber-900">
          {/* Dealer Hand */}
          {gameState.dealerHand.cards.length > 0 && (
            <div className="mb-12">
              <HandDisplay
                hand={gameState.dealerHand}
                title="Dealer"
                showValue={gameState.phase !== "playing"}
              />
            </div>
          )}

          {/* Player Hand */}
          {gameState.playerHand.cards.length > 0 && (
            <div className="mt-12">
              <HandDisplay hand={gameState.playerHand} title="You" showValue={true} />
            </div>
          )}

          {/* Game Controls */}
          <div className="mt-12 flex justify-center space-x-4">
            {gameState.phase === "playing" && (
              <>
                <button
                  onClick={handleHit}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-lg shadow-lg transform transition-all active:scale-95"
                >
                  Hit
                </button>
                <button
                  onClick={handleStand}
                  className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white text-xl font-bold rounded-lg shadow-lg transform transition-all active:scale-95"
                >
                  Stand
                </button>
              </>
            )}
            {gameState.phase === "gameOver" && (
              <button
                onClick={handleNewRound}
                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-lg shadow-lg transform transition-all active:scale-95"
              >
                New Round
              </button>
            )}
          </div>
        </div>

        {/* Betting Interface */}
        {gameState.phase === "betting" && (
          <div className="bg-black bg-opacity-50 rounded-2xl p-8">
            <ChipSelector
              chips={gameState.chips}
              currentBet={gameState.bet}
              onBetChange={handleBetChange}
              disabled={gameState.phase !== "betting"}
            />
            <div className="flex justify-center mt-6">
              <button
                onClick={handleDeal}
                disabled={gameState.bet === 0}
                className="px-12 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black text-2xl font-bold rounded-lg shadow-lg transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Deal Cards
              </button>
            </div>
          </div>
        )}

        {/* Chip Counter (always visible during game) */}
        {gameState.phase !== "betting" && (
          <div className="text-center bg-black bg-opacity-50 rounded-2xl p-4">
            <div className="text-2xl font-bold text-white">
              Chips: <span className="text-yellow-400">${gameState.chips}</span>
              <span className="mx-4">|</span>
              Bet: <span className="text-green-400">${gameState.bet}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
