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
    const cells = ref<{ [key: string]: number | undefined}>({});
    const memos = ref<Record<string, Set<number>>>({});
    const readonlyFlags = ref<{ [key: string]: boolean }>({});
    for (let i = 1; i <= 81; i++) {
        const key = `cell${i}`;
        readonlyFlags.value[key] = cstore.create[i - 1] !== 0;
        cells.value[key] = cstore.create[i - 1] !== 0 ? cstore.create[i - 1] : undefined;
    }

    const flagStore = useClearflagStore()
    flagStore.flag=false;
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

    const activeCell = ref<{row:number, col: number}>({ row: 1, col: 1 })
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
        if (/^[1-9]$/.test(key)){
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
    function changeback(row:number,col:number){
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
            if (!readonlyFlags.value[key.value]){
                if (memo.onoff==="on"){
                    memoInput(newnumber);
                }else{
                    numberInput(newnumber);
                }
            }
            numberStore.number=null
        }
    )

    function memoInput(num: number) {
        if (readonlyFlags.value[key.value]) return;
        if (!memos.value[key.value]) {
            memos.value[key.value] = new Set<number>();
        }
        if (memos.value[key.value].has(num)) {
            memos.value[key.value].delete(num);
        } else {
            memos.value[key.value].add(num);
        }
    }

    function numberInput(num: number) {
        if (cells.value[key.value] === num) {
            cells.value[key.value] = undefined;
        }else{
            cells.value[key.value] = num;
            if (cstore.answer[cellINdex.value - 1] !== num) {
                wrongStore.wrong++; 
            }else{
                removeRelatedMemos(num);
            }
        }
    }

    function removeRelatedMemos(num: number) {
        for (let i = 1; i <= 81; i++) {
            const row = Math.floor((i - 1) / 9) + 1;
            const col = (i - 1) % 9 + 1;
            const key2 = `cell${i}`;

            const sameRow = row === activeCell.value.row;
            const sameCol = col === activeCell.value.col;
            const sameBlock = rowBlock.value.includes(row) && colBlock.value.includes(col);

            if (sameRow || sameCol || sameBlock) {
                memos.value[key2]?.delete(num);
            }
        }
    }

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
            if(flagStore.flag || wrongStore.wrong >= 3) return;
            if (readonlyFlags.value[key.value] === false){
                cells.value[key.value] = undefined;
                memos.value[key.value] = new Set<number>();
            }
            kesiStore.kesi = false;
        }
    )

    const hintoStore = usehintoStore()
    hintoStore.hinto=3
    watch(
        () => hintoStore.hinto,
        (newVal, oldVal) => {
            if(newVal > oldVal) return;
            if (readonlyFlags.value[key.value] === false){
                cells.value[key.value] = cstore.answer[cellINdex.value-1];
                readonlyFlags.value[key.value] = true;
                removeRelatedMemos(cstore.answer[cellINdex.value - 1]);
            } else {
                hintoStore.hinto = oldVal
            }
        }
    )
</script>

<template>
    <div class="Puzzle"
        ref="puzzleDiv"
        tabindex="0" 
        @keyup.right="moveRight" 
        @keyup.left="moveLeft" 
        @keyup.up="moveUp" 
        @keyup.down="moveDown"
        @keyup="onKeyup"
    >
        <table>
            <tr v-for="row in 9" :key="row">
                <td v-for="col in 9" :key="col" @click="changeback(row,col)" 
                    :class="[{ 
                    block: rowBlock.includes(row) && colBlock.includes(col),
                    rank2: activeCell.row === row || activeCell.col === col, 
                    rank1: activeCell.row === row && activeCell.col === col},
                    getColorClass(row, col)]"
                >
                    <template v-if="cells[`cell${(row - 1) * 9 + col}`] !== undefined">
                        {{ cells[`cell${(row - 1) * 9 + col}`] }}
                    </template>
                    <template v-else>
                        <div class="memo-grid">
                            <span
                                v-for="n in 9" :key="n"
                                class="memo-num"
                            >
                                {{ memos[`cell${(row-1)*9+col}`]?.has(n)?n:`` }}
                            </span>
                        </div>
                    </template>
                </td>
            </tr>
        </table>
    </div>
</template>

<style scoped>
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

    td:nth-child(9){
        border-right: 2px solid black;
    }

    tr:nth-child(3n+1){
        border-top: 2px solid black;
    }

    tr:nth-child(9) td{
        border-bottom: 2px solid black;
    }

    table{
        border-collapse: collapse;
    }

    .block, .rank2{
        background-color: rgb(219, 236, 252);
    }

    .rank1{
        background-color: rgb(153, 205, 253);
    }

    .correct{
        color: rgb(1, 1, 157);
    }

    .incorrect{
        color: red;
    }

    .memo-grid{
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(3, 1fr);
        font-size: 10px;
        color: gray;
        padding: 3px;
    }

    .memo-num{
        line-height: 1.2;
        align-items: center;
        justify-content: center;
        display: flex;
    }

    @media (max-width:770px) {
        td {
            height: 30px;
            width: 30px;
            font-size: 100%;
        }

        .memo-grid {
            font-size: 6px;
        }
    }
</style>