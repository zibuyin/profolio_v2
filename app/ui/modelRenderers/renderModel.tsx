"use client";

import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";

interface ModelProps {
	path: string;
}

function Box({ path }: { path: string }) {
	const meshRef = useRef<Mesh>(null!);
	const { scene } = useGLTF(path);

	useFrame(() => {
		meshRef.current.rotation.y += 0.005;
	});

	return (
		<mesh receiveShadow ref={meshRef} scale={25}>
			<primitive object={scene}></primitive>
		</mesh>
	);
}

export default function Model({ path }: ModelProps) {
	return (
		<div className="w-200px h-300px">
			<Canvas
				camera={{ position: [0, 1, 5] }}
				style={{ borderRadius: 12, width: "100%", height: "300px" }}
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
			</Canvas>
		</div>
	);
}
