import React, {useMemo} from 'react';
import {BlockStart} from "./Blocks/BlockStart";
import {BlockLimbo} from "./Blocks/BlockLimbo";
import {BlockSpinner} from "./Blocks/BlockSpinner";
import {BlockAxe} from "./Blocks/BlockAxe";
import {BlockEnd} from "./Blocks/BlockEnd";
import {Bounds} from "./Bounds";
import {Float, Text} from "@react-three/drei";


const Level = ({count = 5, types = [BlockSpinner, BlockLimbo, BlockAxe], seed = 0}) => {
    const blocks = useMemo(() => {
        const blocks = [];
        for (let i = 0; i < count; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            blocks.push(type);
        }
        return blocks;
    }, [count, types, seed]);
    return (<>
        <BlockStart position={[0, 0, 0]}/>
        {
            blocks.map((Block, index) => {
                return <Block key={index} position={[0, 0, -(index + 1)  * 4]}/>
            })
        }
        <BlockEnd position={[0, 0, -(count + 1) * 4]}/>
        <Bounds length={count + 2 }/>

    </>);
};

export default Level;
