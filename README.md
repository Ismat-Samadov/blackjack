# Blackjack Game

An attractive, interactive Blackjack game built with Next.js and TypeScript.

## Features

- Classic Blackjack gameplay with Hit and Stand actions
- Chip tracking and betting system
- Beautiful, responsive UI with card animations
- Dealer AI that follows standard casino rules (hits on soft 17)
- Automatic deck reshuffling
- Blackjack detection and payouts (2.5x)
- Bust detection for both player and dealer

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to play the game.

### Build

Build the production application:

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## How to Play

1. **Place Your Bet**: Select chip denominations ($5, $10, $25, $50, $100) to place your bet
2. **Deal Cards**: Click "Deal Cards" to start the round
3. **Make Your Move**:
   - **Hit**: Take another card to get closer to 21
   - **Stand**: Keep your current hand and let the dealer play
4. **Win**: Beat the dealer without going over 21!

## Game Rules

- Cards 2-10 are worth their face value
- Face cards (J, Q, K) are worth 10
- Aces are worth 11 or 1 (whichever is better for your hand)
- Dealer must hit on 16 or less and soft 17
- Dealer must stand on hard 17 or higher
- Blackjack (Ace + 10-value card) pays 2.5x your bet
- Regular win pays 2x your bet
- Tie returns your bet

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks

## Project Structure

```
blackjack/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Main game page
│   └── globals.css      # Global styles
├── components/
│   ├── Card.tsx         # Card display component
│   ├── ChipSelector.tsx # Betting interface
│   └── HandDisplay.tsx  # Hand display component
├── lib/
│   └── gameLogic.ts     # Game logic utilities
├── types/
│   └── game.ts          # TypeScript type definitions
└── README.md
```

## License

ISC
