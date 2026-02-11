export interface Word {
  word: string;
  meaning: string;
  level: number;
}

export interface QuizQuestion {
  word: Word;
  options: string[];
  correctIndex: number;
}

export interface GameState {
  level: number;
  currentQuestionIndex: number;
  correctAnswers: number;
  life: number;
  currentCharacterId: number;
  characterState: number;
  missedWords: Word[];
}

export interface CharacterInfo {
  id: number;
  name: string;
  level: number;
}
