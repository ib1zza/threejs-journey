import {useFrame, extend, useThree} from "@react-three/fiber";
import {useRef} from "react";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import CustomObject from "./CustomObject";

extend({OrbitControls});

const Experience = () => {
    const cubeRef = useRef(null);
    const groupRef = useRef(null);
    const {camera, gl} = useThree();
    // camera.position.y = 3;
    useFrame((state, delta) => {
        cubeRef.current.rotation.y += delta;
        // state.camera.position.x = Math.cos(state.clock.elapsedTime) * 3;
        // state.camera.position.z = Math.sin(state.clock.elapsedTime) * 3;
        // state.camera.lookAt(0, 0, 0);
    })
    return (
        <>
            <orbitControls args={[camera, gl.domElement]} />

            <directionalLight position={[1,2,3]} intensity={1.5} />
            <ambientLight intensity={0.5} />

            <group ref={groupRef} >
                <mesh position={[-3, 0, 0]}>
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshStandardMaterial color="orange" />
                </mesh>
                <mesh ref={cubeRef} scale={[1.5, 2, 1]} position={[2, 0, 0]}>
                    <boxGeometry />
                    <meshStandardMaterial color="hotpink" />
                </mesh>
            </group>
            <mesh position-y={-1.5} rotation-x={-Math.PI / 2}>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial color="green" />
            </mesh>
            <CustomObject/>
        </>
    );
};

export default Experience;