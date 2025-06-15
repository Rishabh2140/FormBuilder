// app/edit-form/_components/Controller.jsx
"use client";
import React from "react";
import { themes } from "@/app/_data/Themes";
import { Palette } from "lucide-react";

function Controller({ selectedTheme = "light", onChange = () => {} }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Palette className="w-4 h-4" />
        <span className="font-medium">Choose Theme</span>
      </div>

      <select
        value={selectedTheme}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
      >
        {themes.map((t) => (
          <option key={t.key} value={t.key}>
            {t.name}
          </option>
        ))}
      </select>

      {/* Theme Preview */}
      <div className="mt-4 p-3 border border-border rounded-lg bg-accent/30">
        <p className="text-xs text-muted-foreground mb-2">Preview Colors:</p>
        <div className="flex gap-2">
          {themes.find(t => t.key === selectedTheme) && (
            <>
              <div 
                className="w-8 h-8 rounded-md border border-border"
                style={{ backgroundColor: themes.find(t => t.key === selectedTheme)?.primary || '#3B82F6' }}
                title="Primary Color"
              />
              <div 
                className="w-8 h-8 rounded-md border border-border"
                style={{ backgroundColor: themes.find(t => t.key === selectedTheme)?.panelBackground || '#FFFFFF' }}
                title="Background"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Controller;

