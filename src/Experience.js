import {useFrame} from '@react-three/fiber'
import {
    Environment,
    ContactShadows,
    OrbitControls,
    useHelper,
    BakeShadows,
    softShadows,
    RandomizedLight,
    Stage,
    AccumulativeShadows, Sky, Lightformer
} from '@react-three/drei'
import {useRef} from 'react'
import {Perf} from 'r3f-perf'
import * as THREE from 'three'
import {useControls} from "leva";

// softShadows({
//     frustum: 3.75,
//     size: 0.005,
//     near: 9.5,
//     samples: 17,
//     rings: 11,
// })


export default function Experience() {
    const cube = useRef()
    const directionalLight = useRef();

    useHelper(directionalLight, THREE.DirectionalLightHelper, 1)

    useFrame((state, delta) => {
        cube.current.rotation.y += delta * 0.2
    })

    // const { sunPosition } = useControls ('sky', {
    //     sunPosition: { value: [ 1, 2, 3] }
    // })


    const {opacity, color, blur} = useControls({
        opacity: {
            value: 0.4,
            step: 0.01,
            min: 0,
            max: 1,
        },
        color: "#1d8f75",
        blur: {
            value: 2.8,
            min: 0,
            max: 10,
        },
    });

    const {envMapIntensity, envMapHeight, envMapRadius, envMapScale} = useControls('environment map', {
        envMapIntensity: {value: 7, min: 0, max: 12},
        envMapHeight: {value: 7, min: 0, max: 100},
        envMapRadius: {value: 28, min: 10, max: 1000},
        envMapScale: {value: 100, min: 10, max: 1000}
    })


    return <>
        {/*<BakeShadows/>*/}
        <Perf position="top-left"/>

        <OrbitControls makeDefault/>


        {/*<Environment*/}
        {/*    files={"./environmentMaps/the_sky_is_on_fire_2k.hdr"}*/}
        {/*    ground={{*/}
        {/*        height: envMapHeight,*/}
        {/*        radius: envMapRadius,*/}
        {/*        scale: envMapScale,*/}
        {/*    }}*/}
        {/*    // preset={"night"}*/}
        {/*>*/}
        {/*<color args={["#000000"]} attach="background"/>*/}
        {/*<Lightformer position-z={-5} scale={10} color={"red"}/>*/}

        {/*<mesh position-z={-5} scale={10}>*/}
        {/*    <planeGeometry/>*/}
        {/*    <meshBasicMaterial color={"red"}/>*/}
        {/*</mesh>*/}
        {/*</Environment>*/}


        {/*<AccumulativeShadows position={[0, -0.99, 0]} color={"#136d39"} opacity={0.8} frames={1000} temporal>*/}
        {/*    <RandomizedLight*/}
        {/*        position={[1, 2, 3]}*/}
        {/*        amount={8}*/}
        {/*        radius={1}*/}
        {/*        ambient={0.5}*/}
        {/*        intensity={1}*/}
        {/*        bias={0.001}*/}
        {/*    />*/}
        {/*</AccumulativeShadows>*/}


        {/*<ContactShadows*/}
        {/*    position={[0, 0, 0]}*/}
        {/*    scale={10}*/}
        {/*    resolution={512}*/}
        {/*    far={5}*/}
        {/*    color={color}*/}
        {/*    opacity={opacity}*/}
        {/*    blur={blur}*/}
        {/*    frames={1}*/}
        {/*/>*/}


        {/*<directionalLight*/}
        {/*    castShadow*/}
        {/*    ref={directionalLight}*/}
        {/*    // position={[1, 2, 3]}*/}
        {/*    position={sunPosition}*/}
        {/*    intensity={1.5}*/}

        {/*    shadow-mapSize={[1024, 1024]}*/}
        {/*/>*/}
        {/*<ambientLight intensity={0.5}/>*/}

        {/*<Sky sunPosition={sunPosition}/>*/}

        {/*<mesh position-x={-2} position-y={1}>*/}
        {/*    <sphereGeometry/>*/}
        {/*    <meshStandardMaterial color="orange" envMapIntensity={envMapIntensity}/>*/}
        {/*</mesh>*/}

        {/*<mesh ref={cube} position-x={2} scale={1.5} position-y={1}>*/}
        {/*    <boxGeometry/>*/}
        {/*    <meshStandardMaterial color="mediumpurple" envMapIntensity={envMapIntensity}/>*/}
        {/*</mesh>*/}

        {/*<mesh position-y={0} rotation-x={-Math.PI * 0.5} scale={10}>*/}
        {/*    <planeGeometry/>*/}
        {/*    <meshStandardMaterial color="greenyellow" envMapIntensity={envMapIntensity}/>*/}
        {/*</mesh>*/}

        <Stage
            contactShadow={ {opacity: 0.2, blur: 3}}
            environment={"forest"}
        >
            <mesh position-x={-2} position-y={1}>
                <sphereGeometry/>
                <meshStandardMaterial color="orange" envMapIntensity={envMapIntensity}/>
            </mesh>

            <mesh ref={cube} position-x={2} scale={1.5} position-y={1}>
                <boxGeometry/>
                <meshStandardMaterial color="mediumpurple" envMapIntensity={envMapIntensity}/>
            </mesh>
        </Stage>
    </>
}