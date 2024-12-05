'use client'

import { useEffect, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface ThreeDRendererProps {
  plyFile: string
}

function PointCloud({ plyFile }: ThreeDRendererProps) {
  const { scene } = useThree()
  const [pointsMesh, setPointsMesh] = useState<THREE.Points | null>(null)

  useEffect(() => {
    const loader = new PLYLoader()
    loader.load(plyFile, (geometry) => {
      // Compute vertex normals for correct lighting
      geometry.computeVertexNormals()

      // Adjust the orientation to face the camera correctly
      geometry.rotateX(-Math.PI / 2) // Rotate -90 degrees on the X-axis to face upwards
      geometry.rotateZ(Math.PI)      // Rotate 180 degrees on the Z-axis to face towards the camera

      // Create a material for the point cloud
      const material = new THREE.PointsMaterial({
        size: 0.01,  // Adjust point size as needed
        vertexColors: true
      })
      const points = new THREE.Points(geometry, material)

      // Add the point cloud to the scene
      scene.add(points)
      setPointsMesh(points)
    })
  }, [plyFile, scene])

  return null
}

export default function ThreeDRenderer({ plyFile }: ThreeDRendererProps) {
  return (
    <div className="w-full h-96 bg-gray-800 rounded-lg mt-8">
      <Canvas camera={{ position: [0, 0, 5], up: [0, 0, 1] }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <PointCloud plyFile={plyFile} />
        <OrbitControls />
      </Canvas>
    </div>
  )
}
