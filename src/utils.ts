import { Word, QuizQuestion, CharacterInfo } from './types';

const CHARACTERS: Record<number, CharacterInfo[]> = {
  1: [{ id: 0, name: 'Alice', level: 1 }, { id: 1, name: 'Bella', level: 1 }, { id: 2, name: 'Chloe', level: 1 }],
  2: [{ id: 0, name: 'Diana', level: 2 }, { id: 1, name: 'Emma', level: 2 }, { id: 2, name: 'Fiona', level: 2 }],
  3: [{ id: 0, name: 'Grace', level: 3 }, { id: 1, name: 'Hannah', level: 3 }, { id: 2, name: 'Iris', level: 3 }],
  4: [{ id: 0, name: 'Julia', level: 4 }, { id: 1, name: 'Karen', level: 4 }, { id: 2, name: 'Luna', level: 4 }],
  5: [{ id: 0, name: 'Mia', level: 5 }, { id: 1, name: 'Nina', level: 5 }, { id: 2, name: 'Olivia', level: 5 }],
};

let cachedRawData: Record<string, any[]> | null = null;

export async function loadWordsData(): Promise<Word[]> {
  if (cachedRawData) return [];

 const pathsToTry = [
  '/toeic-girl-game/data/words_data.json',
  './data/words_data.json',
  '/data/words_data.json',
];

  for (const dataPath of pathsToTry) {
    try {
      console.log(`[DEBUG] Fetching from: ${dataPath}`);
      const response = await fetch(dataPath);
      if (response.ok) {
        const json = await response.json();
        // JSONがオブジェクト形式 { level1: [...], level2: [...] } かチェック
        if (json && typeof json === 'object' && !Array.isArray(json)) {
          cachedRawData = json;
          console.log('[DEBUG] Data loaded successfully', Object.keys(cachedRawData!));
          return [];
        } else if (Array.isArray(json)) {
          // 万が一配列形式だった場合もサポート
          cachedRawData = { level1: json };
          console.log('[DEBUG] Data loaded as flat array');
          return [];
        }
      }
    } catch (e) {
      console.warn(`[DEBUG] Failed: ${dataPath}`, e);
    }
  }

  throw new Error('単語データの読み込みに失敗しました。');
}

export function getWordsByLevel(level: any, _words: Word[]): Word[] {
  if (!cachedRawData) {
    console.error('[DEBUG] cachedRawData is null');
    return [];
  }

  const levelKey = `level${level}`;
  const words = cachedRawData[levelKey];

  if (!Array.isArray(words) || words.length === 0) {
    console.error(`[DEBUG] No array found for ${levelKey}`, cachedRawData);
    return [];
  }

  return words
    .filter((w: any) => w && typeof w.word === 'string' && typeof w.meaning === 'string')
    .map((w: any) => ({
      word: w.word,
      meaning: w.meaning,
      level: Number(level),
    }));
}

export function getRandomWord(words: Word[]): Word {
  if (!Array.isArray(words) || words.length === 0) {
    return { word: 'Error', meaning: 'データなし', level: 1 };
  }
  return words[Math.floor(Math.random() * words.length)];
}

export function generateQuizQuestion(word: Word, _allWords: Word[]): QuizQuestion {
  // 全レベルの単語を集める
  let allPossibleWords: Word[] = [];
  if (cachedRawData) {
    Object.keys(cachedRawData).forEach((key) => {
      const arr = cachedRawData![key];
      if (Array.isArray(arr)) {
        const mapped = arr
          .filter((w: any) => w && typeof w.word === 'string' && typeof w.meaning === 'string')
          .map((w: any) => ({ word: w.word, meaning: w.meaning, level: 1 }));
        allPossibleWords = allPossibleWords.concat(mapped);
      }
    });
  }

  // 正解以外の選択肢を2つ選ぶ
  const wrongAnswers = allPossibleWords
    .filter((w) => w.word !== word.word && w.meaning !== word.meaning)
    .sort(() => Math.random() - 0.5)
    .slice(0, 2)
    .map((w) => w.meaning);

  // 万が一wrongAnswersが2つ未満の場合のフォールバック
  while (wrongAnswers.length < 2) {
    wrongAnswers.push('（選択肢なし）');
  }

  const options = [word.meaning, ...wrongAnswers].sort(() => Math.random() - 0.5);
  return { word, options, correctIndex: options.indexOf(word.meaning) };
}

export function getCharacterImagePath(characterId: number, state: number): string {
  const stateMap: Record<number, string> = { 0: 'state0', 1: 'state1', 2: 'state1_5', 3: 'state2' };
  const level = Math.floor(characterId / 3) + 1;
  const charIndex = characterId % 3;
  const stateStr = stateMap[state] || 'state0';
  const ext = state === 0 ? 'png' : 'jpg';
  return `/toeic-girl-game/characters/level${level}_char${charIndex}_${stateStr}.${ext}`;
}

export function getCharacterInfo(level: number): CharacterInfo | undefined {
  const characters = CHARACTERS[level];
  return characters ? characters[Math.floor(Math.random() * characters.length)] : undefined;
}

export function getRandomCharacterId(level: number): number {
  return (level - 1) * 3 + Math.floor(Math.random() * 3);
}
