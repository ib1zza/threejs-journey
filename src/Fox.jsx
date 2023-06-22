import React, {useEffect} from 'react';
import {useAnimations, useGLTF} from "@react-three/drei";
import {useControls} from "leva";

const Fox = (props) => {
    const fox = useGLTF("/Fox/glTF-Binary/Fox.glb");
    const animations = useAnimations(fox.animations, fox.scene);

    const {animationName} = useControls('fox', {
            animationName: {
                options: animations.names
            }
        }
    )
    useEffect(() => {
        const animation = animations.actions[animationName];
        animation.reset().fadeIn(0.5).play();

        return () => {
            animation.fadeOut(0.5);
        }
        
    }, [animationName]);


    return (
        <primitive {...props} object={fox.scene}/>
    );
};

export default Fox;