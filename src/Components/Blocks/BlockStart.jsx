import React from "react";
import {boxGeometry, floor1material} from "../../utils/materials";
import {Float, Text} from "@react-three/drei";

export function BlockStart({position = [0, 0, 0]}) {
    return (<group position={position}>
        <mesh
            position={[0, -0.1, 0]}
            receiveShadow
            geometry={boxGeometry}
            scale={[4, 0.2, 4]}
            material={floor1material}
        />
        <Float
            floatIntensity={0.25}
            rotationIntensity={0.25}
        >
            <Text
                font={"./bebas-neue-v9-latin-regular.woff"}
                scale={ 0.4}
                lineHeight={0.75}
                textAlign={"right"}
                position={[0.75, 0.65, 0]}
                rotation-y={-0.25}
                maxWidth={0.25}
            >
                Marble race
                <meshBasicMaterial toneMapped={false}/>
            </Text>
        </Float>
    </group>);
}
