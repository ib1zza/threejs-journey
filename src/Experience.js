import {OrbitControls, useGLTF} from '@react-three/drei'
import {Perf} from 'r3f-perf'
import {CuboidCollider, CylinderCollider, Debug, InstancedRigidBodies, Physics, RigidBody} from "@react-three/rapier";
import {useEffect, useMemo, useRef, useState} from "react";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";

export default function Experience() {
    const [hitSound] = useState(() => new Audio("./hit.mp3"))

    const cube = useRef();

    const hamburger = useGLTF("./hamburger.glb");

    const cubeJump = () => {
        const mass = cube.current.mass();
        cube.current.applyImpulse({x: 0, y: 5 * mass, z: 0})
        cube.current.applyTorqueImpulse({x: 0, y: 1, z: 0})
    }

    const twister = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        const eulerRotation = new THREE.Euler(0, time, 0);
        const quaternionRotation = new THREE.Quaternion();
        quaternionRotation.setFromEuler(eulerRotation);

        twister.current.setNextKinematicRotation(quaternionRotation);


        const angle = time * 0.5;
        const x = Math.cos(angle) * 2;
        const z = Math.sin(angle) * 2;

        twister.current.setNextKinematicTranslation({x, y: -0.8, z,});
    })

    const collisionEnter = () => {
        hitSound.currentTime = 0;
        hitSound.volume = Math.random();
        hitSound.play();
        console.log("collision!")
    }

    const cubesCount = 3;

    const cubes = useRef();

    const cubeTransforms = useMemo(() =>  {
        const positions = [];
        const rotations = [];
        const scales = [];

        for (let i = 0; i < cubesCount; i++) {
            positions.push([i * 2, 0, 0]);
            rotations.push([0, 0, 0]);
            scales.push([1, 1, 1]);
        }

        return {positions, rotations, scales};
    }, [])

    // useEffect(() => {
    //     for (let i = 0; i < cubesCount; i++) {
    //         const matrix = new THREE.Matrix4();
    //
    //         matrix.compose(
    //             new THREE.Vector3(i * 2, 0, 0),
    //             new THREE.Quaternion(),
    //             new THREE.Vector3(1, 1, 1)
    //         )
    //         cubes.current.setMatrixAt(i, matrix);
    //     }
    // }, [])

    return <>

        <Perf position="top-left"/>

        <OrbitControls makeDefault/>

        <directionalLight castShadow position={[1, 2, 3]} intensity={1.5}/>
        <ambientLight intensity={0.5}/>

        <Physics>
            <Debug/>
            {/*<RigidBody colliders={"ball"}>*/}
            {/*    <mesh castShadow position={[0, 2, 0]}>*/}
            {/*        <sphereGeometry/>*/}
            {/*        <meshStandardMaterial color="orange"/>*/}
            {/*    </mesh>*/}
            {/*</RigidBody>*/}

            <RigidBody
                position={[1.5, 2, 0]}
                ref={cube}
                restitution={0.5}
                friction={0}
                colliders={false}
                onCollisionEnter={collisionEnter}
            >
                <mesh onClick={cubeJump} receiveShadow>
                    <boxGeometry/>
                    <meshStandardMaterial color="mediumpurple"/>
                </mesh>
                <CuboidCollider mass={0.5} args={[0.5, 0.5, 0.5]}/>
            </RigidBody>

            <RigidBody type={"fixed"}>
                <mesh receiveShadow position-y={-1.25}>
                    <boxGeometry args={[10, 0.5, 10]}/>
                    <meshStandardMaterial color="greenyellow"/>
                </mesh>
            </RigidBody>


            <RigidBody ref={twister} position={[0, -0.8, 0]} friction={0} type={"kinematicPosition"}>
                <mesh castShadow scale={[0.4, 0.4, 3]}>
                    <boxGeometry/>
                    <meshStandardMaterial color="red"/>
                </mesh>
            </RigidBody>
            <RigidBody position={[0, 4, 0]} colliders={false}>
                <primitive object={hamburger.scene} scale={0.25}/>
                <CylinderCollider args={[0.5, 1.25]}/>
            </RigidBody>
            <RigidBody type="fixed">
                <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.5]}/>
                <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, -5.5]}/>
                <CuboidCollider args={[0.5, 2, 5]} position={[5.5, 1, 0]}/>
                <CuboidCollider args={[0.5, 2, 5]} position={[-5.5, 1, 0]}/>
            </RigidBody>

            <InstancedRigidBodies
                positions={cubeTransforms.positions}
                rotations={cubeTransforms.rotations}
                scales={cubeTransforms.scales}
            >
                <instancedMesh castShadow receiveShadow ref={cubes} args={[null, null, cubesCount]}>
                    <boxGeometry/>
                    <meshStandardMaterial color="tomato"/>
                </instancedMesh>
            </InstancedRigidBodies>
        </Physics>
    </>
}