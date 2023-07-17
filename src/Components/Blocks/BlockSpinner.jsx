import React, {useRef, useState} from "react";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";
import {RigidBody} from "@react-three/rapier";
import {boxGeometry, floor2material, obstacle1material} from "../../utils/materials";

export function BlockSpinner({position = [0, 0, 0]}) {
    const [speed] = useState((() => (Math.random() + 0.2) * (Math.random() < 0.5 ? 1 : -1)));
    const obstacle = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const rotation = new THREE.Quaternion();
        rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
        obstacle.current.setNextKinematicRotation(rotation);
    })
    return (<group position={position}>
            <mesh
                position={[0, -0.1, 0]}
                receiveShadow
                geometry={boxGeometry}
                scale={[4, 0.2, 4]}
                material={floor2material}
            />
            <RigidBody
                ref={obstacle}
                type={"kinematicPosition"}
                position={[0, 0.3, 0]}
                restitution={0.2}
                friction={0}
            >
                <mesh
                    geometry={boxGeometry}
                    material={obstacle1material}

                    scale={[3.5, 0.3, 0.3]}
                    castShadow
                    receiveShadow
                />
            </RigidBody>
        </group>

    );
}