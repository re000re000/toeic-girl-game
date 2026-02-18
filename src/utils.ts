import { Word, QuizQuestion, CharacterInfo } from './types';

// キャラクター情報
const CHARACTERS: Record<number, CharacterInfo[]> = {
  1: [{ id: 0, name: 'Alice', level: 1 }, { id: 1, name: 'Bella', level: 1 }, { id: 2, name: 'Chloe', level: 1 }],
  2: [{ id: 0, name: 'Diana', level: 2 }, { id: 1, name: 'Emma', level: 2 }, { id: 2, name: 'Fiona', level: 2 }],
  3: [{ id: 0, name: 'Grace', level: 3 }, { id: 1, name: 'Hannah', level: 3 }, { id: 2, name: 'Iris', level: 3 }],
  4: [{ id: 0, name: 'Julia', level: 4 }, { id: 1, name: 'Karen', level: 4 }, { id: 2, name: 'Luna', level: 4 }],
  5: [{ id: 0, name: 'Mia', level: 5 }, { id: 1, name: 'Nina', level: 5 }, { id: 2, name: 'Olivia', level: 5 }],
};

let cachedRawData: any = null;

/**
 * GitHub Pagesのベースパスを取得する
 */
function getBasePath(): string {
  return window.location.hostname.includes('github.io') ? '/toeic-girl-game' : '';
}

/**
 * 単語データを読み込む
 */
export async function loadWordsData(): Promise<Word[]> {
  if (cachedRawData) return [];

  const base = getBasePath();
  // 複数のパス候補を試す
  const paths = [
    `${base}/data/words_data.json`,
    `./data/words_data.json`,
    `data/words_data.json`
  ];

  let lastError = null;

  for (const path of paths) {
    try {
      console.log(`[DEBUG] Attempting to fetch data from: ${path}`);
      const response = await fetch(path);
      
      if (!response.ok) {
        console.warn(`[DEBUG] Failed to load from ${path}: ${response.status}`);
        continue;
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) {
        console.warn(`[DEBUG] Received HTML instead of JSON from ${path}. This is likely a 404 page.`);
        continue;
      }

      const data = await response.json();
      console.log("[DEBUG] Fetched data successfully from:", path, data);
      
      cachedRawData = data;
      return []; // 互換性のために空配列を返す
    } catch (error) {
      console.warn(`[DEBUG] Error fetching from ${path}:`, error);
      lastError = error;
    }
  }

  console.error('CRITICAL: All data load attempts failed.', lastError);
  throw new Error('単語データの読み込みに失敗しました。通信環境を確認してください。');
}

/**
 * レベルに合った単語をフィルタリングする
 */
export function getWordsByLevel(level: any, _words: Word[]): Word[] {
  if (!cachedRawData) {
    console.error('[DEBUG] Data not loaded yet when calling getWordsByLevel');
    return [];
  }

  const levelKey = `level${level}`;
  const words = cachedRawData[levelKey];

  if (!Array.isArray(words)) {
    console.error(`[DEBUG] No words found for level: ${levelKey}. Available keys:`, Object.keys(cachedRawData));
    return [];
  }

  console.log(`[DEBUG] Found ${words.length} words for ${levelKey}`);

  return words.map((w: any) => ({
    ...w,
    level: Number(level)
  }));
}

export function getRandomWord(words: Word[]): Word {
  if (!Array.isArray(words) || words.length === 0) {
    console.error('[DEBUG] getRandomWord called with empty array');
    return { word: "Error", meaning: "データなし", level: 1 };
  }
  return words[Math.floor(Math.random() * words.length)];
}

export function generateQuizQuestion(word: Word, _allWords: Word[]): QuizQuestion {
  let allPossibleWords: Word[] = [];
  if (cachedRawData) {
    Object.keys(cachedRawData).forEach(key => {
      if (Array.isArray(cachedRawData[key])) {
        allPossibleWords = allPossibleWords.concat(cachedRawData[key]);
      }
    });
  }

  // 誤答の選択肢を生成
  const wrongAnswers = allPossibleWords
    .filter((w) => w.word !== word.word && w.meaning !== word.meaning)
    .sort(() => Math.random() - 0.5)
    .slice(0, 2)
    .map((w) => w.meaning);

  // 選択肢をシャッフル
  const options = [word.meaning, ...wrongAnswers].sort(() => Math.random() - 0.5);
  
  return { 
    word, 
    options, 
    correctIndex: options.indexOf(word.meaning) 
  };
}

export function getCharacterImagePath(characterId: number, state: number): string {
  const stateMap: Record<number, string> = { 0: 'state0', 1: 'state1', 2: 'state1_5', 3: 'state2' };
  const level = Math.floor(characterId / 3) + 1;
  const charIndex = characterId % 3;
  
  const base = getBasePath();
  const stateStr = stateMap[state] || 'state0';
  const ext = state === 0 ? 'png' : 'jpg';
  
  return `${base}/characters/level${level}_char${charIndex}_${stateStr}.${ext}`;
}

export function getCharacterInfo(level: number): CharacterInfo | undefined {
  const characters = CHARACTERS[level];
  return characters ? characters[Math.floor(Math.random() * characters.length)] : undefined;
}

export function getRandomCharacterId(level: number): number {
  return ((level - 1) * 3) + Math.floor(Math.random() * 3);
}
