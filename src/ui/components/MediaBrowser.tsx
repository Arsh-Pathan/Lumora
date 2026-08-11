/**
 * LUMORA UI — Media Browser & Asset Library Component
 */

import React, { useRef } from "react";
import { useLumora } from "../context/LumoraContext";
import { Film, Image as ImageIcon, Plus, CheckCircle, AlertTriangle, Link as LinkIcon } from "lucide-react";
import type { MediaAsset } from "../../architecture/contracts";
import { LumoraArchive } from "../../project/LumoraArchive";

export const MediaBrowser: React.FC = () => {
  const { project, selectedSurfaceId, assignMediaToSurface, addMediaAsset } = useLumora();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isVideo = file.type.startsWith("video/");
      const asset: MediaAsset = {
        id: `media_${Date.now()}_${i}`,
        filename: file.name,
        originalPath: file.name,
        mimeType: file.type || (isVideo ? "video/mp4" : "image/png"),
        mediaType: isVideo ? "video" : "image",
        resolution: { width: 1920, height: 1080 },
        duration: isVideo ? 15 : 0,
        fps: 60,
        fileSize: file.size,
        checksum: LumoraArchive.generateSimpleChecksum(file.name, file.size),
        isEmbedded: true,
        status: "ready"
      };
      addMediaAsset(asset);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Action Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>MEDIA ASSETS ({project.mediaAssets.length})</span>
        <button className="btn btn-sm btn-primary" onClick={() => fileInputRef.current?.click()}>
          <Plus size={14} /> Import Media
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/webm,image/png,image/jpeg,image/webp,image/svg+xml"
          multiple
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
      </div>

      {/* Asset Grid / List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {project.mediaAssets.length === 0 ? (
          <div style={{ padding: 20, textAlign: "center", color: "var(--text-muted)", fontSize: 12 }}>
            Drag and drop videos or images here to import.
          </div>
        ) : (
          project.mediaAssets.map(asset => (
            <div
              key={asset.id}
              className="list-item"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                marginBottom: 6,
                backgroundColor: "var(--bg-input)",
                border: "1px solid var(--border-color)",
                padding: 8
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 12 }}>
                  {asset.mediaType === "video" ? <Film size={16} color="var(--accent-blue)" /> : <ImageIcon size={16} color="var(--accent-yellow)" />}
                  {asset.filename}
                </div>

                {/* Status indicator */}
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10 }}>
                  {asset.status === "ready" ? (
                    <span style={{ color: "var(--accent-green)", display: "flex", alignItems: "center", gap: 2 }}>
                      <CheckCircle size={12} /> Ready
                    </span>
                  ) : (
                    <span style={{ color: "var(--accent-red)", display: "flex", alignItems: "center", gap: 2 }}>
                      <AlertTriangle size={12} /> Missing
                    </span>
                  )}
                </div>
              </div>

              {/* Resolution & Details */}
              <div style={{ display: "flex", gap: 12, fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                <span>{asset.resolution.width}x{asset.resolution.height}</span>
                {asset.duration > 0 && <span>{asset.duration}s</span>}
                <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <LinkIcon size={10} /> {asset.isEmbedded ? "Embedded" : "Linked"}
                </span>
              </div>

              {/* Assign to selected surface button */}
              {selectedSurfaceId && (
                <button
                  className="btn btn-sm"
                  style={{ marginTop: 4, width: "100%", justifyContent: "center" }}
                  onClick={() => assignMediaToSurface(selectedSurfaceId, asset.id)}
                >
                  Assign to Selected Surface
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
