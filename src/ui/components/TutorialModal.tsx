/**
 * LUMORA UI — Interactive First-Run Tutorial Component
 */

import React, { useState } from "react";
import { useLumora } from "../context/LumoraContext";
import { HelpCircle, ChevronRight, ChevronLeft, Check, X } from "lucide-react";

export const TutorialModal: React.FC = () => {
  const { tutorialModalOpen, setTutorialModalOpen } = useLumora();
  const [step, setStep] = useState(0);

  if (!tutorialModalOpen) return null;

  const steps = [
    {
      title: "Welcome to LUMORA!",
      desc: "LUMORA is a professional projection mapping and live show control application designed for stage shows, festivals, installations, and architectural mapping."
    },
    {
      title: "1. Create a Surface",
      desc: "Click '+ Quad Pin' or '+ Mesh Warp' in the Surfaces panel to create a mapping surface layer."
    },
    {
      title: "2. Import & Assign Media",
      desc: "Drag video or image files into the Media Assets panel, then click 'Assign to Selected Surface'."
    },
    {
      title: "3. Corner Pin & Mesh Warp",
      desc: "Select the Quad Pin tool (E) or Mesh tool (R) to drag the corners directly on the canvas."
    },
    {
      title: "4. Live Show Mode & Emergency Blackout",
      desc: "Click 'Show Mode' or press Tab for large cue buttons during live performances. Press 'B' at any time for emergency blackout."
    }
  ];

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.8)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        width: 480,
        backgroundColor: "var(--bg-panel)",
        border: "1px solid var(--border-color)",
        borderRadius: 8,
        padding: 20
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 16 }}>
            <HelpCircle size={20} color="var(--accent-blue)" />
            GETTING STARTED TUTORIAL ({step + 1}/{steps.length})
          </div>
          <X size={18} style={{ cursor: "pointer" }} onClick={() => setTutorialModalOpen(false)} />
        </div>

        <div style={{ padding: 20, backgroundColor: "var(--bg-input)", borderRadius: 6, marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--accent-blue)", marginBottom: 8 }}>
            {steps[step].title}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-primary)", lineHeight: 1.5 }}>
            {steps[step].desc}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            className="btn"
            disabled={step === 0}
            onClick={() => setStep(prev => Math.max(0, prev - 1))}
          >
            <ChevronLeft size={14} /> Back
          </button>

          {step < steps.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setStep(prev => prev + 1)}>
              Next Step <ChevronRight size={14} />
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => setTutorialModalOpen(false)}>
              <Check size={14} /> Start Mapping!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
