import React from 'react';
import {boxGeometry, wallmaterial} from "../utils/materials";
import {CuboidCollider, RigidBody} from "@react-three/rapier";

export const Bounds = ({length = 1}) => {
    const wallHeight = 1.5;
    return (
        <RigidBody
            type={"fixed"}
            restitution={0.2}
            friction={0}
        >
            <mesh
                name={"right"}
                position={[2.15, 0.75, -(length * 2) + 2]}
                material={wallmaterial}
                geometry={boxGeometry}
                scale={[0.3, wallHeight, 4 * length]}
                castShadow
            />
            <mesh
                name={"left"}
                position={[-2.15, 0.75, -(length * 2) + 2]}
                material={wallmaterial}
                geometry={boxGeometry}
                scale={[0.3, wallHeight, 4 * length]}
                receiveShadow
            />
            <mesh
                name={"end"}
                position={[0, 0.75, -(length * 4) + 2]}
                material={wallmaterial}
                geometry={boxGeometry}
                scale={[4, wallHeight, 0.3]}
                receiveShadow
            />
            <CuboidCollider
                args={[2, 0.1, 2 * length]}
                position={[0, -0.1, -(length * 2) + 2]}
                restitution={0.2}
                friction={1}
            />
        </RigidBody>
    );
};
