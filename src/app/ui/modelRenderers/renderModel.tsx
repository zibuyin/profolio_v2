"use client";

import { useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Component, type ErrorInfo, type ReactNode, Suspense } from "react";
import { OrbitControls } from "@react-three/drei";

interface ModelProps {
	path: string;
}

interface ModelErrorBoundaryProps {
	children: ReactNode;
	modelPath: string;
}

interface ModelErrorBoundaryState {
	hasError: boolean;
}

class ModelErrorBoundary extends Component<
	ModelErrorBoundaryProps,
	ModelErrorBoundaryState
> {
	state: ModelErrorBoundaryState = { hasError: false };

	static getDerivedStateFromError(): ModelErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
		console.error(
			"Error loading GLTF model:",
			this.props.modelPath,
			error,
			errorInfo,
		);
	}

	render() {
		if (this.state.hasError) {
			return <ModelFallback />;
		}

		return this.props.children;
	}
}

function ModelFallback() {
	return (
		<mesh scale={0.7}>
			<boxGeometry args={[1.6, 1.6, 1.6]} />
			<meshStandardMaterial color="#cbd5e1" wireframe />
		</mesh>
	);
}

function LoadedModel({ path }: { path: string }) {
	const { scene } = useGLTF(path);

	return <primitive object={scene} scale={25} />;
}

export default function Model({ path }: ModelProps) {
	return (
		<div className="w-400px h-400px">
			<Canvas
				camera={{ position: [4, 1, 4] }}
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
				<ModelErrorBoundary modelPath={path}>
					<Suspense fallback={<ModelFallback />}>
						<LoadedModel path={path} />
					</Suspense>
				</ModelErrorBoundary>
				<OrbitControls
					autoRotate={true}
					autoRotateSpeed={0.6}
					enableZoom={true}
					dampingFactor={0.2}
					enableDamping={true}
				/>
			</Canvas>
		</div>
	);
}
