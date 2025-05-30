import { useCreateStore, useLevelStore } from '../stores/level.ts';
import {watch} from "vue"
import { easyPuzzles, hardPuzzles, normalPuzzles } from './puzzle.ts';


export function usePuzzleGenerator() {
  const levelStore = useLevelStore();
  const createStore = useCreateStore();

  watch(
    () => levelStore.level,
    (newLevel) => {
      if (newLevel === null) return;
      const x = Math.floor(3*Math.random())
      let rawCreate: number[] = [];
      let rawAnswer: number[] = []; 
      if (newLevel === 'easy') {
        rawCreate = easyPuzzles[x].create;
        rawAnswer = easyPuzzles[x].answer;
      } else if (newLevel === 'normal') {
        rawCreate = normalPuzzles[x].create;
        rawAnswer = normalPuzzles[x].answer;
      } else {
        rawCreate = hardPuzzles[x].create;
        rawAnswer = hardPuzzles[x].answer;
      }
      
      if (Math.random()<0.5){
        rawCreate.reverse();
        rawAnswer.reverse();
      }
      createStore.setCreate([...rawCreate]);
      createStore.setAnswer([...rawAnswer]);

      for (let i=0; i<10; i++){
        const a = Math.floor(9*Math.random())+1
        const b = Math.floor(9*Math.random())+1
        rawCreate=rawCreate.map(v => {
          if (v === a) return b;
          if (v === b) return a;
          return v;
        })
        rawAnswer=rawAnswer.map(v => {
          if (v === a) return b;
          if (v === b) return a;
          return v;
        })
      }

      createStore.setCreate([...rawCreate]);
      createStore.setAnswer([...rawAnswer]);

      levelStore.level=null

    },
    { immediate: true }
  );
}