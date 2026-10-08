import { type CSSProperties, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import type { JourneyNode } from './journey-data';

export interface JourneyLink {
  source: string | JourneyNode;
  target: string | JourneyNode;
}

interface JourneyGraphProps {
  nodes: JourneyNode[];
  links: JourneyLink[];
  selectedId: string;
  hoveredId: string | null;
  exitingIds?: Set<string>;
  resetViewToken?: number;
  isPaused?: boolean;
  zoomToken?: { action: 'in' | 'out' | null; ts: number };
  onSelect: (node: JourneyNode) => void;
  onHover: (node: JourneyNode | null) => void;
}

const palette = {
  0: { core: '#FFE8D6', glow: '#FF8C42', radius: 8 },
  1: { core: '#FFD9B3', glow: '#E8722C', radius: 5.2 },
  2: { core: '#F5C08A', glow: '#C25A1E', radius: 3.4 },
  3: { core: '#E0A868', glow: '#9C4A18', radius: 2.4 },
} as const;

const DEFAULT_CAMERA_DISTANCE = 300;
const DEFAULT_CAMERA_DURATION = 0;

const endpointId = (endpoint: string | JourneyNode): string =>
  typeof endpoint === 'string' ? endpoint : endpoint.id;

const supportsWebGL = () => {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl'),
    );
  } catch {
    return false;
  }
};

const lineage = (node: JourneyNode | null, nodes: JourneyNode[]): Set<string> => {
  const ids = new Set<string>();
  if (!node) return ids;
  let cursor: JourneyNode | undefined = node;
  while (cursor) {
    ids.add(cursor.id);
    cursor = nodes.find((candidate) => candidate.id === cursor?.parentId);
  }
  nodes.filter((candidate) => candidate.parentId === node.id).forEach((candidate) => ids.add(candidate.id));
  return ids;
};

const fallbackPosition = (
  node: JourneyNode,
  nodes: JourneyNode[],
  positions: Map<string, { x: number; y: number }>,
) => {
  if (node.tier === 0) return { x: 50, y: 51 };

  const siblings = nodes.filter((candidate) => candidate.parentId === node.parentId);
  const siblingIndex = Math.max(0, siblings.findIndex((candidate) => candidate.id === node.id));
  const angle = (siblingIndex / Math.max(siblings.length, 1)) * Math.PI * 2 - Math.PI / 2;
  const parent = node.parentId ? positions.get(node.parentId) : undefined;
  const radius = node.tier === 1 ? 30 : node.tier === 2 ? 14 : 9;
  const center = parent ?? { x: 50, y: 51 };
  return {
    x: center.x + Math.cos(angle) * radius,
    y: center.y + Math.sin(angle) * radius * 0.82,
  };
};

function FallbackGraph({
  nodes,
  links,
  selectedId,
  hoveredId,
  exitingIds,
  onSelect,
  onHover,
}: JourneyGraphProps) {
  const positions = useMemo(() => {
    const basePositions = new Map<string, { x: number; y: number }>();
    nodes
      .slice()
      .sort((a, b) => a.tier - b.tier)
      .forEach((node) => basePositions.set(node.id, fallbackPosition(node, nodes, basePositions)));

    const values = [...basePositions.values()];
    const minX = Math.min(...values.map((position) => position.x));
    const maxX = Math.max(...values.map((position) => position.x));
    const minY = Math.min(...values.map((position) => position.y));
    const maxY = Math.max(...values.map((position) => position.y));
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const scale = Math.min(
      1.16,
      76 / Math.max(maxX - minX, 1),
      76 / Math.max(maxY - minY, 1),
    );

    return new Map(
      [...basePositions.entries()].map(([id, position]) => [
        id,
        {
          x: 50 + (position.x - centerX) * scale,
          y: 51 + (position.y - centerY) * scale,
        },
      ]),
    );
  }, [nodes]);
  const focusIds = useMemo(
    () => lineage(nodes.find((node) => node.id === hoveredId) ?? null, nodes),
    [hoveredId, nodes],
  );

  return (
    <div className="fallback-graph" role="img" aria-label="Interactive 2D preview of the AI and ML knowledge graph">
      <div className="fallback-motion">
        <svg className="fallback-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {links.map((link) => {
            const source = positions.get(endpointId(link.source));
            const target = positions.get(endpointId(link.target));
            if (!source || !target) return null;
            const sourceId = endpointId(link.source);
            const targetId = endpointId(link.target);
            const emphasized =
              !hoveredId ||
              (focusIds.has(sourceId) && focusIds.has(targetId)) ||
              sourceId === selectedId ||
              targetId === selectedId;
            return (
              <line
                key={`${sourceId}-${targetId}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                className={emphasized ? 'fallback-link is-bright' : 'fallback-link'}
              />
            );
          })}
        </svg>
        <div className="fallback-orbit" aria-hidden="true" />
        {nodes.map((node, index) => {
          const position = positions.get(node.id) ?? { x: 50, y: 50 };
           const parentPosition = node.parentId ? positions.get(node.parentId) ?? position : position;
          const colors = palette[node.tier];
          const focused = !hoveredId || focusIds.has(node.id) || node.id === selectedId;
          const labelVisible =
            node.tier < 2 ||
            node.id === selectedId ||
            node.id === hoveredId ||
            (node.tier === 2 && (!hoveredId || focusIds.has(node.id)));
          return (
            <button
              key={node.id}
              type="button"
              className={`fallback-node tier-${node.tier} ${node.id === selectedId ? 'is-selected' : ''} ${focused ? '' : 'is-dimmed'} ${exitingIds?.has(node.id) ? 'is-exiting' : ''}`}
              style={{
                '--node-left': `${position.x}%`,
                '--node-top': `${position.y}%`,
                '--start-left': `${parentPosition.x}%`,
                '--start-top': `${parentPosition.y}%`,
                '--node-core': colors.core,
                '--node-glow': colors.glow,
                '--node-index': index,
              } as CSSProperties}
              onClick={() => onSelect(node)}
              onMouseEnter={() => onHover(node)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(node)}
              onBlur={() => onHover(null)}
              aria-label={`Select ${node.name}`}
            >
              <span className="fallback-node-core" />
              {labelVisible && <span className="fallback-node-label">{node.name}</span>}
            </button>
          );
        })}
      </div>
      <span className="fallback-note">WEBGL PREVIEW / 2D FALLBACK</span>
    </div>
  );
}

const makeLabel = (node: JourneyNode, visible: boolean, emphasized: boolean): THREE.Sprite | null => {
  if (!visible) return null;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return null;
  const fontSize = node.tier === 0 ? 52 : node.tier === 1 ? 40 : 30;
  const font = `${node.tier === 0 ? '700' : '600'} ${fontSize}px "Space Mono", monospace`;
  context.font = font;
  const textWidth = context.measureText(node.name).width;
  canvas.width = Math.ceil(textWidth + 60);
  canvas.height = fontSize + 50;
  context.font = font;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.shadowColor = 'rgba(0, 0, 0, .96)';
  context.shadowBlur = 8;
  context.shadowOffsetY = 2;
  context.fillStyle = emphasized || node.tier === 0 ? '#FFFFFF' : '#F1E7DF';
  context.fillText(node.name, canvas.width / 2, canvas.height / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
      opacity: emphasized || node.tier < 2 ? 1 : .92,
  }));
  const scaleFactor = 0.35;
  sprite.scale.set(canvas.width * scaleFactor, canvas.height * scaleFactor, 1);
  sprite.position.set(0, palette[node.tier].radius + (node.tier === 0 ? 7 : 5), 0);
  return sprite;
};

function makeNodeObject(node: JourneyNode, selectedId: string, hoveredId: string | null, nodes: JourneyNode[]) {
  const focusIds = lineage(hoveredId ? nodes.find((candidate) => candidate.id === hoveredId) ?? null : null, nodes);
  const emphasized = !hoveredId || focusIds.has(node.id) || node.id === selectedId;
  const colors = palette[node.tier];
  const group = new THREE.Group();
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(colors.radius, 16, 12),
    new THREE.MeshBasicMaterial({ color: colors.core, transparent: true, opacity: emphasized ? 1 : .25 }),
  );
  group.add(sphere);

  const haloCanvas = document.createElement('canvas');
  haloCanvas.width = 64;
  haloCanvas.height = 64;
  const haloContext = haloCanvas.getContext('2d');
  if (haloContext) {
    const gradient = haloContext.createRadialGradient(32, 32, 2, 32, 32, 31);
    gradient.addColorStop(0, `${colors.glow}cc`);
    gradient.addColorStop(.25, `${colors.glow}55`);
    gradient.addColorStop(1, `${colors.glow}00`);
    haloContext.fillStyle = gradient;
    haloContext.fillRect(0, 0, 64, 64);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(haloCanvas),
      transparent: true,
      depthWrite: false,
      opacity: emphasized ? (node.id === selectedId ? 1 : .72) : .1,
      blending: THREE.AdditiveBlending,
    }));
    const haloSize = colors.radius * (node.id === selectedId ? 5.2 : 3.8);
    halo.scale.set(haloSize, haloSize, 1);
    group.add(halo);
  }

  const labelVisible = node.tier < 2 || node.id === selectedId || (node.tier === 2 && (!hoveredId || focusIds.has(node.id))) || node.id === hoveredId;
  const label = makeLabel(node, labelVisible, emphasized);
  if (label) group.add(label);
  return group;
}

export function JourneyGraph({ nodes, links, selectedId, hoveredId, exitingIds, resetViewToken, isPaused, zoomToken, onSelect, onHover }: JourneyGraphProps) {
  const graphRef = useRef<any>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const initialFitDoneRef = useRef(false);
  const [webglAvailable] = useState(supportsWebGL);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const focusIds = useMemo(() => lineage(nodes.find((node) => node.id === hoveredId) ?? null, nodes), [hoveredId, nodes]);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const updateViewport = () => {
      const { width, height } = host.getBoundingClientRect();
      const next = { width: Math.round(width), height: Math.round(height) };
      setViewport((current) => current.width === next.width && current.height === next.height ? current : next);
    };

    updateViewport();
    const observer = new ResizeObserver(updateViewport);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;
    graph.d3Force('charge')?.strength(-105);
    graph.d3Force('link')?.distance((link: JourneyLink) => {
      const source = nodes.find((node) => node.id === endpointId(link.source));
      return source?.tier === 0 ? 125 : source?.tier === 1 ? 72 : 44;
    });
    const controls = graph.controls?.();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.28;
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
    }
    return () => {
      if (controls) controls.autoRotate = false;
    };
  }, [nodes]);

  useEffect(() => {
    const graph = graphRef.current;
    if (!graph || !resetViewToken) return;
    graph.centerAt?.(0, 0, 0, 0);
    graph.cameraPosition?.(
      { x: 0, y: 0, z: DEFAULT_CAMERA_DISTANCE },
      { x: 0, y: 0, z: 0 },
      DEFAULT_CAMERA_DURATION,
    );
  }, [resetViewToken]);

  useEffect(() => {
    let frameId: number;
    const applyControls = () => {
      const graph = graphRef.current;
      const controls = graph?.controls?.();
      if (controls) {
        controls.autoRotate = !isPaused;
        controls.autoRotateSpeed = 0.28;
        if (!initialFitDoneRef.current) {
          initialFitDoneRef.current = true;
          graph.cameraPosition?.({ z: DEFAULT_CAMERA_DISTANCE }, undefined, 0);
        }
      } else {
        frameId = requestAnimationFrame(applyControls);
      }
    };
    applyControls();
    return () => cancelAnimationFrame(frameId);
  }, [isPaused, nodes]);

  useEffect(() => {
    const graph = graphRef.current;
    if (!graph || !zoomToken) return;
    try {
      const p = graph.cameraPosition();
      if (zoomToken.action === 'in') {
        graph.cameraPosition({ x: p.x * 0.7, y: p.y * 0.7, z: p.z * 0.7 }, { x: 0, y: 0, z: 0 }, 300);
      } else if (zoomToken.action === 'out') {
        graph.cameraPosition({ x: p.x * 1.4, y: p.y * 1.4, z: p.z * 1.4 }, { x: 0, y: 0, z: 0 }, 300);
      }
    } catch (err) {
      console.warn('Zoom failed:', err);
    }
  }, [zoomToken]);

  const nodeObject = useCallback((node: JourneyNode) => makeNodeObject(node, selectedId, hoveredId, nodes), [selectedId, hoveredId, nodes]);
  const linkColor = useCallback((link: JourneyLink) => {
    const sourceId = endpointId(link.source);
    const targetId = endpointId(link.target);
    if (!hoveredId) return sourceId === selectedId || targetId === selectedId ? '#A85B2B' : '#4D2A18';
    return focusIds.has(sourceId) && focusIds.has(targetId) ? '#C46A32' : '#291a12';
  }, [focusIds, hoveredId, selectedId]);
  const linkWidth = useCallback((link: JourneyLink) => {
    const sourceId = endpointId(link.source);
    const targetId = endpointId(link.target);
    if (sourceId === selectedId || targetId === selectedId) return 1.25;
    return hoveredId && focusIds.has(sourceId) && focusIds.has(targetId) ? .85 : .45;
  }, [focusIds, hoveredId, selectedId]);

  if (!webglAvailable) {
    return (
      <FallbackGraph
        nodes={nodes}
        links={links}
        selectedId={selectedId}
        hoveredId={hoveredId}
        exitingIds={exitingIds}
        onSelect={onSelect}
        onHover={onHover}
      />
    );
  }

  return (
    <div ref={hostRef} className="force-graph-host">
      {viewport.width > 0 && viewport.height > 0 && (
        <ForceGraph3D
          ref={graphRef}
          width={viewport.width}
          height={viewport.height}
          graphData={{ nodes, links }}
          backgroundColor="#050505"
          showNavInfo={false}
          // Keep orbit gestures reliable; the briefing panel controls expansion,
          // so node dragging is unnecessary and can trigger a stale pointer
          // cancellation path inside react-force-graph's DragControls.
          enableNodeDrag={false}
          enableNavigationControls
          controlType="orbit"
          nodeThreeObject={nodeObject}
          nodeThreeObjectExtend={false}
          nodeLabel={(node: JourneyNode) => node.name}
          linkColor={linkColor}
          linkWidth={linkWidth}
          linkOpacity={0.74}
          linkDirectionalParticles={0}
          d3AlphaDecay={0.018}
          d3VelocityDecay={0.88}
          cooldownTicks={140}
          onNodeClick={(node: JourneyNode) => onSelect(node)}
          onNodeHover={(node: JourneyNode | null) => onHover(node)}
        />
      )}
    </div>
  );
}