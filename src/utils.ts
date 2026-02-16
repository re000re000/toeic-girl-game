import { Word, QuizQuestion, CharacterInfo } from './types';

// キャラクター情報
const CHARACTERS: Record<number, CharacterInfo[]> = {
  1: [{ id: 0, name: 'Alice', level: 1 }, { id: 1, name: 'Bella', level: 1 }, { id: 2, name: 'Chloe', level: 1 }],
  2: [{ id: 0, name: 'Diana', level: 2 }, { id: 1, name: 'Emma', level: 2 }, { id: 2, name: 'Fiona', level: 2 }],
  3: [{ id: 0, name: 'Grace', level: 3 }, { id: 1, name: 'Hannah', level: 3 }, { id: 2, name: 'Iris', level: 3 }],
  4: [{ id: 0, name: 'Julia', level: 4 }, { id: 1, name: 'Karen', level: 4 }, { id: 2, name: 'Luna', level: 4 }],
  5: [{ id: 0, name: 'Mia', level: 5 }, { id: 1, name: 'Nina', level: 5 }, { id: 2, name: 'Olivia', level: 5 }],
};

let cachedWords: Word[] = [];

// 単語データを読み込む（publicに移動した最新版）
export async function loadWordsData(): Promise<Word[]> {
  if (cachedWords.length > 0) return cachedWords;

  // publicに入れたファイルは、サイトの「/data/...」という直通ルートでアクセスできます
  const dataPath = './data/words_data.json'; 

  try {
    const response = await fetch(dataPath);
    if (!response.ok) {
      throw new Error(`Data load failed: ${response.status}`);
    }
    const data = await response.json();
    
    // データの形をチェックして配列を取り出す
    const words = Array.isArray(data) ? data : (data.words || []);
    
    if (words.length === 0) throw new Error('Loaded data is empty');
    
    cachedWords = words;
    return words;
  } catch (error) {
    console.error('CRITICAL LOAD ERROR:', error);
    return [];
  }
}

// レベルに合った単語をフィルタリングする（安全第一版）
export function getWordsByLevel(level: any, words: Word[]): Word[] {
  // 引数のwordsが空なら、キャッシュされているデータを使う
  const source = (Array.isArray(words) && words.length > 0) ? words : cachedWords;
  
  if (!Array.isArray(source)) return [];

  const targetLevel = typeof level === 'string' 
    ? parseInt(level.replace(/[^0-9]/g, '')) 
    : Number(level);

  return source.filter((word) => word && Number(word.level) === targetLevel);
}

export function getRandomWord(words: Word[]): Word {
  if (!Array.isArray(words) || words.length === 0) {
    return { word: "Error", meaning: "読み込み中...", level: 1 };
  }
  return words[Math.floor(Math.random() * words.length)];
}

export function generateQuizQuestion(word: Word, allWords: Word[]): QuizQuestion {
  const wrongAnswers = allWords
    .filter((w) => w.word !== word.word)
    .sort(() => Math.random() - 0.5)
    .slice(0, 2)
    .map((w) => w.meaning);

  const options = [word.meaning, ...wrongAnswers].sort(() => Math.random() - 0.5);
  return { word, options, correctIndex: options.indexOf(word.meaning) };
}

export function getCharacterImagePath(characterId: number, state: number): string {
  const stateMap: Record<number, string> = { 0: 'state0', 1: 'state1', 2: 'state1_5', 3: 'state2' };
  const level = Math.floor(characterId / 3) + 1;
  const charIndex = characterId % 3;
  // publicに移動した画像へのパス
  return `characters/level${level}_char${charIndex}_${stateMap[state] || 'state0'}.${state === 0 ? 'png' : 'jpg'}`;
}

export function getCharacterInfo(level: number): CharacterInfo | undefined {
  const characters = CHARACTERS[level];
  return characters ? characters[Math.floor(Math.random() * characters.length)] : undefined;
}

export function getRandomCharacterId(level: number): number {
  return ((level - 1) * 3) + Math.floor(Math.random() * 3);
}
