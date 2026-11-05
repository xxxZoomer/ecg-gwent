import cards from './data/cards.json'

export type ECGCard = (typeof cards)[number]
export type MatchResult = 'victory' | 'defeat' | 'draw' | null

export interface GameState {
  playerHand: ECGCard[]
  cpuHand: ECGCard[]
  playerDeck: ECGCard[]
  cpuDeck: ECGCard[]
  playerBoard: ECGCard[]
  cpuBoard: ECGCard[]
  playerRounds: number
  cpuRounds: number
  round: number
  turn: 'player' | 'cpu' | 'finished'
  playerPassed: boolean
  cpuPassed: boolean
  result: MatchResult
  message: string
}

export const cardCatalog: ECGCard[] = cards

function shuffle(deck: ECGCard[]): ECGCard[] {
  const shuffled = [...deck]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }
  return shuffled
}

export function createGame(): GameState {
  const playerDeck = shuffle(cardCatalog)
  const cpuDeck = shuffle(cardCatalog)
  return {
    playerHand: playerDeck.slice(0, 5),
    cpuHand: cpuDeck.slice(0, 5),
    playerDeck: playerDeck.slice(5),
    cpuDeck: cpuDeck.slice(5),
    playerBoard: [],
    cpuBoard: [],
    playerRounds: 0,
    cpuRounds: 0,
    round: 1,
    turn: 'player',
    playerPassed: false,
    cpuPassed: false,
    result: null,
    message: 'カードを選んでプレイしてください。',
  }
}

export function boardScore(board: ECGCard[]): number {
  return board.reduce((score, card) => score + card.power, 0)
}

function finishRound(state: GameState): GameState {
  const playerScore = boardScore(state.playerBoard)
  const cpuScore = boardScore(state.cpuBoard)
  const playerRounds = state.playerRounds + Number(playerScore > cpuScore)
  const cpuRounds = state.cpuRounds + Number(cpuScore > playerScore)
  const message = playerScore === cpuScore
    ? 'このラウンドは引き分けです。'
    : playerScore > cpuScore
      ? 'ラウンド獲得。いい読みです。'
      : 'CPUがラウンドを獲得しました。'

  if (playerRounds === 2 || cpuRounds === 2 || state.round === 3) {
    const result = playerRounds === cpuRounds ? 'draw' : playerRounds > cpuRounds ? 'victory' : 'defeat'
    return { ...state, playerRounds, cpuRounds, turn: 'finished', result, message }
  }

  const nextPlayerDeck = state.playerDeck
  const nextCpuDeck = state.cpuDeck
  const playerDraw = nextPlayerDeck.slice(0, 3)
  const cpuDraw = nextCpuDeck.slice(0, 3)

  return {
    ...state,
    playerRounds,
    cpuRounds,
    round: state.round + 1,
    playerHand: [...state.playerHand, ...playerDraw],
    cpuHand: [...state.cpuHand, ...cpuDraw],
    playerDeck: nextPlayerDeck.slice(playerDraw.length),
    cpuDeck: nextCpuDeck.slice(cpuDraw.length),
    playerBoard: [],
    cpuBoard: [],
    turn: 'player',
    playerPassed: false,
    cpuPassed: false,
    message: `${message} 第${state.round + 1}ラウンドです。`,
  }
}

export function playCard(state: GameState, cardId: string): GameState {
  if (state.turn !== 'player' || state.playerPassed) return state
  const card = state.playerHand.find((candidate) => candidate.id === cardId)
  if (!card) return state
  const playerHand = state.playerHand.filter((candidate) => candidate.id !== cardId)
  return {
    ...state,
    playerHand,
    playerBoard: [...state.playerBoard, card],
    playerPassed: playerHand.length === 0,
    turn: 'cpu',
    message: `${card.name}をプレイしました。CPUの手番です。`,
  }
}

export function passTurn(state: GameState): GameState {
  if (state.turn !== 'player' || state.playerPassed) return state
  if (state.cpuPassed) return finishRound({ ...state, playerPassed: true })
  return { ...state, playerPassed: true, turn: 'cpu', message: 'パスしました。CPUの手番です。' }
}

export function takeCpuTurn(state: GameState): GameState {
  if (state.turn !== 'cpu') return state
  const playerScore = boardScore(state.playerBoard)
  const cpuScore = boardScore(state.cpuBoard)

  if (state.cpuPassed) {
    return state.playerPassed ? finishRound(state) : { ...state, turn: 'player' }
  }

  const shouldPass = state.cpuHand.length === 0 || (state.playerPassed ? cpuScore >= playerScore : cpuScore >= playerScore + 3)
  if (shouldPass) {
    const passed = { ...state, cpuPassed: true }
    return state.playerPassed ? finishRound(passed) : { ...passed, turn: 'player', message: 'CPUがパスしました。続けるか、パスしてください。' }
  }

  const card = [...state.cpuHand].sort((first, second) => second.power - first.power)[0]
  if (!card) return { ...state, cpuPassed: true, turn: state.playerPassed ? 'cpu' : 'player' }
  const cpuHand = state.cpuHand.filter((candidate) => candidate.id !== card.id)
  const cpuBoard = [...state.cpuBoard, card]
  const cpuPassed = cpuHand.length === 0
  const nextState: GameState = {
    ...state,
    cpuHand,
    cpuBoard,
    cpuPassed,
    turn: state.playerPassed ? 'cpu' : 'player',
    message: `CPUが${card.name}をプレイしました。`,
  }

  return state.playerPassed && cpuPassed ? finishRound(nextState) : nextState
}