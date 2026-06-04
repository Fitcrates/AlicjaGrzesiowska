"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw } from "lucide-react";
import type { HomePage } from "@/sanity/lib/types";
import styles from "./ScatteredKnowledge.module.css";

type NodeData = {
  id: string;
  label: string;
  angle: number;
};

function getNodes(data?: HomePage | null): NodeData[] {
  return [
    { id: "data", label: data?.dataLabel || "Data", angle: 270 },
    { id: "story", label: data?.storyLabel || "Story", angle: 330 },
    { id: "audience", label: data?.audienceLabel || "Audience", angle: 30 },
    { id: "context", label: data?.contextLabel || "Context", angle: 150 },
    { id: "design", label: data?.designLabel || "Design", angle: 210 },
  ];
}

type Connection = {
  from: string;
  to: string;
  unfixedType: "broken" | "duplicate";
};

const connections: Connection[] = [
  // Hub to nodes
  { from: "hub", to: "data", unfixedType: "broken" },
  { from: "hub", to: "story", unfixedType: "duplicate" },
  { from: "hub", to: "audience", unfixedType: "broken" },
  { from: "hub", to: "context", unfixedType: "duplicate" },
  { from: "hub", to: "design", unfixedType: "broken" },

  // Perimeter
  { from: "data", to: "story", unfixedType: "duplicate" },
  { from: "story", to: "audience", unfixedType: "broken" },
  { from: "audience", to: "context", unfixedType: "duplicate" },
  { from: "context", to: "design", unfixedType: "broken" },
  { from: "design", to: "data", unfixedType: "duplicate" },
];

function getNodePos(angle: number, radius: number, cx: number, cy: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

export default function ScatteredKnowledge({ data }: { data?: HomePage | null }) {
  const [fixedNodes, setFixedNodes] = useState<string[]>([]);
  const [activeNode, setActiveNode] = useState<NodeData | null>(null);

  const unfixedTitle = data?.knowledgeUnfixedTitle || "Most companies already have the knowledge they need.";
  const unfixedDesc = data?.knowledgeUnfixedDesc || "The challenge is making it discoverable, reusable, and scalable.";
  const fixedTitle = data?.knowledgeFixedTitle || "A unified ecosystem drives actionable insight.";
  const fixedDesc = data?.knowledgeFixedDesc || "When information is structured and connected, every team speaks the same language and makes better decisions.";
  const sectionLabel = data?.knowledgeSectionLabel || "Knowledge Graph";
  const healthyLabel = data?.healthyEcosystemLabel || "Healthy Ecosystem";
  const brokenLabel = data?.brokenConnectionLabel || "Broken Connection";
  const duplicateLabel = data?.duplicateSignalLabel || "Duplicate Signal";
  const modalTitleText = data?.modalTitle || "Fix the Structure";
  const modalPrefix = data?.modalDescriptionPrefix || "Information is everywhere, but understanding is not. By aligning";
  const modalSuffix = data?.modalDescriptionSuffix || "with the rest of the ecosystem, we remove friction and enable better decisions.";
  const currentStateTitleText = data?.currentStateTitle || "Current State";
  const currentStateDescText = data?.currentStateDesc || "Disconnected data points create ambiguity.";
  const targetStateTitleText = data?.targetStateTitle || "Target State";
  const targetStateDescText = data?.targetStateDesc || "A governed, unified approach to knowledge.";
  const applyFixText = data?.applyFixLabel || "Apply Fix";
  const resetText = data?.resetLabel || "Reset";
  const hubUnfixedLine1 = data?.hubUnfixedLine1 || "INFORMATION";
  const hubUnfixedLine2 = data?.hubUnfixedLine2 || "ARCHITECTURE";
  const hubFixedLine1 = data?.hubFixedLine1 || "UNIFIED";
  const hubFixedLine2 = data?.hubFixedLine2 || "ECOSYSTEM";
  const modalQuoteText = data?.modalQuote || "Clarity is not the absence of information, but its arrangement.";

  const nodes = getNodes(data);
  const isFixed = (nodeId: string) => nodeId === "hub" || fixedNodes.includes(nodeId);
  const allFixed = fixedNodes.length === nodes.length;

  const handleNodeClick = (node: NodeData) => {
    if (isFixed(node.id)) {
      // Toggle off — unfix the node directly
      setFixedNodes(fixedNodes.filter((id) => id !== node.id));
    } else {
      // Open modal to confirm fix
      setActiveNode(node);
    }
  };

  const handleFixNode = () => {
    if (activeNode && !fixedNodes.includes(activeNode.id)) {
      setFixedNodes([...fixedNodes, activeNode.id]);
    }
    setActiveNode(null);
  };

  const handleReset = () => {
    setFixedNodes([]);
    setActiveNode(null);
  };

  const cx = 600;
  const cy = 400;
  const orbitRadius = 260;
  const hubRadius = 70; // 140px diameter
  const nodeRadius = 55; // 110px diameter

  return (
    <section id="knowledge" className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionNumber}>02</span>
        <span className={styles.sectionLabel}>{sectionLabel}</span>
      </div>

      <div className={styles.content}>
        {/* Graph Side */}
        <div className={styles.graphSide}>
          <div className={styles.graphWrapper}>
            <svg className={styles.svgCanvas} viewBox="0 0 1200 800">
              {/* Faint dashed orbital ring path */}
              <circle
                cx={cx}
                cy={cy}
                r={orbitRadius}
                stroke="var(--color-sandy)"
                strokeWidth="1"
                strokeDasharray="4 8"
                fill="none"
              />

              {/* Connections */}
              {connections.map((conn) => {
                const fromPos =
                  conn.from === "hub"
                    ? { x: cx, y: cy }
                    : getNodePos(nodes.find((n) => n.id === conn.from)!.angle, orbitRadius, cx, cy);

                const toPos =
                  conn.to === "hub"
                    ? { x: cx, y: cy }
                    : getNodePos(nodes.find((n) => n.id === conn.to)!.angle, orbitRadius, cx, cy);

                const bothFixed = isFixed(conn.from) && isFixed(conn.to);
                const type = bothFixed ? "healthy" : conn.unfixedType;

                if (type === "healthy") {
                  return (
                    <motion.line
                      key={`${conn.from}-${conn.to}`}
                      x1={fromPos.x}
                      y1={fromPos.y}
                      x2={toPos.x}
                      y2={toPos.y}
                      stroke="var(--color-accent)"
                      strokeWidth="1.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1 }}
                    />
                  );
                }

                if (type === "broken") {
                  return (
                    <g key={`${conn.from}-${conn.to}`}>
                      <line
                        x1={fromPos.x}
                        y1={fromPos.y}
                        x2={toPos.x}
                        y2={toPos.y}
                        stroke="var(--color-terracotta)"
                        strokeWidth="1"
                        strokeDasharray="6 6"
                        className={styles.animDash}
                      />
                    </g>
                  );
                }

                if (type === "duplicate") {
                  const dx = toPos.x - fromPos.x;
                  const dy = toPos.y - fromPos.y;
                  const len = Math.sqrt(dx * dx + dy * dy);
                  const nx = -dy / len;
                  const ny = dx / len;
                  const offset = 3;

                  return (
                    <g key={`${conn.from}-${conn.to}`}>
                      <line
                        x1={fromPos.x + nx * offset}
                        y1={fromPos.y + ny * offset}
                        x2={toPos.x + nx * offset}
                        y2={toPos.y + ny * offset}
                        stroke="var(--color-sandy)"
                        strokeWidth="1"
                      />
                      <line
                        x1={fromPos.x - nx * offset}
                        y1={fromPos.y - ny * offset}
                        x2={toPos.x - nx * offset}
                        y2={toPos.y - ny * offset}
                        stroke="var(--color-sandy)"
                        strokeWidth="1"
                      />
                    </g>
                  );
                }

                return null;
              })}

              {/* Central Hub Node */}
              <g className={styles.hubNode}>
                {allFixed && (
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r={hubRadius + 40}
                    fill="var(--color-accent)"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformOrigin: `${cx}px ${cy}px` }}
                  />
                )}
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r={hubRadius}
                  fill={allFixed ? "var(--color-accent)" : "var(--background)"}
                  stroke={allFixed ? "var(--color-accent)" : "var(--color-charcoal)"}
                  strokeWidth="1"
                  animate={{ 
                    fill: allFixed ? "var(--color-accent)" : "var(--background)",
                    stroke: allFixed ? "var(--color-accent)" : "var(--color-charcoal)" 
                  }}
                  transition={{ duration: 1 }}
                />
                
                <AnimatePresence>
                  {!allFixed ? (
                    <motion.g
                      key="unfixed-text"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <text
                        x={cx}
                        y={cy - 8}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className={styles.hubText}
                        fill="var(--color-primary)"
                      >
                        {hubUnfixedLine1}
                      </text>
                      <text
                        x={cx}
                        y={cy + 10}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className={styles.hubText}
                        fill="var(--color-primary)"
                      >
                        {hubUnfixedLine2}
                      </text>
                    </motion.g>
                  ) : (
                    <motion.g
                      key="fixed-text"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                    >
                      <text
                        x={cx}
                        y={cy - 8}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className={styles.hubText}
                        fill="var(--background)"
                      >
                        {hubFixedLine1}
                      </text>
                      <text
                        x={cx}
                        y={cy + 10}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className={styles.hubText}
                        fill="var(--background)"
                      >
                        {hubFixedLine2}
                      </text>
                    </motion.g>
                  )}
                </AnimatePresence>
              </g>

              {/* Orbital Nodes */}
              {nodes.map((node) => {
                const pos = getNodePos(node.angle, orbitRadius, cx, cy);
                const fixed = isFixed(node.id);

                return (
                  <g
                    key={node.id}
                    onClick={() => handleNodeClick(node)}
                    className={styles.orbitalNode}
                  >
                    <circle cx={pos.x} cy={pos.y} r={nodeRadius + 15} fill="transparent" />

                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={nodeRadius}
                      fill={fixed ? "var(--color-accent)" : "var(--background)"}
                      stroke={fixed ? "var(--color-accent)" : "var(--color-charcoal)"}
                      strokeWidth={fixed ? "2" : "1"}
                      className={styles.nodeCircle}
                    />

                    <text
                      x={pos.x}
                      y={pos.y + 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={fixed ? "white" : "var(--color-charcoal)"}
                      className={styles.nodeLabel}
                    >
                      {node.label}
                    </text>

                  </g>
                );
              })}
            </svg>
            
            {/* Hint below graph */}
            <AnimatePresence>
              {fixedNodes.length === 0 && (
                <motion.span
                  className={styles.graphHint}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: [0.5, 1, 0.5], y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    opacity: { repeat: Infinity, duration: 2 },
                    y: { duration: 0.3 },
                  }}
                >
                  ↑ {data?.heroScrollLabel || "Click nodes to align the structure"}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Legend Side */}
        <div className={styles.legendSide}>
          <div className={styles.legendTextWrapper}>
            <AnimatePresence>
              {!allFixed ? (
                <motion.div
                  key="unfixed-legend"
                  className={styles.legendTextContent}
                  initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -15, filter: "blur(8px)" }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h2 className={styles.legendTitle}>
                    {unfixedTitle}
                  </h2>
                  <p className={styles.legendDescription}>
                    {unfixedDesc}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="fixed-legend"
                  className={styles.legendTextContent}
                  initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -15, filter: "blur(8px)" }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                >
                  <h2 className={styles.legendTitle} style={{ color: "var(--color-accent)" }}>
                    {fixedTitle}
                  </h2>
                  <p className={styles.legendDescription}>
                    {fixedDesc}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className={styles.legendItems}>
            <div className={styles.legendItem}>
              <div className={`${styles.legendLine} ${styles.legendLineSolid}`}></div>
              <span className={styles.legendText}>{healthyLabel}</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendLine} ${styles.legendLineDashed}`}></div>
              <span className={styles.legendText}>{brokenLabel}</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendLine} ${styles.legendLineDotted}`}></div>
              <span className={styles.legendText}>{duplicateLabel}</span>
            </div>
          </div>

          <div className={styles.statusBar}>
            <div
              className={`${styles.statusText} ${
                allFixed ? styles.statusComplete : ""
              }`}
              style={{ position: "relative", overflow: "hidden", display: "flex", alignItems: "center" }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={fixedNodes.length}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "backOut" }}
                  style={{ display: "inline-block", whiteSpace: "nowrap" }}
                >
                  {allFixed
                    ? "✓ All nodes aligned"
                    : `${fixedNodes.length} / ${nodes.length} nodes fixed`}
                </motion.span>
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {fixedNodes.length > 0 && (
                <motion.button
                  className={styles.resetBtn}
                  onClick={handleReset}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <RotateCcw size={10} style={{ marginRight: 4 }} />
                  {resetText}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeNode && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveNode(null)}
          >
            <motion.div
              className={styles.modal}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.modalClose}
                onClick={() => setActiveNode(null)}
              >
                <X size={20} color="var(--color-primary)" />
              </button>

              <div className={styles.modalLeft}>
                <p className={styles.modalQuote}>
                  {modalQuoteText}
                </p>
              </div>

              <div className={styles.modalRight}>
                <h3 className={styles.modalTitle}>{modalTitleText}</h3>
                <p className={styles.modalDescription}>
                  {modalPrefix} {activeNode.label} {modalSuffix}
                </p>

                <div className={styles.modalDetail}>
                  <div className={styles.modalDetailText}>
                    <h4>{currentStateTitleText}</h4>
                    <p>{currentStateDescText}</p>
                  </div>
                </div>

                <div className={styles.modalDetail}>
                  <div className={styles.modalDetailText}>
                    <h4>{targetStateTitleText}</h4>
                    <p>{targetStateDescText}</p>
                  </div>
                </div>

                <button className={styles.modalApply} onClick={handleFixNode}>
                  {applyFixText}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
