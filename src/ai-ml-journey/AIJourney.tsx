import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CircleHelp, ChevronDown, ChevronRight, Volume2, VolumeX, Crosshair, Pause, Play, ZoomIn, ZoomOut } from 'lucide-react';
import { descendants, childIds, journeyById, journeyNodes, rootNode, type JourneyNode } from './journey-data';
import { JourneyGraph, type JourneyLink } from './JourneyGraph';
import './ai-journey.css';

function useSignal() {
  const audioRef = useRef<AudioContext | null>(null);
  const enabledRef = useRef(false);
  const play = useCallback((kind: 'click' | 'expand') => {
    if (!enabledRef.current) return;
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    audioRef.current ??= new AudioContextClass();
    const context = audioRef.current;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = kind === 'expand' ? 388 : 264;
    gain.gain.setValueAtTime(.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(kind === 'expand' ? .045 : .028, context.currentTime + .012);
    gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + .16);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + .17);
  }, []);
  const toggle = useCallback(() => {
    enabledRef.current = !enabledRef.current;
    if (enabledRef.current) play('click');
    return enabledRef.current;
  }, [play]);
  return { play, toggle };
}

function App() {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(['root']));
  const [exitingIds, setExitingIds] = useState<Set<string>>(() => new Set());
  const [selectedId, setSelectedId] = useState(rootNode.id);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [viewResetToken, setViewResetToken] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [zoomToken, setZoomToken] = useState<{ action: 'in' | 'out' | null; ts: number } | undefined>();
  const signal = useSignal();
  const collapseTimers = useRef<number[]>([]);

  useEffect(() => () => {
    collapseTimers.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const visibleNodes = useMemo(() => journeyNodes.filter((node) => {
    if (exitingIds.has(node.id)) return true;
    if (node.tier === 0) return true;
    let parent = node.parentId;
    while (parent) {
      if (!expanded.has(parent)) return false;
      parent = journeyById.get(parent)?.parentId ?? null;
    }
    return true;
  }), [expanded, exitingIds]);

  const visibleIds = useMemo(() => new Set(visibleNodes.map((node) => node.id)), [visibleNodes]);
  const links = useMemo<JourneyLink[]>(() => visibleNodes
    .filter((node) => node.parentId && visibleIds.has(node.parentId))
    .map((node) => ({ source: node.parentId!, target: node.id })), [visibleIds, visibleNodes]);
  const selected = journeyById.get(selectedId) ?? rootNode;

  const toggleExpansion = useCallback((node: JourneyNode) => {
    if (childIds(node.id).length === 0) return;

    const closing = expanded.has(node.id);
    const branchIds = descendants(node.id);

    setExpanded((current) => {
      const next = new Set(current);
      if (closing) {
        next.delete(node.id);
        branchIds.forEach((id) => next.delete(id));
      } else {
        next.add(node.id);
      }
      return next;
    });

    if (closing) {
      setExitingIds((current) => new Set([...current, ...branchIds]));
      const timer = window.setTimeout(() => {
        setExitingIds((current) => {
          const next = new Set(current);
          branchIds.forEach((id) => next.delete(id));
          return next;
        });
      }, 520);
      collapseTimers.current.push(timer);
    } else {
      setExitingIds((current) => {
        const next = new Set(current);
        branchIds.forEach((id) => next.delete(id));
        return next;
      });
    }
    signal.play('expand');
  }, [expanded, signal]);

  const selectNode = useCallback((node: JourneyNode, toggleBranch = false) => {
    setSelectedId(node.id);
    signal.play('click');
    if (toggleBranch && node.tier === 1) toggleExpansion(node);
  }, [signal, toggleExpansion]);

  const centerRoot = useCallback(() => {
    setSelectedId(rootNode.id);
    setHoveredId(null);
    setViewResetToken((current) => current + 1);
    signal.play('click');
  }, [signal]);

  return (
    <main className="journey-shell" data-testid="journey-shell">
      <section className="graph-stage" aria-label="Interactive AI and ML knowledge graph">
        <div className="stage-topline">
          <div>
            <p className="wordmark">AI/ML JOURNEY</p>
            <div className="stage-coordinates">LEARNING ATLAS / 01</div>
          </div>
          <div className="stage-readout flex gap-2">
            <button className="control-button" type="button" onClick={() => setZoomToken({ action: 'in', ts: Date.now() })} aria-label="Zoom in">
              <ZoomIn size={14} strokeWidth={1.5} />
            </button>
            <button className="control-button" type="button" onClick={() => setZoomToken({ action: 'out', ts: Date.now() })} aria-label="Zoom out">
              <ZoomOut size={14} strokeWidth={1.5} />
            </button>
            <button className={`control-button ${isPaused ? 'is-on' : ''}`} type="button" onClick={() => setIsPaused(!isPaused)} aria-label={isPaused ? 'Resume animation' : 'Pause animation'}>
              {isPaused ? <Play size={14} strokeWidth={1.5} /> : <Pause size={14} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
        <div className="graph-canvas" data-testid="graph-canvas">
          <JourneyGraph
            nodes={visibleNodes}
            links={links}
            selectedId={selectedId}
            hoveredId={hoveredId}
            exitingIds={exitingIds}
            resetViewToken={viewResetToken}
            isPaused={isPaused}
            zoomToken={zoomToken}
            onSelect={(node) => selectNode(node, true)}
            onHover={(node) => setHoveredId(node?.id ?? null)}
          />
        </div>
        <div className="graph-controls">
          <button className={`control-button ${soundEnabled ? 'is-on' : ''}`} type="button" onClick={() => setSoundEnabled(signal.toggle())} aria-label={soundEnabled ? 'Disable sound' : 'Enable sound'} data-testid="button-sound">
            {soundEnabled ? <Volume2 size={14} strokeWidth={1.5} /> : <VolumeX size={14} strokeWidth={1.5} />}
          </button>
          <button className="control-button" type="button" onClick={centerRoot} aria-label="Focus the root node" data-testid="button-center-root">
            <Crosshair size={14} strokeWidth={1.5} />
          </button>
          <div className="control-help-wrap">
            <button className={`control-button ${helpOpen ? 'is-on' : ''}`} type="button" onClick={() => setHelpOpen((open) => !open)} aria-label="Show graph controls" data-testid="button-help">
              <CircleHelp size={14} strokeWidth={1.5} />
            </button>
            {helpOpen && <div className="control-help" data-testid="text-graph-help">Orbit with drag. Scroll to zoom. Select a node to inspect it. Expand one tier at a time from the briefing panel.</div>}
          </div>
        </div>
      </section>

      <aside className="briefing-panel" aria-label="Mission briefing">
        <div className="briefing-kicker"><span>MISSION_BRIEFING</span><span className="kicker-index">ATLAS / 001</span></div>
        <header className="briefing-intro">
          <h1 className="briefing-title">AI/ML JOURNEY</h1>
          <p className="briefing-copy">A quiet map for moving from mathematical foundations to systems that learn, reason, and act. Select a node to inspect the next piece of the route.</p>
        </header>
        <div className="briefing-content">
          <div className="detail-block" key={selected.id} data-testid={`detail-node-${selected.id}`}>
            <div className="breadcrumb" data-testid="text-breadcrumb">
              <span>AI/ML BRAIN</span>
              {selected.parentId && <><span className="breadcrumb-separator">/</span><span>{journeyById.get(selected.parentId)?.name}</span></>}
              {selected.tier > 1 && <><span className="breadcrumb-separator">/</span><span>{selected.name}</span></>}
            </div>
            <span className="tier-label">TIER {selected.tier} {selected.tier === 3 ? '/ COMPLETED TASK' : '/ DOMAIN MAP'}</span>
            <h2 className="node-title" data-testid="text-selected-node">{selected.name}</h2>
            <p className="node-description" data-testid="text-selected-description">{selected.description}</p>
            {selected.tier === 3 && (
              <div className="leaf-fields">
                <div><span className="field-label">TOOLS / STACK</span><p className="field-value">{selected.tools}</p></div>
                <div><span className="field-label">OUTCOME / SIGNAL</span><p className="field-value">{selected.outcome}</p></div>
              </div>
            )}
            {selected.tier < 3 && childIds(selected.id).length > 0 && (
              <div className="briefing-actions">
                <button className="briefing-action" type="button" onClick={() => toggleExpansion(selected)} data-testid="button-toggle-expansion">
                  {expanded.has(selected.id) ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  {expanded.has(selected.id) ? 'Collapse branch' : `Expand ${selected.tier === 0 ? 'domains' : 'topics'}`}
                </button>
                {selected.id !== rootNode.id && <button className="briefing-action secondary" type="button" onClick={() => selectNode(journeyById.get(selected.parentId ?? 'root') ?? rootNode)} data-testid="button-parent-node">Parent node</button>}
              </div>
            )}
            <div className="detail-divider" />
            <span className="field-label">ROUTE STATUS</span>
            <p className="field-value">{selected.tier === 3 ? 'Completed / ready to replace with your own project.' : childIds(selected.id).length ? `${childIds(selected.id).length} mapped ${selected.tier === 0 ? 'domains' : 'topics'} available.` : 'Roadmap area — more topics are planned.'}</p>
          </div>
        </div>
        <footer className="panel-footer">
          <span className="legend-inline"><span className="legend-mark" /> LIVE MAP</span>
          <span>v0.1 / LOCAL ATLAS</span>
        </footer>
      </aside>
    </main>
  );
}

export default function AIJourneyModule() {
  return (
    <div className="journey-container-wrapper relative w-full h-[80vh] overflow-hidden rounded-xl border border-[var(--border-color)]">
      <style>{`.journey-shell { min-height: 100% !important; height: 100% !important; flex-direction: row; }`}</style>
      <App />
    </div>
  );
}