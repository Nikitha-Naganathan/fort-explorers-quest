import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface Props {
  position: [number, number, number];
  cloth: string;
  name: string;
  role: string;
  done: boolean;
  active: boolean;
}

export function NpcFigure({ position, cloth, name, role, done, active }: Props) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.5;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.04;
    }
  });

  return (
    <group position={position}>
      <group ref={group}>
        <mesh position={[0, 0.55, 0]} castShadow>
          <coneGeometry args={[0.55, 1.1, 10]} />
          <meshStandardMaterial color={cloth} roughness={0.85} />
        </mesh>
        <mesh position={[0, 1.35, 0]} castShadow>
          <capsuleGeometry args={[0.35, 0.68, 6, 12]} />
          <meshStandardMaterial color={cloth} roughness={0.85} />
        </mesh>
        <mesh position={[0, 2.02, 0]} castShadow>
          <sphereGeometry args={[0.26, 16, 16]} />
          <meshStandardMaterial color="#87603e" roughness={0.7} />
        </mesh>
        <mesh position={[0, 2.24, 0]} castShadow>
          <sphereGeometry args={[0.29, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#efe6d0" roughness={0.8} />
        </mesh>
      </group>
      <Html center distanceFactor={22} position={[0, 3.1, 0]} zIndexRange={[5, 0]}>
        <div
          className={`pointer-events-none whitespace-nowrap rounded-sm border px-2 py-1 text-center text-[11px] leading-tight ${
            active
              ? "border-gold/70 bg-ink/80 text-parchment"
              : "border-border/60 bg-ink/55 text-parchment/70"
          }`}
        >
          <span className="font-semibold">{name}</span>
          <span className="block opacity-70">{done ? "spoken with" : role}</span>
        </div>
      </Html>
    </group>
  );
}
