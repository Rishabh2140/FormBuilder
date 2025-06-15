"use client";
import React, { useEffect, useState } from "react";
import { Edit, Save, Trash2, Plus, Minus } from "lucide-react";

/**
 * FieldEdit - edits a single field
 * props:
 *  - field: { id, label, placeholder, type, options, required, ... }
 *  - onUpdate(id, updatedPart)
 *  - onDelete(id)
 *  - theme (optional): theme object from app/_data/Themes.jsx
 */
function FieldEdit({ field = {}, onUpdate, onDelete, theme = {} }) {
  const [editMode, setEditMode] = useState(false);
  const [edited, setEdited] = useState(field || {});

  // helper state for "create N options" flow
  const [createCount, setCreateCount] = useState(2);

  // sync local edited state when parent updates the field prop
  useEffect(() => {
    setEdited(field || {});
    // set default createCount to existing options length or 2
    setCreateCount((field?.options?.length && field.options.length) || 2);
  }, [field]);

  // theme-aware styles (sensible fallbacks)
  const borderColor = theme.border ?? "#e6eaf0";
  const textColor = theme.text ?? "#0f172a";
  const inputBg = theme.inputBackground ?? "#ffffff";
  const primary = theme.primary ?? "#1995AD";
  const buttonText = theme.buttonText ?? "#ffffff";

  const inputStyle = {
    borderColor,
    backgroundColor: inputBg,
    color: textColor,
    padding: "6px 8px",
    borderRadius: 6,
  };

  const controlBtnStyle = {
    borderColor,
    backgroundColor: "transparent",
    color: textColor,
    padding: "6px 8px",
    borderRadius: 6,
  };

  const primaryBtnStyle = {
    backgroundColor: primary,
    color: buttonText,
    padding: "6px 10px",
    borderRadius: 6,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };

  const handleSave = () => {
    if (!edited.label || !edited.type) {
      alert("Please provide at least a label and a type.");
      return;
    }
    // ensure options array exists for select/radio
    if (["select", "radio"].includes(edited.type)) {
      edited.options = edited.options?.filter(Boolean) || [];
      if (edited.options.length === 0) {
        alert("Please add at least one option for this field.");
        return;
      }
    }
    onUpdate(field.id, edited);
    setEditMode(false);
  };

  // Create N options, default names Option 1..N
  const createOptions = (count) => {
    const n = Math.max(1, Number(count) || 1);
    const opts = Array.from({ length: n }, (_, i) => `Option ${i + 1}`);
    setEdited({ ...edited, options: opts });
  };

  // Add a single option
  const addOption = () => {
    setEdited({ ...edited, options: [...(edited.options || []), `Option ${ (edited.options||[]).length + 1 }`] });
  };

  // Remove option at index
  const removeOption = (index) => {
    const opts = (edited.options || []).filter((_, i) => i !== index);
    setEdited({ ...edited, options: opts });
  };

  // Update single option label
  const updateOption = (index, value) => {
    const opts = (edited.options || []).map((o, i) => (i === index ? value : o));
    setEdited({ ...edited, options: opts });
  };

  if (!field) {
    return (
      <div className="p-3 text-sm" style={{ color: textColor, backgroundColor: inputBg, borderRadius: 6 }}>
        No field data
      </div>
    );
  }

  return (
    <div className="mt-3">
      {editMode ? (
        <div className="p-3 border rounded shadow-sm space-y-3" style={{ borderColor, backgroundColor: inputBg }}>
          <div>
            <label className="text-xs" style={{ color: textColor }}>Label</label>
            <input
              type="text"
              className="block w-full mt-1 border rounded p-2"
              value={edited.label || ""}
              onChange={(e) => setEdited({ ...edited, label: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="text-xs" style={{ color: textColor }}>Placeholder</label>
            <input
              type="text"
              className="block w-full mt-1 border rounded p-2"
              value={edited.placeholder || ""}
              onChange={(e) =>
                setEdited({ ...edited, placeholder: e.target.value })
              }
              style={inputStyle}
            />
          </div>

          <div>
            <label className="text-xs" style={{ color: textColor }}>Type</label>
            <select
              className="block w-full mt-1 border rounded p-2"
              value={edited.type || "text"}
              onChange={(e) =>
                setEdited({ ...edited, type: e.target.value })
              }
              style={inputStyle}
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="tel">Phone</option>
              <option value="textarea">Textarea</option>
              <option value="select">Dropdown (select)</option>
              <option value="radio">Radio</option>
              <option value="checkbox">Checkbox</option>
            </select>
          </div>

          {/* Options UI: ask for count or edit individually */}
          {["select", "radio"].includes(edited.type) && (
            <div>
              <label className="text-xs" style={{ color: textColor }}>Options</label>

              {/* If no options exist, show create-by-count controls */}
              {(!edited.options || edited.options.length === 0) ? (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    min={1}
                    className="w-20 border rounded p-2"
                    value={createCount}
                    onChange={(e) => setCreateCount(Number(e.target.value))}
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => createOptions(createCount)}
                    className="px-3 py-1 rounded"
                    style={primaryBtnStyle}
                  >
                    Create {createCount} options
                  </button>
                </div>
              ) : (
                <div className="space-y-2 mt-2">
                  {(edited.options || []).map((opt, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        type="text"
                        className="flex-1 border rounded p-2"
                        value={opt}
                        onChange={(e) => updateOption(i, e.target.value)}
                        style={inputStyle}
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(i)}
                        className="p-2 rounded"
                        style={{ ...controlBtnStyle, backgroundColor: "#f3f4f6" }}
                        title="Remove option"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={addOption}
                      className="flex items-center gap-1 px-3 py-1 rounded"
                      style={{ ...primaryBtnStyle, backgroundColor: "#16a34a" }}
                    >
                      <Plus className="w-4 h-4" /> Add option
                    </button>

                    <button
                      type="button"
                      onClick={() => createOptions( (edited.options || []).length )}
                      className="px-3 py-1 rounded"
                      style={{ ...controlBtnStyle, backgroundColor: "#f3f4f6" }}
                      title="Reset options with same count"
                    >
                      Reset labels
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1 rounded"
              style={primaryBtnStyle}
            >
              <Save className="w-4 h-4" /> Save
            </button>
            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                // restore edited state from the original field to discard unsaved edits
                setEdited(field);
              }}
              className="px-3 py-1 rounded"
              style={controlBtnStyle}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm">
            <div className="font-medium" style={{ color: textColor }}>{field.label || "Untitled"}</div>
            <div className="text-xs" style={{ color: "#6b7280" }}>{field.type || "text"}</div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="text-blue-600 hover:text-blue-800"
              title="Edit"
              style={{ background: "transparent", border: "none", padding: 6 }}
            >
              <Edit className="w-5 h-5" style={{ color: primary }} />
            </button>

            <button
              type="button"
              onClick={() => onDelete(field.id)}
              className="text-red-600 hover:text-red-800"
              title="Delete"
              style={{ background: "transparent", border: "none", padding: 6 }}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FieldEdit;
