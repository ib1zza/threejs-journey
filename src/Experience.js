import {MeshReflectorMaterial, OrbitControls, Float, TransformControls, PivotControls, Html, Text} from "@react-three/drei";
import {useRef} from "react";


export default function Experience() {
    const cubeRef = useRef(null);
    const sphereRef = useRef(null);

    return <>
        <OrbitControls makeDefault/>
        <directionalLight position={[1, 2, 3]} intensity={1.5}/>
        <ambientLight intensity={0.5}/>

        <PivotControls anchor={[0, 0, 0]} depthTest={false}>
            <mesh position-x={-2} ref={sphereRef}>
                <sphereGeometry />
                <meshStandardMaterial color="orange"/>
                <Html
                    position={[1,1,0]}
                    wrapperClass={"label"}
                    center
                    distanceFactor={8}
                    occlude={[sphereRef, cubeRef]}

                >
                    hello
                </Html>
            </mesh>
        </PivotControls>
        <mesh ref={cubeRef} position-x={2} scale={1.5}>
            <boxGeometry/>
            <meshStandardMaterial color="mediumpurple"/>
        </mesh>

        <TransformControls object={cubeRef}/>

        <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
            <planeGeometry/>
            <MeshReflectorMaterial resolution={512} color="greenyellow" mirror={0.5}/>
        </mesh>
        <Float
            speed={5}
        >
        <Text
            position-y={3}
            font={"./bangers-v20-latin-regular.woff"}
            fontSize={1}
            color={"black"}
        >Hello world</Text>

        </Float>

    </>;
}