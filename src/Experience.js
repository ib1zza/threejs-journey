import {OrbitControls, Text3D, Center, useMatcapTexture} from '@react-three/drei'
import {Perf} from 'r3f-perf'
import * as THREE from 'three'
import {useEffect, useRef} from "react";
import {useFrame} from "@react-three/fiber";


const torusGeometry = new THREE.TorusGeometry(1, 0.6, 16, 32)
const material = new THREE.MeshMatcapMaterial()

export default function Experience() {
    const [matCapTexture] = useMatcapTexture('7B5254_E9DCC7_B19986_C8AC91', 256)
    console.log(matCapTexture)
    // const donutsGroup = useRef();

    const donuts = useRef([]);

    useEffect(() => {
        // matCapTexture.encoding = THREE.sRGBEncoding;
        // matCapTexture.needsUpdate = true;

        material.matcap = matCapTexture;
        material.needsUpdate = true;
    }, [])

    useFrame((state, delta) => {
        donuts.current.forEach((donut) => {
            donut.rotation.y += 0.2 * delta;
        })
    })

    return <>

        <Perf position="top-left"/>

        <OrbitControls makeDefault/>

        <Center>
            <Text3D
                material={material}
                font={"./fonts/helvetiker_regular.typeface.json"}
                size={0.75}
                height={0.2}
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.02}
                bevelsize={0.02}
                bevelOffset={0}
                bevelSegments={5}
            >
                Hello R3F
                <meshMatcapMaterial matcap={matCapTexture}/>
            </Text3D>
        </Center>
        {[...Array(100)].map((_, i) => (
            <mesh ref={(element) => donuts.current[i] = element} material={material} geometry={torusGeometry} key={i}
                  position={
                      [
                          (Math.random() - 0.5) * 10,
                          (Math.random() - 0.5) * 10,
                          (Math.random() - 0.5) * 10
                      ]
                  }
                  rotation={
                      [
                          Math.random() * Math.PI,
                          Math.random() * Math.PI,
                          0
                      ]
                  }
                  scale={0.2 + Math.random() * 0.2}>
            </mesh>
        ))}

    </>
}