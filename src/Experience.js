import {OrbitControls} from '@react-three/drei'
import {Perf} from 'r3f-perf'
import Model from "./Model";
import {Suspense} from "react";
import Placeholder from "./Placeholder";
import Fox from "./Fox";


export default function Experience() {
    return <>

        <Perf position="top-left"/>

        <OrbitControls makeDefault/>

        <directionalLight shadow-normalBias={0.04} castShadow position={[1, 2, 3]} intensity={1.5}/>
        <ambientLight intensity={0.5}/>


        <mesh receiveShadow position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
            <planeGeometry/>
            <meshStandardMaterial color="greenyellow"/>
        </mesh>

        <Suspense fallback={
            <Placeholder position-y={0.5} scale={[2,3,2]}/>
        }>
            <Model scale={0.35}/>
        </Suspense>

        <Fox scale={0.02} position={[-2.5, 0, 2.5]} rotation-y={0.3}/>
    </>
}