import { useFrame } from "@react-three/fiber";
import { useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { COLLIDERS, PLAY_BOUND } from "./Fort";
import type { InteractionPoint } from "@/game/interactions";
import type { KeyMap } from "@/game/useKeyboard";

interface PlayerProps {
  keys: MutableRefObject<KeyMap>;
  yaw: MutableRefObject<number>;
  pitch: MutableRefObject<number>;
  points: InteractionPoint[];
  onNear: (id: string | null) => void;
  cloth: string;
  sash: string;
  frozen: boolean;
}

const WALK = 6.2;
const SPRINT = 11;
const PLAYER_RADIUS = 0.55;

/** Pushes `pos` out of any collider it's overlapping. Cheap and approximate
 * on purpose — this only needs to stop the player from walking through
 * bastions, gate towers and the curtain walls, not simulate physics. */
function resolveCollisions(pos: THREE.Vector3) {
  for (const c of COLLIDERS) {
    if (c.type === "circle") {
      const dx = pos.x - c.x;
      const dz = pos.z - c.z;
      const dist = Math.hypot(dx, dz);
      const minDist = c.radius + PLAYER_RADIUS;
      if (dist < minDist) {
        if (dist < 1e-4) {
          pos.x += minDist;
        } else {
          const push = minDist - dist;
          pos.x += (dx / dist) * push;
          pos.z += (dz / dist) * push;
        }
      }
    } else {
      const halfW = c.halfW + PLAYER_RADIUS;
      const halfD = c.halfD + PLAYER_RADIUS;
      const dx = pos.x - c.x;
      const dz = pos.z - c.z;
      if (Math.abs(dx) < halfW && Math.abs(dz) < halfD) {
        const penX = halfW - Math.abs(dx);
        const penZ = halfD - Math.abs(dz);
        if (penX < penZ) {
          pos.x += Math.sign(dx || 1) * penX;
        } else {
          pos.z += Math.sign(dz || 1) * penZ;
        }
      }
    }
  }
}

export function Player({ keys, yaw, pitch, points, onNear, cloth, sash, frozen }: PlayerProps) {
  const body = useRef<THREE.Group>(null);
  const pos = useRef(new THREE.Vector3(0, 0, 24));
  const vel = useRef(new THREE.Vector3());
  const facing = useRef(Math.PI);
  const bob = useRef(0);
  const nearId = useRef<string | null>(null);
  const camTarget = useRef(new THREE.Vector3());

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const k = keys.current;

    const forward = (k["KeyW"] ? 1 : 0) - (k["KeyS"] ? 1 : 0);
    const strafe = (k["KeyD"] ? 1 : 0) - (k["KeyA"] ? 1 : 0);
    if (k["ArrowLeft"]) yaw.current += dt * 1.9;
    if (k["ArrowRight"]) yaw.current -= dt * 1.9;

    const wish = new THREE.Vector3();
    if (!frozen && (forward !== 0 || strafe !== 0)) {
      // camera-relative: W always goes where the camera looks
      const sin = Math.sin(yaw.current);
      const cos = Math.cos(yaw.current);
      wish.set(strafe * cos - forward * sin, 0, -strafe * sin - forward * cos).normalize();
      const speed = k["ShiftLeft"] || k["ShiftRight"] ? SPRINT : WALK;
      wish.multiplyScalar(speed);
      facing.current = Math.atan2(wish.x, wish.z);
      bob.current += dt * (speed > WALK ? 14 : 9);
    }

    // frame-rate independent damping toward the wished velocity
    const blend = 1 - Math.exp(-12 * dt);
    vel.current.lerp(wish, blend);
    pos.current.addScaledVector(vel.current, dt);

    resolveCollisions(pos.current);

    pos.current.x = THREE.MathUtils.clamp(pos.current.x, -PLAY_BOUND, PLAY_BOUND);
    pos.current.z = THREE.MathUtils.clamp(pos.current.z, -PLAY_BOUND, PLAY_BOUND);

    if (body.current) {
      const idle = Math.sin(state.clock.elapsedTime * 1.6) * 0.03;
      body.current.position.set(
        pos.current.x,
        Math.abs(Math.sin(bob.current)) * 0.12 + idle,
        pos.current.z,
      );
      const cur = body.current.rotation.y;
      let diff = facing.current - cur;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      body.current.rotation.y = cur + diff * (1 - Math.exp(-14 * dt));
    }

    // chase camera — yaw orbits left/right, pitch tilts the camera up/down
    const dist = 11;
    const p = THREE.MathUtils.clamp(pitch.current, -0.15, 1.1);
    const horiz = dist * Math.cos(p);
    const height = 3 + dist * Math.sin(p) * 1.6 + 3.4;
    camTarget.current.set(
      pos.current.x + Math.sin(yaw.current) * horiz,
      Math.max(2.2, height),
      pos.current.z + Math.cos(yaw.current) * horiz,
    );
    state.camera.position.lerp(camTarget.current, 1 - Math.exp(-6 * dt));
    state.camera.lookAt(pos.current.x, 1.8, pos.current.z);

    // nearest interaction
    let found: string | null = null;
    let best = Infinity;
    for (const p of points) {
      const d = (p.position[0] - pos.current.x) ** 2 + (p.position[2] - pos.current.z) ** 2;
      if (d < p.radius ** 2 && d < best) {
        best = d;
        found = p.id;
      }
    }
    if (found !== nearId.current) {
      nearId.current = found;
      onNear(found);
    }
  });

  return (
    <group ref={body} position={[0, 0, 24]}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <coneGeometry args={[0.55, 1.1, 10]} />
        <meshStandardMaterial color={cloth} roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.35, 0]} castShadow>
        <capsuleGeometry args={[0.36, 0.7, 6, 12]} />
        <meshStandardMaterial color={cloth} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.5, 0]} rotation={[0, 0, 0.5]} castShadow>
        <torusGeometry args={[0.4, 0.07, 8, 18]} />
        <meshStandardMaterial color={sash} roughness={0.7} />
      </mesh>
      <mesh position={[0, 2.05, 0]} castShadow>
        <sphereGeometry args={[0.27, 16, 16]} />
        <meshStandardMaterial color="#8a5f3c" roughness={0.7} />
      </mesh>
      <mesh position={[0, 2.28, 0]} castShadow>
        <sphereGeometry args={[0.3, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={sash} roughness={0.75} />
      </mesh>
      {/* slung sword */}
      <mesh position={[0.42, 1.1, -0.1]} rotation={[0.2, 0, -0.5]} castShadow>
        <boxGeometry args={[0.07, 1.2, 0.16]} />
        <meshStandardMaterial color="#b9b3a4" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}