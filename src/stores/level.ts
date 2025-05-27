import { defineStore } from 'pinia';

export const useLevelStore = defineStore('level', {
  state: () => ({
    level: '' as string | null
  }),
  actions: {
    setLevel(newLevel: string) {
      this.level = newLevel;
    }
  }
});

export const useCreateStore = defineStore('create', {
  state: () => ({
    create: [] as number[],
    answer: [] as number[],
  }),
  actions: {
    setCreate(newCreate: number[]) {
      this.create = newCreate;
    },
    setAnswer(newAnswer: number[]) {
      this.answer = newAnswer;
    },
  }
});

export const useNumberStore = defineStore('number', {
  state: () => ({
    number: 0 as number | null
  }),
  actions: {
    setNumber(newnumber: number) {
      this.number = newnumber
    },
  }
})

export const useWrongStore = defineStore('wrong', {
  state: () => ({
    wrong: 0 as number
  }),
  actions: {
    setWrong(newwrong: number) {
      this.wrong = newwrong
    },
  }
})

export const usekesigomuStore = defineStore('kesi', {
  state: () => ({
    kesi: false as boolean
  }),
  actions: {
    setKesi(newkesi: boolean) {
      this.kesi = newkesi
    },
  }
})

export const usehintoStore = defineStore('hinto', {
  state: () => ({
    hinto: 3 as number
  }),
  actions: {
    setHinto(newhinto: number) {
      this.hinto = newhinto
    },
  }
})

export const useClearflagStore = defineStore('flag', {
  state: () => ({
    flag: false as boolean
  }),
})

export const useMemoStore = defineStore('memo', {
  state: () => ({
    onoff: 'off' as 'on' | 'off',
  }),

  getters: {
    flag: (state): boolean => {
      const map: Record<'on' | 'off', boolean> = {
        on: true,
        off: false,
      };
      return map[state.onoff];
    },
  },

  actions: {
    toggle() {
      this.onoff = this.onoff === 'on' ? 'off' : 'on';
    },
  },
});