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

      let rawCreate = JSON.parse(selectedPuzzle.puzzle);
      let rawAnswer = JSON.parse(selectedPuzzle.solution);
      
      
      if (Math.random()<0.5){
        rawCreate.reverse();
        rawAnswer.reverse();
      }
      createStore.setCreate([...rawCreate]);
      createStore.setAnswer([...rawAnswer]);

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

      levelStore.level=null

    },
    { immediate: true }
  );
}