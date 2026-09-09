import { Environment, Lightformer, Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, type MutableRefObject } from "react";
import { Fort } from "./Fort";
import { Marker } from "./Marker";
import { NpcFigure } from "./NpcFigure";
import { Player } from "./Player";
import { NPCS } from "@/game/content";
import { INTERACTIONS } from "@/game/interactions";
import type { KeyMap } from "@/game/useKeyboard";

interface Props {
  keys: MutableRefObject<KeyMap>;
  level: 1 | 2 | 3;
  tasks: Record<string, boolean>;
  nearId: string | null;
  onNear: (id: string | null) => void;
  cloth: string;
  sash: string;
  frozen: boolean;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function GameCanvas({
  keys,
  level,
  tasks,
  nearId,
  onNear,
  cloth,
  sash,
  frozen,
}: Props) {
  const yaw = useRef(0);
  const pitch = useRef(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);

  const activeLevel = level === 1 ? 1 : 2;
  const points = INTERACTIONS.filter((p) => p.level === activeLevel);
  const siegeLight = level >= 2;

  return (
    <div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      onPointerDown={(e) => {
        dragging.current = true;
        lastX.current = e.clientX;
        lastY.current = e.clientY;
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerLeave={() => {
        dragging.current = false;
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        yaw.current += (e.clientX - lastX.current) * 0.005;
        pitch.current = clamp(pitch.current - (e.clientY - lastY.current) * 0.004, -0.15, 1.1);
        lastX.current = e.clientX;
        lastY.current = e.clientY;
      }}
    >
      <Canvas
        shadows
        dpr={[1, 1.6]}
        camera={{ position: [0, 8, 34], fov: 58 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={[siegeLight ? "#3a2a22" : "#cbb98d"]} />
        <fog attach="fog" args={[siegeLight ? "#4a3226" : "#d6c69c", 55, 165]} />
        <Sky
          sunPosition={siegeLight ? [-40, 4, -60] : [60, 26, 40]}
          turbidity={siegeLight ? 14 : 6}
          rayleigh={siegeLight ? 5 : 2}
          inclination={0.5}
          azimuth={0.25}
        />
        <hemisphereLight
          args={[siegeLight ? "#6b4a34" : "#cfe0ff", siegeLight ? "#2b2018" : "#8a7346", 0.7]}
        />
        <ambientLight intensity={siegeLight ? 0.35 : 0.45} />
        <directionalLight
          position={siegeLight ? [-30, 26, -34] : [42, 40, 28]}
          intensity={siegeLight ? 1.5 : 2.4}
          color={siegeLight ? "#f0a25a" : "#ffe6b8"}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-70}
          shadow-camera-right={70}
          shadow-camera-top={70}
          shadow-camera-bottom={-70}
          shadow-bias={-0.0005}
        />
        <Suspense fallback={null}>
          <Environment resolution={128}>
            <Lightformer
              intensity={siegeLight ? 1.2 : 2.2}
              color={siegeLight ? "#ffb066" : "#fff2d4"}
              position={[0, 12, 0]}
              scale={[24, 24, 1]}
              rotation-x={Math.PI / 2}
            />
            <Lightformer
              intensity={0.9}
              color={siegeLight ? "#6a4630" : "#9fc6ff"}
              position={[-16, 4, -6]}
              rotation-y={Math.PI / 2}
              scale={[30, 6, 1]}
            />
            <Lightformer
              intensity={0.7}
              color="#d9c08a"
              position={[16, 3, 8]}
              rotation-y={-Math.PI / 2}
              scale={[30, 5, 1]}
            />
          </Environment>

          <Fort />

          {activeLevel === 1 &&
            NPCS.map((npc) => (
              <NpcFigure
                key={npc.id}
                position={npc.position}
                cloth={npc.cloth}
                name={npc.name}
                role={npc.role}
                done={Boolean(tasks[npc.id])}
                active={nearId === `npc:${npc.id}`}
              />
            ))}

          {points
            .filter((p) => p.id.startsWith("task:"))
            .map((p) => (
              <Marker
                key={p.id}
                position={p.position}
                label={p.label}
                hint={p.hint}
                done={Boolean(tasks[p.id.replace("task:", "")])}
                active={nearId === p.id}
              />
            ))}

          <Player
            keys={keys}
            yaw={yaw}
            pitch={pitch}
            points={points}
            onNear={onNear}
            cloth={cloth}
            sash={sash}
            frozen={frozen}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}