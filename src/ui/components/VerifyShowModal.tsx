/**
 * LUMORA UI — "Verify Show" Diagnostic Verification Modal
 */

import React from "react";
import { useLumora } from "../context/LumoraContext";
import { CheckCircle, AlertTriangle, XCircle, ShieldCheck, X } from "lucide-react";

export const VerifyShowModal: React.FC = () => {
  const { verifyShowModalOpen, setVerifyShowModalOpen, verifyShow } = useLumora();

  if (!verifyShowModalOpen) return null;

  const report = verifyShow();

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
        width: 540,
        backgroundColor: "var(--bg-panel)",
        border: "1px solid var(--border-color)",
        borderRadius: 8,
        padding: 20,
        color: "var(--text-primary)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 16 }}>
            <ShieldCheck size={20} color="var(--accent-blue)" />
            PROJECT VERIFICATION ("VERIFY SHOW")
          </div>
          <X size={18} style={{ cursor: "pointer" }} onClick={() => setVerifyShowModalOpen(false)} />
        </div>

        {/* Status Headline Banner */}
        <div style={{
          padding: 16,
          borderRadius: 6,
          textAlign: "center",
          fontWeight: 800,
          fontSize: 20,
          marginBottom: 16,
          backgroundColor: report.isReady ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
          color: report.isReady ? "var(--accent-green)" : "var(--accent-red)",
          border: `1px solid ${report.isReady ? "var(--accent-green)" : "var(--accent-red)"}`
        }}>
          {report.statusText}
        </div>

        {/* Diagnostic Checklist */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {report.issues.length === 0 ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--accent-green)", fontSize: 13 }}>
              <CheckCircle size={16} /> All show systems, media references, resolution settings, and GPU pipelines are verified ready for live performance.
            </div>
          ) : (
            report.issues.map((issue, idx) => (
              <div key={idx} style={{ padding: 10, backgroundColor: "var(--bg-input)", borderRadius: 4, borderLeft: `3px solid ${issue.type === "error" ? "var(--accent-red)" : "var(--accent-yellow)"}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: 12, color: issue.type === "error" ? "var(--accent-red)" : "var(--accent-yellow)" }}>
                  {issue.type === "error" ? <XCircle size={14} /> : <AlertTriangle size={14} />}
                  {issue.message}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                  Fix: {issue.actionableFix}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="btn btn-primary" onClick={() => setVerifyShowModalOpen(false)}>
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
