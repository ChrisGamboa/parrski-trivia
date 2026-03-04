export const QUESTION_TIME_MS = 20000;
export const REVEAL_TIME_MS = 5000;
export const MAX_POINTS = 1000;
export const QUESTIONS_PER_GAME = 10;
export const MAX_PLAYERS = 2;

export type GamePhase = "LOBBY" | "QUESTION" | "REVEAL" | "RESULTS";

export interface QuestionCommentary {
  picklesIntro: string;
  lucaCorrect: string;
  oliverWrong: string;
  bettingLines: {
    oliver: string;
    luca: string;
  };
}

export interface Question {
  id: number;
  category: string;
  question: string;
  choices: [string, string, string, string];
  correctIndex: number;
  commentary: QuestionCommentary;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  joinedAt: number;
}

export interface PlayerAnswer {
  questionIndex: number;
  choiceIndex: number;
  answeredAt: number;
}

export interface QuestionResult {
  questionIndex: number;
  correctIndex: number;
  players: Record<string, { choiceIndex: number; points: number }>;
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  hostId: string;
  questions: Question[];
  currentQuestionIndex: number;
  questionStartTime: number;
  results: QuestionResult[];
}

export const INITIAL_GAME_STATE: GameState = {
  phase: "LOBBY",
  players: [],
  hostId: "",
  questions: [],
  currentQuestionIndex: 0,
  questionStartTime: 0,
  results: [],
};
