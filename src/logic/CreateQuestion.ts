import { useCreateStore, useLevelStore, usePuzzlesStore } from '../stores/level.ts';
import { watch } from "vue"

export function usePuzzleGenerator() {
  const levelStore = useLevelStore();
  const createStore = useCreateStore();
  const puzzles = usePuzzlesStore().puzzles;

  watch(
    () => levelStore.level,
    (newLevel) => {
      if (!newLevel) return;
      const filteredPuzzles = puzzles.filter(p => p.difficulty === newLevel);
      if (filteredPuzzles.length === 0) return;

      const randomIndex = Math.floor(Math.random() * filteredPuzzles.length);
      const selectedPuzzle = filteredPuzzles[randomIndex];
      const {rawCreate, rawAnswer} = calcRaw(selectedPuzzle.puzzle, selectedPuzzle.solution);
      
      createStore.setId(selectedPuzzle.id);
      createStore.setCreate([...rawCreate]);
      createStore.setAnswer([...rawAnswer]);
      levelStore.level=null
      console.log(createStore.id)
      console.log(createStore.answer)
    },
    { immediate: true }
  );
}

function calcRaw(puzzleStr: string, solutionStr: string) {
  let rawCreate = JSON.parse(puzzleStr);
  let rawAnswer = JSON.parse(solutionStr);

  if (Math.random() < 0.5) {
    rawCreate.reverse();
    rawAnswer.reverse();
  }

  for (let i = 0; i < 10; i++) {
    const a = Math.floor(9 * Math.random()) + 1;
    const b = Math.floor(9 * Math.random()) + 1;
    rawCreate = rawCreate.map((row: number[]) =>
      row.map(v => (v === a ? b : v === b ? a : v))
    );
    rawAnswer = rawAnswer.map((row: number[]) =>
      row.map(v => (v === a ? b : v === b ? a : v))
    );
  }

  return { rawCreate, rawAnswer };
}