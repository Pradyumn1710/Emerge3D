// /*
//   Auto-generated by Spline
// */

// import useSpline from '@splinetool/r3f-spline'
// import { OrthographicCamera } from '@react-three/drei'

// export default function Scene({ ...props }) {
//   const { nodes, materials } = useSpline('https://prod.spline.design/7PUiaFEw5XZbxYNM/scene.splinecode')
//   return (
//     <>
//       <color attach="background" args={['#000000']} />
//       <group {...props} dispose={null}>
//         <scene name="Scene">
//           <group name="Donut" position={[0, 3.03, 0]} scale={1.5}>
//             <mesh
//               name="Outside"
//               geometry={nodes.Outside.geometry}
//               material={materials['Outside Material']}
//               castShadow
//               receiveShadow
//               position={[2.14, -2.14, 0]}
//               rotation={[0, 0, Math.PI / 4]}
//             />
//             <mesh
//               name="inside"
//               geometry={nodes.inside.geometry}
//               material={materials['']}
//               castShadow
//               receiveShadow
//               position={[2.14, -2.14, 0]}
//               rotation={[0, 0, Math.PI / 4]}
//             />
//           </group>
//           <OrthographicCamera name="1" makeDefault={true} far={10000} near={-50000} />
//           <hemisphereLight name="Default Ambient Light" intensity={0.75} color="#eaeaea" />
//         </scene>
//       </group>
//     </>
//   )
// }
