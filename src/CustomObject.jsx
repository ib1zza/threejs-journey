import {useEffect, useMemo, useRef} from "react";

const CustomObject = () => {
    const verticesCount = 10 * 3;
    const bufferGeometryRef = useRef();


    const positions = useMemo(() => {
        const pos= new Float32Array(verticesCount * 3);
        for (let i = 0; i < verticesCount; i++) {
            pos[i * 3 + 0] = (Math.random() - 0.5) * 3;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 3;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 3;
        }
        return pos;
    }, []);


    useEffect( () => {
        bufferGeometryRef.current.computeVertexNormals();
    }, []);

    return (
        <mesh>
            <bufferGeometry ref={bufferGeometryRef}>
                <bufferAttribute
                    attach={"attributes-position"}
                    count={verticesCount}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <meshBasicMaterial color="red" />
        </mesh>
    );
};

export default CustomObject;