import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
// Registers the react-three-fiber JSX intrinsic elements (mesh, group, ...).
import type {} from "@react-three/fiber";
import { graniteTexture, groundTexture, plasterTexture, waterTexture } from "@/game/textures";

export const WALL_HALF = 38;
export const WALL_HEIGHT = 9;
export const PLAY_BOUND = 34.5;

const GATE_GAP = 5;

// Simple 2D collision shapes for the player controller (see Player.tsx).
// These aren't a physics engine — just enough to stop the player from
// walking through bastions, gate towers and the curtain walls.
export type Collider =
  | { type: "circle"; x: number; z: number; radius: number }
  | { type: "box"; x: number; z: number; halfW: number; halfD: number };

export const COLLIDERS: Collider[] = [
  // corner bastions + the mid-north bastion
  { type: "circle", x: -WALL_HALF, z: -WALL_HALF, radius: 7.2 },
  { type: "circle", x: WALL_HALF, z: -WALL_HALF, radius: 7.2 },
  { type: "circle", x: -WALL_HALF, z: WALL_HALF, radius: 7.2 },
  { type: "circle", x: WALL_HALF, z: WALL_HALF, radius: 7.2 },
  { type: "circle", x: 0, z: -WALL_HALF, radius: 7.2 },
  // gatehouse towers
  { type: "box", x: -6.5, z: WALL_HALF, halfW: 3.2, halfD: 3.2 },
  { type: "box", x: 6.5, z: WALL_HALF, halfW: 3.2, halfD: 3.2 },
  // curtain walls (a safety net behind PLAY_BOUND)
  { type: "box", x: 0, z: -WALL_HALF, halfW: WALL_HALF, halfD: 1.9 },
  { type: "box", x: WALL_HALF, z: 0, halfW: 1.9, halfD: WALL_HALF },
  { type: "box", x: -WALL_HALF, z: 0, halfW: 1.9, halfD: WALL_HALF },
  {
    type: "box",
    x: WALL_HALF / 2 + GATE_GAP / 2,
    z: WALL_HALF,
    halfW: (WALL_HALF - GATE_GAP) / 2,
    halfD: 1.9,
  },
  {
    type: "box",
    x: -(WALL_HALF / 2 + GATE_GAP / 2),
    z: WALL_HALF,
    halfW: (WALL_HALF - GATE_GAP) / 2,
    halfD: 1.9,
  },
];

const MERLON_GEOMETRY = new THREE.BoxGeometry(1.6, 1.4, 1.6);

function Merlons({
  count,
  spacing,
  axis,
  offset,
  material,
}: {
  count: number;
  spacing: number;
  axis: "x" | "z";
  offset: number;
  material: THREE.Material;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const matrices = useMemo(() => {
    const dummy = new THREE.Object3D();
    const out: THREE.Matrix4[] = [];
    for (let i = 0; i < count; i++) {
      const p = -((count - 1) * spacing) / 2 + i * spacing;
      dummy.position.set(axis === "x" ? p : offset, WALL_HEIGHT + 0.7, axis === "x" ? offset : p);
      dummy.updateMatrix();
      out.push(dummy.matrix.clone());
    }
    return out;
  }, [count, spacing, axis, offset]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
    mesh.instanceMatrix.needsUpdate = true;
  }, [matrices]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[MERLON_GEOMETRY, material, matrices.length]}
      castShadow
      receiveShadow
    />
  );
}

function YaliPillar({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.5, 1.5]} />
        <meshStandardMaterial color="#7d766a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.4, 0]} castShadow>
        <boxGeometry args={[0.85, 3.8, 0.85]} />
        <meshStandardMaterial color="#8b8477" roughness={0.85} />
      </mesh>
      {/* rearing yali guardian, carved from the same block */}
      <group position={[0, 1.5, 0.6]}>
        <mesh castShadow>
          <boxGeometry args={[0.55, 1.5, 0.5]} />
          <meshStandardMaterial color="#948b7c" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.95, 0.05]} castShadow>
          <sphereGeometry args={[0.34, 12, 12]} />
          <meshStandardMaterial color="#9c927f" roughness={0.75} />
        </mesh>
        <mesh position={[0, 0.9, 0.34]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <coneGeometry args={[0.19, 0.5, 10]} />
          <meshStandardMaterial color="#a3987f" roughness={0.75} />
        </mesh>
        <mesh position={[0.3, 0.35, 0.3]} rotation={[0, 0, -0.5]} castShadow>
          <boxGeometry args={[0.18, 0.7, 0.18]} />
          <meshStandardMaterial color="#948b7c" roughness={0.8} />
        </mesh>
        <mesh position={[-0.3, 0.35, 0.3]} rotation={[0, 0, 0.5]} castShadow>
          <boxGeometry args={[0.18, 0.7, 0.18]} />
          <meshStandardMaterial color="#948b7c" roughness={0.8} />
        </mesh>
      </group>
      <mesh position={[0, 4.5, 0]} castShadow>
        <boxGeometry args={[1.3, 0.45, 1.3]} />
        <meshStandardMaterial color="#7f7869" roughness={0.9} />
      </mesh>
      <mesh position={[0, 4.95, 0]} castShadow>
        <boxGeometry args={[1.9, 0.4, 1.9]} />
        <meshStandardMaterial color="#8a8273" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Gopuram({ position }: { position: [number, number, number] }) {
  const tiers = [0, 1, 2, 3, 4];
  return (
    <group position={position}>
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[10, 5, 5]} />
        <meshStandardMaterial color="#c9b68f" roughness={0.9} />
      </mesh>
      {tiers.map((t) => {
        const w = 9 - t * 1.35;
        const h = 1.7;
        return (
          <mesh key={t} position={[0, 5.6 + t * h, 0]} castShadow>
            <boxGeometry args={[w, h, w * 0.5]} />
            <meshStandardMaterial color={t % 2 ? "#c07a3d" : "#d8c39a"} roughness={0.85} />
          </mesh>
        );
      })}
      <mesh position={[0, 14.3, 0]} castShadow>
        <cylinderGeometry args={[0.1, 1.5, 1.6, 8]} />
        <meshStandardMaterial color="#b6862f" metalness={0.35} roughness={0.5} />
      </mesh>
      {/* gate opening */}
      <mesh position={[0, 1.9, 2.6]}>
        <boxGeometry args={[2.6, 3.8, 0.3]} />
        <meshStandardMaterial color="#2c2318" roughness={1} />
      </mesh>
    </group>
  );
}

function Bastion({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, WALL_HEIGHT / 2 + 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[6.4, 7.4, WALL_HEIGHT + 1, 24]} />
        <meshStandardMaterial color="#8a8377" roughness={0.95} />
      </mesh>
      <mesh position={[0, WALL_HEIGHT + 1.1, 0]} receiveShadow>
        <cylinderGeometry args={[6.6, 6.6, 0.4, 24]} />
        <meshStandardMaterial color="#948d80" roughness={0.9} />
      </mesh>
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 6.1, WALL_HEIGHT + 2, Math.sin(a) * 6.1]}
            rotation={[0, -a, 0]}
            castShadow
          >
            <boxGeometry args={[1.5, 1.4, 1.2]} />
            <meshStandardMaterial color="#7f786c" roughness={0.95} />
          </mesh>
        );
      })}
    </group>
  );
}

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.4, 3.2, 7]} />
        <meshStandardMaterial color="#5a4630" roughness={1} />
      </mesh>
      <mesh position={[0, 3.9, 0]} castShadow>
        <icosahedronGeometry args={[1.9, 0]} />
        <meshStandardMaterial color="#4e6b38" roughness={0.9} />
      </mesh>
      <mesh position={[0.9, 3.2, 0.4]} castShadow>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial color="#5c7a41" roughness={0.9} />
      </mesh>
    </group>
  );
}

export function Fort() {
  const granite = useMemo(() => graniteTexture(6), []);
  const graniteWall = useMemo(() => graniteTexture(10), []);
  const ground = useMemo(() => groundTexture(40), []);
  const water = useMemo(() => waterTexture(8), []);
  const plaster = useMemo(() => plasterTexture(4), []);

  const merlonMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ map: granite, roughness: 0.95 }),
    [granite],
  );

  const gateGap = GATE_GAP;

  return (
    <group>
      {/* plain */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial map={ground} color="#c8b487" roughness={1} />
      </mesh>

      {/* moat ring */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.06, 0]}>
        <ringGeometry args={[44, 56, 96]} />
        <meshStandardMaterial
          map={water}
          color="#7fae94"
          roughness={0.25}
          metalness={0.15}
          transparent
          opacity={0.96}
        />
      </mesh>
      {/* moat bank */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.03, 0]}>
        <ringGeometry args={[42, 58, 96]} />
        <meshStandardMaterial color="#8f7c55" roughness={1} />
      </mesh>
      {/* causeway to the gate */}
      <mesh position={[0, 0.2, 50]} receiveShadow>
        <boxGeometry args={[7, 0.5, 18]} />
        <meshStandardMaterial map={granite} color="#a09884" roughness={0.95} />
      </mesh>

      {/* inner court floor */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.05, 0]} receiveShadow>
        <planeGeometry args={[76, 76]} />
        <meshStandardMaterial map={ground} color="#bfae86" roughness={1} />
      </mesh>

      {/* curtain walls */}
      {(["north", "east", "west"] as const).map((side) => {
        const isX = side === "north";
        return (
          <mesh
            key={side}
            position={[
              side === "east" ? WALL_HALF : side === "west" ? -WALL_HALF : 0,
              WALL_HEIGHT / 2,
              isX ? -WALL_HALF : 0,
            ]}
            castShadow
            receiveShadow
          >
            <boxGeometry
              args={isX ? [WALL_HALF * 2, WALL_HEIGHT, 3.4] : [3.4, WALL_HEIGHT, WALL_HALF * 2]}
            />
            <meshStandardMaterial map={graniteWall} color="#9a9184" roughness={0.95} />
          </mesh>
        );
      })}
      {/* south wall, split for the bent gate */}
      {[-1, 1].map((dir) => (
        <mesh
          key={dir}
          position={[dir * (WALL_HALF / 2 + gateGap / 2), WALL_HEIGHT / 2, WALL_HALF]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[WALL_HALF - gateGap, WALL_HEIGHT, 3.4]} />
          <meshStandardMaterial map={graniteWall} color="#9a9184" roughness={0.95} />
        </mesh>
      ))}

      <Merlons count={40} spacing={1.9} axis="x" offset={-WALL_HALF} material={merlonMaterial} />
      <Merlons count={40} spacing={1.9} axis="z" offset={WALL_HALF} material={merlonMaterial} />
      <Merlons count={40} spacing={1.9} axis="z" offset={-WALL_HALF} material={merlonMaterial} />

      <Bastion x={-WALL_HALF} z={-WALL_HALF} />
      <Bastion x={WALL_HALF} z={-WALL_HALF} />
      <Bastion x={-WALL_HALF} z={WALL_HALF} />
      <Bastion x={WALL_HALF} z={WALL_HALF} />
      <Bastion x={0} z={-WALL_HALF} />

      {/* gatehouse: two towers, an arch, and a bent inner passage */}
      <group position={[0, 0, WALL_HALF]}>
        {[-6.5, 6.5].map((x) => (
          <mesh key={x} position={[x, 6, 0]} castShadow receiveShadow>
            <boxGeometry args={[6, 12, 6]} />
            <meshStandardMaterial map={granite} color="#948b7d" roughness={0.95} />
          </mesh>
        ))}
        <mesh position={[0, 10.5, 0]} castShadow>
          <boxGeometry args={[13, 3, 5]} />
          <meshStandardMaterial map={granite} color="#8f8678" roughness={0.95} />
        </mesh>
        <mesh position={[0, 4.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[2.6, 2.6, 5.2, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#3a2f21" roughness={1} side={THREE.DoubleSide} />
        </mesh>
        {/* inner turn: the passage does not run straight */}
        <mesh position={[4.5, 3, -6]} castShadow receiveShadow>
          <boxGeometry args={[12, 6, 2.6]} />
          <meshStandardMaterial map={granite} color="#8d8477" roughness={0.95} />
        </mesh>
      </group>

      {/* Jalakanteswarar temple complex */}
      <group position={[2, 0, -22]}>
        <mesh position={[0, 0.4, 0]} receiveShadow>
          <boxGeometry args={[34, 0.8, 26]} />
          <meshStandardMaterial map={granite} color="#a89c80" roughness={0.95} />
        </mesh>
        <Gopuram position={[0, 0.8, 11]} />
        {/* pillared mandapa */}
        <group position={[0, 0.8, -3]}>
          {Array.from({ length: 5 }).map((_, i) =>
            Array.from({ length: 4 }).map((__, j) => (
              <YaliPillar key={`${i}-${j}`} position={[-12 + i * 6, 0, -6 + j * 4.2]} />
            )),
          )}
          <mesh position={[0, 5.6, -0.9]} castShadow receiveShadow>
            <boxGeometry args={[28, 0.8, 18]} />
            <meshStandardMaterial map={granite} color="#9d9480" roughness={0.95} />
          </mesh>
          {/* sanctum */}
          <mesh position={[0, 3.6, -9.5]} castShadow receiveShadow>
            <boxGeometry args={[9, 7.2, 7]} />
            <meshStandardMaterial map={plaster} color="#cfbc95" roughness={0.9} />
          </mesh>
          <mesh position={[0, 8.4, -9.5]} castShadow>
            <coneGeometry args={[5.2, 4.2, 4]} />
            <meshStandardMaterial color="#b9793a" roughness={0.85} />
          </mesh>
        </group>
      </group>

      {/* palace block, west */}
      <group position={[-26, 0, 4]}>
        <mesh position={[0, 3.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[14, 6.4, 18]} />
          <meshStandardMaterial map={plaster} color="#d3c19b" roughness={0.9} />
        </mesh>
        <mesh position={[0, 6.9, 0]} castShadow>
          <boxGeometry args={[15.4, 1, 19.4]} />
          <meshStandardMaterial color="#a8703a" roughness={0.9} />
        </mesh>
        {[-5, 0, 5].map((z) => (
          <mesh key={z} position={[7.1, 2.6, z]}>
            <boxGeometry args={[0.3, 3.2, 1.8]} />
            <meshStandardMaterial color="#4a3a24" roughness={1} />
          </mesh>
        ))}
      </group>

      {/* armoury and drill yard, east */}
      <group position={[24, 0, 12]}>
        <mesh position={[0, 2.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[11, 5.2, 12]} />
          <meshStandardMaterial map={plaster} color="#c6b391" roughness={0.9} />
        </mesh>
        <mesh position={[0, 5.7, 0]} castShadow>
          <boxGeometry args={[12.4, 1, 13.4]} />
          <meshStandardMaterial color="#8f6533" roughness={0.9} />
        </mesh>
      </group>
      <mesh rotation-x={-Math.PI / 2} position={[24, 0.08, 24]} receiveShadow>
        <circleGeometry args={[8, 32]} />
        <meshStandardMaterial color="#b09a68" roughness={1} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[21 + i * 2.4, 1.3, 22]} castShadow>
          <cylinderGeometry args={[0.35, 0.4, 2.6, 8]} />
          <meshStandardMaterial color="#6b5334" roughness={1} />
        </mesh>
      ))}

      {/* flags on the gate towers */}
      {[-6.5, 6.5].map((x) => (
        <group key={x} position={[x, 12, WALL_HALF]}>
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 4, 6]} />
            <meshStandardMaterial color="#5c4a2e" />
          </mesh>
          <mesh position={[0.9, 3.4, 0]}>
            <planeGeometry args={[1.8, 1.1]} />
            <meshStandardMaterial color="#b8483a" side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}

      <Tree position={[-14, 0, 14]} />
      <Tree position={[16, 0, -6]} scale={1.2} />
      <Tree position={[-6, 0, 28]} scale={0.9} />
      <Tree position={[30, 0, -22]} />
      <Tree position={[-30, 0, -14]} scale={1.1} />
      <Tree position={[-64, 0, 30]} scale={1.3} />
      <Tree position={[68, 0, 18]} scale={1.2} />
    </group>
  );
}