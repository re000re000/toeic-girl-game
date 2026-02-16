import { Word, QuizQuestion, CharacterInfo } from './types';

const CHARACTERS: Record<number, CharacterInfo[]> = {
  1: [{ id: 0, name: 'Alice', level: 1 }, { id: 1, name: 'Bella', level: 1 }, { id: 2, name: 'Chloe', level: 1 }],
  2: [{ id: 0, name: 'Diana', level: 2 }, { id: 1, name: 'Emma', level: 2 }, { id: 2, name: 'Fiona', level: 2 }],
  3: [{ id: 0, name: 'Grace', level: 3 }, { id: 1, name: 'Hannah', level: 3 }, { id: 2, name: 'Iris', level: 3 }],
  4: [{ id: 0, name: 'Julia', level: 4 }, { id: 1, name: 'Karen', level: 4 }, { id: 2, name: 'Luna', level: 4 }],
  5: [{ id: 0, name: 'Mia', level: 5 }, { id: 1, name: 'Nina', level: 5 }, { id: 2, name: 'Olivia', level: 5 }],
};

let cachedWords: Word[] = [];

export async function loadWordsData(): Promise<Word[]> {
  if (cachedWords.length > 0) return cachedWords;
  
  // GitHub Pages上での絶対パスを指定して、迷子をゼロにします
  const dataPath = '/toeic-girl-game/data/words_data.json';

  try {
    const response = await fetch(dataPath);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    const words = Array.isArray(data) ? data : (data.words || []);
    cachedWords = words;
    return words;
  } catch (error) {
    console.error('Failed to load words:', error);
    return [];
  }
}

export function getWordsByLevel(level: any, words: any): Word[] {
  // ここが「filterがない」と怒られている場所なので、徹底的に守ります
  const arrayToFilter = Array.isArray(words) ? words : (Array.isArray(cachedWords) ? cachedWords : []);
  
  const targetLevel = typeof level === 'string' 
    ? parseInt(level.replace(/[^0-9]/g, '')) 
    : Number(level);

  return arrayToFilter.filter((w: any) => w && Number(w.level) === targetLevel);
}

export function getRandomWord(words: Word[]): Word {
  if (!Array.isArray(words) || words.length === 0) return { word: "Error", meaning: "Loading...", level: 1 };
  return words[Math.floor(Math.random() * words.length)];
}

export function generateQuizQuestion(word: Word, allWords: Word[]): QuizQuestion {
  const wrongAnswers = allWords.filter(w => w.word !== word.word).sort(() => 0.5 - Math.random()).slice(0, 2).map(w => w.meaning);
  const options = [word.meaning, ...wrongAnswers].sort(() => 0.5 - Math.random());
  return { word, options, correctIndex: options.indexOf(word.meaning) };
}

export function getCharacterImagePath(characterId: number, state: number): string {
  const stateMap: Record<number, string> = { 0: 'state0', 1: 'state1', 2: 'state1_5', 3: 'state2' };
  const level = Math.floor(characterId / 3) + 1;
  const charIndex = characterId % 3;
  return `characters/level${level}_char${charIndex}_${stateMap[state] || 'state0'}.${state === 0 ? 'png' : 'jpg'}`;
}

export function getCharacterInfo(level: number): CharacterInfo | undefined {
  const characters = CHARACTERS[level];
  return characters ? characters[Math.floor(Math.random() * characters.length)] : undefined;
}

export function getRandomCharacterId(level: number): number {
  return ((level - 1) * 3) + Math.floor(Math.random() * 3);
}
