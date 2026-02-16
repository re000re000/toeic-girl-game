import { Word, QuizQuestion, CharacterInfo } from './types';

// キャラクター情報
const CHARACTERS: Record<number, CharacterInfo[]> = {
  1: [{ id: 0, name: 'Alice', level: 1 }, { id: 1, name: 'Bella', level: 1 }, { id: 2, name: 'Chloe', level: 1 }],
  2: [{ id: 0, name: 'Diana', level: 2 }, { id: 1, name: 'Emma', level: 2 }, { id: 2, name: 'Fiona', level: 2 }],
  3: [{ id: 0, name: 'Grace', level: 3 }, { id: 1, name: 'Hannah', level: 3 }, { id: 2, name: 'Iris', level: 3 }],
  4: [{ id: 0, name: 'Julia', level: 4 }, { id: 1, name: 'Karen', level: 4 }, { id: 2, name: 'Luna', level: 4 }],
  5: [{ id: 0, name: 'Mia', level: 5 }, { id: 1, name: 'Nina', level: 5 }, { id: 2, name: 'Olivia', level: 5 }],
};

let wordsData: Word[] = [];

// 単語データを読み込む
export async function loadWordsData(): Promise<Word[]> {
  if (wordsData.length > 0) return wordsData;

  // キャッシュを避けるためにタイムスタンプを付与
  const dataPath = `data/words_data.json?t=${new Date().getTime()}`;

  try {
    console.log(`Fetching from: ${dataPath}`);
    const response = await fetch(dataPath);
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    // 【重要】中身を一度テキストとして確認する
    const text = await response.text();
    console.log("Raw Text Check (First 50 chars):", text.substring(0, 50));

    const data = JSON.parse(text);
    console.log("Parsed Data:", data);

    let words: Word[] = [];
    if (Array.isArray(data)) {
      words = data;
    } else if (data && typeof data === 'object' && Array.isArray(data.words)) {
      words = data.words;
    }

    if (words.length === 0) {
      throw new Error('No words found in the loaded data');
    }
    
    wordsData = words;
    return wordsData;
  } catch (error) {
    console.error('CRITICAL ERROR loading words data:', error);
    return [];
  }
}

export function getWordsByLevel(level: any, words: any): Word[] {
  // words が配列じゃない（undefinedやnull、オブジェクト）場合に備える
  const safeWords = Array.isArray(words) ? words : (words?.words || []);
  
  if (!Array.isArray(safeWords)) return [];

  const targetLevel = typeof level === 'string' 
    ? parseInt(level.replace(/[^0-9]/g, '')) 
    : Number(level);

  return safeWords.filter((word: any) => word && Number(word.level) === targetLevel);
}
export function getRandomWord(words: Word[]): Word {
  if (!Array.isArray(words) || words.length === 0) {
    return { word: "Error", meaning: "データ読み込み中...", level: 1 };
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
  const stateStr = stateMap[state] || 'state0';
  const ext = state === 0 ? 'png' : 'jpg';
  // 相対パス（先頭のスラッシュなし）
  return `characters/level${level}_char${charIndex}_${stateStr}.${ext}`;
}

export function getCharacterInfo(level: number): CharacterInfo | undefined {
  const characters = CHARACTERS[level];
  return characters ? characters[Math.floor(Math.random() * characters.length)] : undefined;
}

export function getRandomCharacterId(level: number): number {
  return ((level - 1) * 3) + Math.floor(Math.random() * 3);
}
