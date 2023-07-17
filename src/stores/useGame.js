import create from 'zustand';
import {subscribeWithSelector} from "zustand/middleware";

export default create(subscribeWithSelector((setState) => ({
    blocksCount: 6,
    blockSeed: 0,

    phase: "ready",

    startTime: 0,
    endTime: 0,

    start: () => {
        setState((state) =>
            (state.phase === "ready" ? {phase: "playing", startTime: Date.now()} : {})
        )
    },
    restart: () => {
        setState((state) =>
            (state.phase === "playing" || state.phase === "ended" ? {phase: "ready", blockSeed: Math.random()} : {})
        )
    },
    end: () => {
        setState((state) =>
            (state.phase === "playing" ? {phase: "ended",endTime: Date.now()} : {})
        )
    }
})));
