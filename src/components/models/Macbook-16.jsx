import React, { useEffect } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import { Color, MeshBasicMaterial, SRGBColorSpace } from 'three'
import useMacbookStore  from '../../store'
import { noChangeParts } from '../../constants'

export default function MacbookModel16(props) {
    const { color } = useMacbookStore();
  const { scene } = useGLTF('/models/macbook-16-transformed.glb');

  const texture = useTexture('/screen.png');
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;

  useEffect(() => {
    scene.traverse((child) => {
        if(child.isMesh) {
            if(child.name === "Object_123") {
                if(!child.material.userData.screenMaterial) {
                    child.material = new MeshBasicMaterial({ map: texture });
                    child.material.userData.screenMaterial = true;
                } else {
                    child.material.map = texture;
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

useGLTF.preload('/models/macbook-16-transformed.glb')
