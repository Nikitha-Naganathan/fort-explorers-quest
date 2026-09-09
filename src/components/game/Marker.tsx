import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface Props {
  position: [number, number, number];
  label: string;
  hint: string;
  done: boolean;
  active: boolean;
}

export function Marker({ position, label, hint, done, active }: Props) {
  const ring = useRef<THREE.Mesh>(null);
  const pip = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring.current) {
      const s = 1 + Math.sin(t * 1.8) * 0.06;
      ring.current.scale.setScalar(s);
    }
    if (pip.current) pip.current.position.y = 2.2 + Math.sin(t * 2) * 0.18;
  });

  return (
    <group position={position}>
      <mesh ref={ring} rotation-x={-Math.PI / 2} position={[0, 0.12, 0]}>
        <ringGeometry args={[1.5, 2.1, 40]} />
        <meshBasicMaterial
          color={done ? "#6f8f6a" : "#d9a53f"}
          transparent
          opacity={done ? 0.4 : 0.75}
        />
      </mesh>
      <mesh ref={pip} position={[0, 2.2, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.3, 0.8, 4]} />
        <meshStandardMaterial
          color={done ? "#7c9a76" : "#e8bc57"}
          emissive={done ? "#2c3a29" : "#7a5a15"}
          roughness={0.4}
        />
      </mesh>
      <Html center distanceFactor={24} position={[0, 3.2, 0]} zIndexRange={[5, 0]}>
        <div
          className={`pointer-events-none whitespace-nowrap rounded-sm border px-2 py-1 text-center text-[11px] leading-tight ${
            active ? "border-gold/70 bg-ink/80 text-parchment" : "border-border/60 bg-ink/50 text-parchment/70"
          }`}
        >
          <span className="font-semibold">{label}</span>
          <span className="block opacity-70">{done ? "completed" : hint}</span>
        </div>
      </Html>
    </group>
  );
}
