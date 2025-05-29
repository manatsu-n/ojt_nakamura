<script setup lang="ts">
    import {ref, computed , onMounted, onUnmounted} from "vue"
    import { useNumberStore, usekesigomuStore, usehintoStore, useWrongStore, useMemoStore, useClearflagStore } from "../stores/level";
    import kesigomuimg from '../assets/kesigomu.png';
    import memoimg from '../assets/memo.png';
    import hintoimg from '../assets/hinto.png';
    
    const elapsed = ref<number>(0)
    let timer:number = 0
    const flagStore = useClearflagStore();
    onMounted(() => {
        timer = setInterval(() => {
            elapsed.value++
            if (wrongStore.wrong >= 3){
                clearInterval(timer)
            }
            if(flagStore.flag){
                clearInterval(timer)
            }
        }, 1000)
    })
    
    const minsec = computed(() => {
        const min = Math.floor(elapsed.value / 60).toString().padStart(2, '0')
        const sec = (elapsed.value % 60).toString().padStart(2, '0')
        return `${min}:${sec}`
    })

    onUnmounted(() => {
          clearInterval(timer)
    })

    const wrongStore = useWrongStore()

    const kesiStore = usekesigomuStore()
    function kesu(){
        kesiStore.setKesi(true);
    }

    const hintoStore = usehintoStore()
    function decreasehinto(){
        if (flagStore.flag || wrongStore.wrong >= 3) return;
        if (hintoStore.hinto>0){
            hintoStore.hinto--;
        }
    }
    
    const numberStore = useNumberStore()
    function pushnum(num:number){
        numberStore.setNumber(num)
    }

    const memo = useMemoStore();
    function memoswitch(){
        memo.toggle();
    }

</script>

<template>
    <div class="Board">
        <section class="up">
            <div>
                間違い:
                {{ wrongStore.wrong }}/3
            </div>
            <div>
                経過時間： {{ minsec }}
            </div>
        </section>
        <section>
            <ol>
                <li>
                    <img :src="kesigomuimg" alt="消しゴム" @click="kesu">
                </li>
                <li>
                    <img :src="memoimg" alt="メモ" @click="memoswitch">
                    <span id="memo">{{ memo.onoff }}</span>
                </li>
                <li>
                    <img :src="hintoimg" alt="ヒント"  @click="decreasehinto">
                    <span id="hinto">{{  hintoStore.hinto }}</span>
                </li>
            </ol>
        </section>
        <section>
            <table>
                <tr v-for="r in 3" :key="r">
                    <td v-for="c in 3" :key="c">
                        <button @click="pushnum((r - 1) * 3 + c)"> 
                            {{ (r - 1) * 3 + c }}
                        </button>
                    </td>
                </tr>
            </table>
        </section>
    </div>
</template>

<style scoped>
    .up{
        display: flex;
        justify-content: space-between;
        padding: 0 15px;
    }

    section{
        margin: 5px;
    }

    ol{
        list-style-type: none;
        padding: 0;
        display: flex;
        justify-content: space-between;
        margin: 15px;
    }

    li{
        display: inline;
        position: relative;
    }

    img{
        height: 60px;
        width: 60px;
        margin: 10px;
    }

    #memo{
        position: absolute;
        top: 0;
        right: 5px;
        border: 1px solid hsl(0, 16%, 9%);
        border-radius: 9999px;
        height: 20px;
        width: 35px;
        text-align: center;
        pointer-events: none;
        line-height: 20px;
    }

    #hinto{
        position: absolute;
        top: 5px;
        right: 5px;
        pointer-events: none;
    }

    button{
        height: 90px;
        width: 90px;
        font-size: 250%;
    }
</style>