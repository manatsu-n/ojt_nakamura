<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"
import { useCreateStore, useNumberStore, usekesigomuStore, usehintoStore, useWrongStore, useClearflagStore, useMemoStore } from "../stores/level.ts";
import { usePuzzleGenerator } from "./CreateQuestion";

const puzzleDiv = ref<HTMLDivElement | null>(null);

onMounted(() => {
    puzzleDiv.value?.focus();
    puzzleDiv.value?.addEventListener('blur', () => {
        setTimeout(() => {
            puzzleDiv.value?.focus();
        }, 0);
    });
});

usePuzzleGenerator();
const cstore = useCreateStore();
const cells = ref<{ [key: string]: number | undefined }>({});
const memos = ref<Record<string, Set<number>>>({});
const readonlyFlags = ref<{ [key: string]: boolean }>({});
for (let i = 1; i <= 81; i++) {
    const key = `cell${i}`;
    readonlyFlags.value[key] = cstore.create[i - 1] !== 0;
    cells.value[key] = cstore.create[i - 1] !== 0 ? cstore.create[i - 1] : undefined;
}

const flagStore = useClearflagStore()
flagStore.flag = false;
const filledCount = computed(() => {
    return Object.entries(cells.value).filter(([key, val]) => {
        if (val === undefined) return false;
        const index = Number(key.replace('cell', '')) - 1;
        return val === cstore.answer[index];
    }).length;
});

watch(filledCount, (newVal) => {
    if (newVal === 81) {
        flagStore.flag = true;
    }
});

const activeCell = ref<{ row: number, col: number }>({ row: 1, col: 1 })
const cellINdex = computed(() =>
    (activeCell.value.row - 1) * 9 + (activeCell.value.col - 1) + 1
);
const key = computed(() => `cell${cellINdex.value}`);

const moveRight = () => {
    if (activeCell.value.col < 9) activeCell.value.col++
}
const moveLeft = () => {
    if (activeCell.value.col > 1) activeCell.value.col--
}
const moveUp = () => {
    if (activeCell.value.row > 1) activeCell.value.row--
}
const moveDown = () => {
    if (activeCell.value.row < 9) activeCell.value.row++
}

const onKeyup = (event: KeyboardEvent) => {
    const key = event.key
    if (/^[1-9]$/.test(key)) {
        numberStore.setNumber(parseInt(key))
    }
}

const rowBlock = computed(() => {
    const start = Math.floor((activeCell.value.row - 1) / 3) * 3 + 1
    return [start, start + 1, start + 2]
})
const colBlock = computed(() => {
    const start = Math.floor((activeCell.value.col - 1) / 3) * 3 + 1
    return [start, start + 1, start + 2]
})
function changeback(row: number, col: number) {
    activeCell.value = { row, col }
}

const numberStore = useNumberStore();
const memo = useMemoStore();
const wrongStore = useWrongStore();
wrongStore.wrong = 0;

watch(
    () => numberStore.number,
    (newnumber) => {
        if (newnumber === null || flagStore.flag || wrongStore.wrong >= 3) return;
        if (!readonlyFlags.value[key.value]) {
            if (memo.onoff === "on") {
                if (!memos.value[key.value]) {
                    memos.value[key.value] = new Set<number>();
                }
                const memoSet = memos.value[key.value]!;
                if (memoSet.has(newnumber)) {
                    memoSet.delete(newnumber);
                } else {
                    memoSet.add(newnumber);
                }
            } else {
                if (cells.value[key.value] === newnumber) {
                    cells.value[key.value] = undefined;
                } else {
                    cells.value[key.value] = newnumber;
                    if (cstore.answer[cellINdex.value - 1] !== newnumber) {
                        wrongStore.wrong++;
                    } else {
                        for (let i = 1; i <= 81; i++) {
                            const row = Math.floor((i - 1) / 9) + 1;
                            const col = (i - 1) % 9 + 1;
                            const key2 = `cell${i}`;

                            const sameRow = row === activeCell.value.row;
                            const sameCol = col === activeCell.value.col;
                            const sameBlock = rowBlock.value.includes(row) && colBlock.value.includes(col);

                            if (sameRow || sameCol || sameBlock) {
                                memos.value[key2]?.delete(newnumber);
                            }
                        }
                    }
                }
            }
        }
        numberStore.number = null
    }
)

function getColorClass(row: number, col: number) {
    const index = (row - 1) * 9 + col;
    const key = `cell${index}`;
    const cellValue = cells.value[key];
    const answerValue = cstore.answer[index - 1];

    if (cellValue == null || readonlyFlags.value[key]) return '';
    return Number(cellValue) === answerValue ? 'correct' : 'incorrect';
}

const kesiStore = usekesigomuStore()
watch(
    () => kesiStore.kesi,
    () => {
        if (flagStore.flag || wrongStore.wrong >= 3) return;
        if (readonlyFlags.value[key.value] === false) {
            cells.value[key.value] = undefined;
            memos.value[key.value] = new Set<number>();
        }
        kesiStore.kesi = false;
    }
)

const hintoStore = usehintoStore()
hintoStore.hinto = 3
watch(
    () => hintoStore.hinto,
    () => {
        if (readonlyFlags.value[key.value] === false) {
            cells.value[key.value] = cstore.answer[cellINdex.value - 1];
            readonlyFlags.value[key.value] = true;
        } else {
            for (let i = 1; i <= 81; i++) {
                activeCell.value.col = i % 9 === 0 ? 9 : i % 9
                activeCell.value.row = Math.floor((i - 1) / 9) + 1
                if (!readonlyFlags.value[key.value]) {
                    memos.value[key.value] = new Set<number>();
                    for (let j = 1; j <= 9; j++) {
                        memos.value[key.value].add(j);
                    }
                    removeUsedNumbers()
                }
            }
        }
    }
)
function removeUsedNumbers() {
    for (let j = 1; j <= 9; j++) {
        const key3 = `cell${9 * (activeCell.value.row - 1) + j}`
        const key4 = `cell${activeCell.value.col + (j - 1) * 9}`
        if (cells.value[key3]) {
            memos.value[key.value].delete(cells.value[key3]);
        }
        if (cells.value[key4]) {
            memos.value[key.value].delete(cells.value[key4]);
        }
    }
    for (let j = 1; j <= 9; j++) {
        const blockCol = Math.floor((activeCell.value.col - 1) / 3)
        const blockRow = Math.floor((activeCell.value.row - 1) / 3)
        for (let l = 1; l <= 3; l++) {
            for (let m = 1; m <= 3; m++) {
                const key5 = `cell${9 * (3 * blockRow + m - 1) + (blockCol * 3 + l)}`
                if (cells.value[key5]) {
                    memos.value[key.value].delete(cells.value[key5]);
                }
            }
        }
    }
}
</script>

<template>
    <div class="Puzzle" ref="puzzleDiv" tabindex="0" @keyup.right="moveRight" @keyup.left="moveLeft" @keyup.up="moveUp"
        @keyup.down="moveDown" @keyup="onKeyup">
        <table>
            <tr v-for="row in 9" :key="row">
                <td v-for="col in 9" :key="col" @click="changeback(row, col)" :class="[{
                    block: rowBlock.includes(row) && colBlock.includes(col),
                    rank2: activeCell.row === row || activeCell.col === col,
                    rank1: activeCell.row === row && activeCell.col === col
                },
                getColorClass(row, col)]">
                    <template v-if="cells[`cell${(row - 1) * 9 + col}`] !== undefined">
                        {{ cells[`cell${(row - 1) * 9 + col}`] }}
                    </template>
                    <template v-else>
                        <div class="memo-grid">
                            <span v-for="n in 9" :key="n" class="memo-num">
                                {{ memos[`cell${(row - 1) * 9 + col}`]?.has(n) ? n : `` }}
                            </span>
                        </div>
                    </template>
                </td>
            </tr>
        </table>
    </div>
</template>

<style scoped>
.Puzzle {
    outline: none;
}

td {
    border: 1px solid black;
    height: 45px;
    width: 45px;
    text-align: center;
    font-size: 150%;
    position: relative;
}

td:nth-child(1),
td:nth-child(4),
td:nth-child(7) {
    border-left: 2px solid black;
}

td:nth-child(9) {
    border-right: 2px solid black;
}

tr:nth-child(3n+1) {
    border-top: 2px solid black;
}

tr:nth-child(9) td {
    border-bottom: 2px solid black;
}

table {
    border-collapse: collapse;
}

.block,
.rank2 {
    background-color: rgb(219, 236, 252);
}

.rank1 {
    background-color: rgb(153, 205, 253);
}

.correct {
    color: rgb(1, 1, 157);
}

.incorrect {
    color: red;
}

.memo-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    font-size: 10px;
    color: gray;
    padding: 3px;
}

.memo-num {
    line-height: 1.2;
    align-items: center;
    justify-content: center;
    display: flex;
}
</style>