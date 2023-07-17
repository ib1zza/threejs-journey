import * as THREE from 'three';

THREE.ColorManagement.legacyMode = false;

export const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

export const floor1material = new THREE.MeshStandardMaterial({
    color: "limegreen",
})

export const floor2material = new THREE.MeshStandardMaterial({
    color: "greenyellow",
})

export const obstacle1material = new THREE.MeshStandardMaterial({
    color: "orangered",
})

export const wallmaterial = new THREE.MeshStandardMaterial({
    color: "slategray",
})

//
// export const floor1material = new THREE.MeshStandardMaterial({ color: '#111111', metalness: 0, roughness: 0 })
// export const floor2material = new THREE.MeshStandardMaterial({ color: '#222222', metalness: 0, roughness: 0 })
// export const obstacle1material = new THREE.MeshStandardMaterial({ color: '#ff0000', metalness: 0, roughness: 1 })
// export const wallmaterial = new THREE.MeshStandardMaterial({ color: '#887777', metalness: 0, roughness: 0 })
