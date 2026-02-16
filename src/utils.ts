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

// 単語データを読み込む
export async function loadWordsData(): Promise<Word[]> {
  if (cachedRawData) return []; // この関数は互換性のために残すが、実際には getWordsByLevel で処理する

  const dataPath = './data/words_data.json'; 

  try {
    console.log(`Attempting to fetch data from: ${dataPath}`);
    const response = await fetch(dataPath);
    if (!response.ok) {
      throw new Error(`Data load failed: ${response.status} at ${response.url}`);
    }
    const data = await response.json();
    console.log("Fetched data successfully:", data);
    
    cachedRawData = data;
    return []; // 互換性のための空配列
  } catch (error) {
    console.error('CRITICAL LOAD ERROR:', error);
    return [];
  }
}

// レベルに合った単語をフィルタリングする
export function getWordsByLevel(level: any, _words: Word[]): Word[] {
  if (!cachedRawData) {
    console.error('Data not loaded yet');
    return [];
  }

  const levelKey = `level${level}`;
  const words = cachedRawData[levelKey];

  if (!Array.isArray(words)) {
    console.error(`No words found for level: ${levelKey}`);
    return [];
  }

  // Word型にlevelプロパティを追加して返す
  return words.map((w: any) => ({
    ...w,
    level: Number(level)
  }));
}

export function getRandomWord(words: Word[]): Word {
  if (!Array.isArray(words) || words.length === 0) {
    return { word: "Error", meaning: "データなし", level: 1 };
  }
  return words[Math.floor(Math.random() * words.length)];
}

export function generateQuizQuestion(word: Word, _allWords: Word[]): QuizQuestion {
  // 全レベルの単語から誤答を生成するために cachedRawData を使用
  let allPossibleWords: Word[] = [];
  if (cachedRawData) {
    Object.keys(cachedRawData).forEach(key => {
      if (Array.isArray(cachedRawData[key])) {
        allPossibleWords = allPossibleWords.concat(cachedRawData[key]);
      }
    });
  }

  const wrongAnswers = allPossibleWords
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
  return `./characters/level${level}_char${charIndex}_${stateMap[state] || 'state0'}.${state === 0 ? 'png' : 'jpg'}`;
}

export function getCharacterInfo(level: number): CharacterInfo | undefined {
  const characters = CHARACTERS[level];
  return characters ? characters[Math.floor(Math.random() * characters.length)] : undefined;
}

export function getRandomCharacterId(level: number): number {
  return ((level - 1) * 3) + Math.floor(Math.random() * 3);
}
