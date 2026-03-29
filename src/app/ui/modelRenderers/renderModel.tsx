"use client";

import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";
import { OrbitControls } from "@react-three/drei";

interface ModelProps {
	path: string;
}

function Box({ path }: { path: string }) {
	const meshRef = useRef<Mesh>(null!);
	const { scene } = useGLTF(path);

	return (
		<mesh receiveShadow ref={meshRef} scale={25}>
			<primitive object={scene}></primitive>
		</mesh>
	);
}

export default function Model({ path }: ModelProps) {
	return (
		<div className="w-400px h-400px">
			<Canvas
				camera={{ position: [4, 2, 4] }}
				style={{ borderRadius: 12, width: "400px", height: "280px" }}
			>
				<ambientLight intensity={0.7} />
				<directionalLight
					position={[2, 5, 2]}
					intensity={1.5}
					color="#ffffff"
				/>
				<directionalLight
					position={[-2, -5, -2]}
					intensity={0.7}
					color="#b0b0b0"
				/>
				<Box path={path} />
				<OrbitControls
					enableZoom={true}
					dampingFactor={0.2}
					enableDamping={true}
				/>
			</Canvas>
		</div>
	);
}
