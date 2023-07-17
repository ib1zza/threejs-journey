import React, {useRef, useState} from "react";
import {useFrame} from "@react-three/fiber";
import {RigidBody} from "@react-three/rapier";
import {boxGeometry, floor2material, obstacle1material} from "../../utils/materials";

export function BlockAxe({position = [0, 0, 0]}) {
    const [timeOffset] = useState((() => Math.random() * Math.PI * 2));
    const obstacle = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const y = Math.sin(time + timeOffset) * 1.1;

        obstacle.current.setNextKinematicTranslation({
            x: 0 + position[0] + y, y: 0.95 + position[1], z: 0 + position[2],
        })
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
                scale={[1.5, 1.5, 0.3]}
                castShadow
                receiveShadow
            />
        </RigidBody>
    </group>);
}
