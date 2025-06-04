import { useCreateStore, useLevelStore } from '../stores/level.ts';
import { watch, onMounted, ref } from 'vue';
import initSqlJs from 'sql.js';

interface Puzzle {
  id: number;
  puzzle: number[][];
  solution: number[][];
  difficulty: string;
}

const dbFilePath = '/sudoku.sqlite';
const loadedPuzzles = ref<Puzzle[]>([]);

onMounted(async () => {
  const SQL = await initSqlJs({
    locateFile: (file: string) =>  `/${file}`
  });

  const res = await fetch(dbFilePath);
  const buffer = await res.arrayBuffer();
  const db = new SQL.Database(new Uint8Array(buffer));

  const result = db.exec("SELECT * FROM puzzles");

  if (result.length > 0) {
    const values = result[0].values;

    loadedPuzzles.value = values.map((row: [number, string, string, string]) => ({
      id: row[0],
      puzzle: JSON.parse(row[1]),
      solution: JSON.parse(row[2]),
      difficulty: row[3]
    }));
  }
});

export function usePuzzleGenerator() {
  const levelStore = useLevelStore();
  const createStore = useCreateStore();

  watch(
    () => levelStore.level,
    (newLevel) => {
      if (!newLevel) return;

      const candidates = loadedPuzzles.value.filter(p => p.difficulty === newLevel);
      if (candidates.length === 0) return;

      const randomIndex = Math.floor(Math.random() * candidates.length);
      let rawCreate = JSON.parse(JSON.stringify(candidates[randomIndex].puzzle));
      let rawAnswer = JSON.parse(JSON.stringify(candidates[randomIndex].solution));

      if (Math.random() < 0.5) {
        rawCreate.reverse();
        rawAnswer.reverse();
      }

      for (let i = 0; i < 10; i++) {
        const a = Math.floor(9 * Math.random()) + 1;
        const b = Math.floor(9 * Math.random()) + 1;

        rawCreate = rawCreate.map((row: number[]) =>
          row.map(v => {
            if (v === a) return b;
            if (v === b) return a;
            return v;
          })
        );

        rawAnswer = rawAnswer.map((row: number[]) =>
          row.map(v => {
            if (v === a) return b;
            if (v === b) return a;
            return v;
          })
        );
      }

      createStore.setCreate([...rawCreate]);
      createStore.setAnswer([...rawAnswer]);
      console.log(createStore.create);

      levelStore.level = null;
    },
    { immediate: true }
  );
}
