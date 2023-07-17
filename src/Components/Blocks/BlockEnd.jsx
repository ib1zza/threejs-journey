import {Float, Text, useGLTF} from "@react-three/drei";
import {RigidBody} from "@react-three/rapier";
import React from "react";
import {boxGeometry, floor1material} from "../../utils/materials";

export function BlockEnd({position = [0, 0, 0]}) {
    const hamburger = useGLTF("./hamburger.glb");
    hamburger.scene.children.forEach((child) => {
        child.castShadow = true
        console.log(child)
    })
    return (<group position={position}>
        <mesh
            position={[0, 0, 0]}
            receiveShadow
            geometry={boxGeometry}
            scale={[4, 0.2, 4]}
            material={floor1material}
        />
        <RigidBody
            type={"fixed"}
            colliders={"hull"}
            restitution={0.2}
            friction={0}
            position={[0, 0.25, 0]}
        >
            <primitive object={hamburger.scene} scale={0.2}/>
        </RigidBody>


        <Text
            font={"./bebas-neue-v9-latin-regular.woff"}
            scale={0.8}
            position={[0, 2.25, 0]}

        >
            FINISH
            <meshBasicMaterial toneMapped={false}/>
        </Text>
    </group>);
}
