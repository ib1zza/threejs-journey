import './style.css'
import ReactDOM from 'react-dom/client'
import {Canvas} from '@react-three/fiber'
import Experience from './Experience.js'
import {Leva} from 'leva'
import {Perf} from "r3f-perf";

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <>
        <Leva/>
        <Canvas
            camera={{
                fov: 45,
                near: 0.1,
                far: 200,
                position: [-4, 3, 6]
            }}
        >
            <Perf position={"top-left"}/>
            <Experience/>
        </Canvas>
    </>
)