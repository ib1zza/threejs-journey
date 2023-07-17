import Lights from './Components/Lights';
import Level from "./Components/Level";
import {Debug, Physics} from "@react-three/rapier";
import {Player} from "./Components/Player";
import useGame from "./stores/useGame";
import {Effects} from "./Components/Effects";
import {Perf} from "r3f-perf";
export default function Experience() {

    const blocksCount = useGame(state => state.blocksCount);
    const blocksSeed = useGame(state => state.blockSeed);

    return <>
        <Perf/>
        {/*<Effects/>*/}
        <Lights/>

        <Physics>
            {/*<Debug/>*/}
            <color args={["#bdedfc"]} attach={"background"}/>
            <Level count={blocksCount} seed={blocksSeed}/>
            <Player/>
        </Physics>
    </>
}
