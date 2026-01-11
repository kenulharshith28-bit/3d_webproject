import React, {useEffect} from 'react'
import {useGLTF, useTexture} from '@react-three/drei'
import useMacbookStore from "../../store";
import {noChangeParts} from "../../constants/index.js";
import {Color, SRGBColorSpace} from 'three'

export default function MacbookModel14(props) {
  const { color } = useMacbookStore();
  const { scene } = useGLTF('/models/macbook-14-transformed.glb');

  const texture = useTexture('/screen.png');
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;

  useEffect(() => {
    scene.traverse((child) => {
        if(child.isMesh) {
            if(child.name === "Object_123") {
              if(!child.material.userData.screenMaterial) {
                child.material = child.material.clone();
                child.material.map = texture;
                child.material.userData.screenMaterial = true;
                child.material.needsUpdate = true;
              }
              return;
            }

            if(!noChangeParts.includes(child.name)) {
              if(!child.material.userData.cloned) {
                child.material = child.material.clone();
                child.material.userData.cloned = true;
              }
              child.material.color = new Color(color);
            }
        }
    })
  }, [color, scene, texture])

  return (
    <group {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/models/macbook-14-transformed.glb')
