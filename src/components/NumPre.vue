<script setup lang="ts">
    import {ref, watch} from "vue"
    import Board from "./BoardView.vue" 
    import Puzzle from "../logic/PuzzleQuestion.vue"
    import { useRouter } from 'vue-router';
    import { useWrongStore, useClearflagStore } from "../stores/level";
    const gameover = ref<boolean>(false);
    const gameclear = ref<boolean>(false);
    const router = useRouter();
    const wrongStore = useWrongStore();
    const flagStore = useClearflagStore();
    watch(
        [() => wrongStore.wrong, () => flagStore.flag],
        ([newWrong, newFlag]) => {
            if (newWrong >= 3) {
                gameover.value = true;
            }
            if (newFlag) {
                gameclear.value = true;
            }
        }
    );

    const retry = () => {
        router.push({ path: '/game', query: { r: String(Date.now()) } });
    }

    const gotoselect = () => {
        router.push('/');
    };
</script>

<template>
    <div class="numpre">
        <div>
            <header>
                <button @click="gotoselect">難易度選択に戻る</button>
            </header>
            <Puzzle />
        </div>
        <Board />
    </div>

    <Teleport to="body">
        <div v-if="gameover" class="modal">
            <h1>gameover</h1>
            <button @click="retry">リトライ</button>
            <button @click="gotoselect">難易度選択に戻る</button>
        </div>
    </Teleport>

    <Teleport to="body">
        <div v-if="gameclear" class="modal">
            <h1>gameclear</h1>
            <button @click="gotoselect">難易度選択に戻る</button>
        </div>
    </Teleport>
</template>

<style scoped>
    header{
        display: block;
        margin: 15px;
    }
    
    .numpre{
        display: flex;
        justify-content: center;
        align-items: end;
    }

    .modal{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border: 1px solid #ccc;
        padding: 1rem;
        z-index: 1000;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        height: 350px;
        width: 600px;
        align-items: center;
        text-align: center;
        opacity: 0.93;
    }

    h1{
        margin-top: 100px;
    }

    .modal>button{
        margin: 10px;
        width: 150px;
        height: 30px;
    }    
</style>