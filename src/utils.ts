import { Word, QuizQuestion, CharacterInfo } from './types';

// キャラクター情報
const CHARACTERS: Record<number, CharacterInfo[]> = {
  1: [
    { id: 0, name: 'Alice', level: 1 },
    { id: 1, name: 'Bella', level: 1 },
    { id: 2, name: 'Chloe', level: 1 },
  ],
  2: [
    { id: 0, name: 'Diana', level: 2 },
    { id: 1, name: 'Emma', level: 2 },
    { id: 2, name: 'Fiona', level: 2 },
  ],
  3: [
    { id: 0, name: 'Grace', level: 3 },
    { id: 1, name: 'Hannah', level: 3 },
    { id: 2, name: 'Iris', level: 3 },
  ],
  4: [
    { id: 0, name: 'Julia', level: 4 },
    { id: 1, name: 'Karen', level: 4 },
    { id: 2, name: 'Luna', level: 4 },
  ],
  5: [
    { id: 0, name: 'Mia', level: 5 },
    { id: 1, name: 'Nina', level: 5 },
    { id: 2, name: 'Olivia', level: 5 },
  ],
};

let wordsData: Word[] = [];

// 単語データを読み込む
export async function loadWordsData(): Promise<Word[]> {
  if (wordsData.length > 0) {
    return wordsData;
  }

  try {
    const response = await fetch('/toeic-girl-game/data/words_data.json');
    if (!response.ok) {
      throw new Error('Failed to load words data');
    }
    const data = await response.json();
    wordsData = data;
    return wordsData;
  } catch (error) {
    console.error('Error loading words data:', error);
    return [];
  }
}

// レベルに応じた単語を取得
export function getWordsByLevel(level: number, words: Word[]): Word[] {
  return words.filter((word) => word.level === level);
}

// ランダムな単語を取得
export function getRandomWord(words: Word[]): Word {
  return words[Math.floor(Math.random() * words.length)];
}

// クイズ問題を生成
export function generateQuizQuestion(word: Word, allWords: Word[]): QuizQuestion {
  const wrongAnswers = allWords
    .filter((w) => w.word !== word.word)
    .sort(() => Math.random() - 0.5)
    .slice(0, 2)
    .map((w) => w.meaning);

  const options = [word.meaning, ...wrongAnswers].sort(() => Math.random() - 0.5);
  const correctIndex = options.indexOf(word.meaning);

  return {
    word,
    options,
    correctIndex,
  };
}

// キャラクター画像パスを取得
export function getCharacterImagePath(characterId: number, state: number): string {
  const stateMap: Record<number, string> = {
    0: 'state0',
    1: 'state1',
    2: 'state1_5',
    3: 'state2',
  };

  const level = Math.floor(characterId / 3) + 1;
  const charIndex = characterId % 3;
  const stateStr = stateMap[state] || 'state0';

  // PNG or JPEG の判定
  const ext = state === 0 ? 'png' : 'jpg';

  return `/toeic-girl-game/characters/level${level}_char${charIndex}_${stateStr}.${ext}`;
}

// キャラクター情報を取得
export function getCharacterInfo(level: number): CharacterInfo | undefined {
  const characters = CHARACTERS[level];
  if (!characters) return undefined;
  return characters[Math.floor(Math.random() * characters.length)];
}

// ランダムなキャラクターIDを取得
export function getRandomCharacterId(level: number): number {
  const baseId = (level - 1) * 3;
  return baseId + Math.floor(Math.random() * 3);
}
