// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import FieldEdit from "./FieldEdit";
// import { PlusCircle } from "lucide-react";

// function FormUi({ jsonForms = {}, onChange, theme = {}, editable = true }) {
//   const [formFields, setFormFields] = useState([]);
//   const lastLoadedFormId = useRef(null);

//   const formShellBg = theme.panelBackground ?? "#ffffff";
//   const formShellText = theme.text ?? "#0f172a";
//   const cardBg = theme.cardBackground ?? theme.panelBackground ?? "#ffffff";
//   const borderColor = theme.border ?? "#e6eaf0";
//   const inputBg = theme.inputBackground ?? theme.panelBackground ?? "#ffffff";
//   const primary = theme.primary ?? "#1995AD";
//   const buttonText = theme.buttonText ?? "#ffffff";

//   useEffect(() => {
//     if (!jsonForms) {
//       setFormFields([]);
//       lastLoadedFormId.current = null;
//       return;
//     }

//     if (lastLoadedFormId.current !== jsonForms?.id) {
//       lastLoadedFormId.current = jsonForms?.id;
//       const incoming = jsonForms?.form_fields || [];
//       const initialized = incoming.map((f) => ({
//         ...f,
//         id: f.id || (typeof crypto !== "undefined" ? crypto.randomUUID() : Date.now() + Math.random()),
//         options: f.options ?? [],
//         placeholder: f.placeholder ?? "",
//         required: !!f.required,
//       }));
//       setFormFields(initialized);
//     }
//   }, [jsonForms]);

//   const propagateChange = (newFields) => {
//     setFormFields(newFields);
//     const updated = { ...jsonForms, form_fields: newFields };
//     onChange?.(updated);
//   };

//   const addField = (type) => {
//     const newField = {
//       id: typeof crypto !== "undefined" ? crypto.randomUUID() : Date.now() + Math.random(),
//       label: "New Question",
//       type,
//       placeholder: "",
//       required: false,
//       options: type === "select" || type === "radio" ? ["Option 1"] : [],
//     };
//     propagateChange([...formFields, newField]);
//   };

//   const updateField = (id, updatedPart) => {
//     const newFields = formFields.map((f) => (f.id === id ? { ...f, ...updatedPart } : f));
//     propagateChange(newFields);
//   };

//   const deleteField = (id) => {
//     const newFields = formFields.filter((f) => f.id !== id);
//     propagateChange(newFields);
//   };

//   const shellStyle = { backgroundColor: formShellBg, color: formShellText, padding: "18px", borderRadius: 8 };
//   const cardStyle = { backgroundColor: cardBg, borderColor, borderWidth: 1 };
//   const inputBaseStyle = { borderColor, backgroundColor: inputBg, color: formShellText, padding: "8px", borderRadius: 6 };
//   const addButtonStyle = { backgroundColor: primary, color: buttonText };

//   return (
//     <div>
//       <div className="form-shell rounded-md" style={shellStyle} data-theme={theme.key ?? "custom"}>
//         <div className="mb-6 text-center">
//           <h2 className="text-2xl font-bold" style={{ color: primary }}>
//             {jsonForms?.form_title || "Untitled Form"}
//           </h2>
//           {jsonForms?.form_subheading && (
//             <p className="mt-1" style={{ color: formShellText }}>
//               {jsonForms.form_subheading}
//             </p>
//           )}
//         </div>

//         {formFields.length === 0 && (
//           <div className="mb-4 text-sm" style={{ color: formShellText }}>
//             No questions yet.
//           </div>
//         )}

//         <form className="space-y-6 mb-6" onSubmit={(e) => e.preventDefault()}>
//           {formFields.map((field) => (
//             <div key={field.id} className="border rounded p-4" style={{ ...cardStyle, backgroundColor: cardBg }}>
//               <div className="flex items-center justify-between">
//                 <label className="font-semibold" style={{ color: formShellText }}>
//                   {field.label} {field.required && <span className="text-red-500">*</span>}
//                 </label>
//               </div>

//               <div className="mt-2">
//                 {field.type === "textarea" ? (
//                   <textarea placeholder={field.placeholder} className="w-full border rounded p-2" style={inputBaseStyle} readOnly={!editable} />
//                 ) : field.type === "select" ? (
//                   (field.options || []).length === 0 ? (
//                     <div className="text-xs" style={{ color: formShellText }}>
//                       No options.
//                     </div>
//                   ) : (
//                     <select className="w-full border rounded p-2" style={inputBaseStyle} disabled={!editable}>
//                       <option value="">{field.placeholder || "Select"}</option>
//                       {field.options.map((opt, i) => (
//                         <option key={i} value={opt}>
//                           {opt}
//                         </option>
//                       ))}
//                     </select>
//                   )
//                 ) : field.type === "radio" ? (
//                   (field.options || []).length === 0 ? (
//                     <div className="text-xs" style={{ color: formShellText }}>
//                       No options.
//                     </div>
//                   ) : (
//                     <div className="flex flex-col gap-2">
//                       {field.options.map((opt, i) => (
//                         <label key={i} className="flex items-center gap-2" style={{ color: formShellText }}>
//                           <input type="radio" name={`radio_${field.id}`} disabled={!editable} />
//                           <span>{opt}</span>
//                         </label>
//                       ))}
//                     </div>
//                   )
//                 ) : field.type === "checkbox" ? (
//                   <label className="flex items-center gap-2" style={{ color: formShellText }}>
//                     <input type="checkbox" disabled={!editable} />
//                     <span>{field.placeholder || field.label}</span>
//                   </label>
//                 ) : (
//                   <input
//                     type={field.type || "text"}
//                     placeholder={field.placeholder}
//                     style={inputBaseStyle}
//                     className="w-full border rounded p-2"
//                     readOnly={!editable}
//                   />
//                 )}
//               </div>

//               {editable && <FieldEdit field={field} onUpdate={updateField} onDelete={deleteField} theme={theme} />}
//             </div>
//           ))}
//         </form>

//         {editable && (
//           <div className="pt-4 border-t" style={{ borderColor }}>
//             <h3 className="font-semibold mb-2" style={{ color: formShellText }}>
//               Add New Question
//             </h3>
//             <div className="flex flex-wrap gap-2">
//               {["text", "email", "tel", "textarea", "select", "radio", "checkbox"].map((type) => (
//                 <button
//                   key={type}
//                   type="button"
//                   onClick={() => addField(type)}
//                   className="flex items-center gap-1 px-3 py-1 rounded"
//                   style={addButtonStyle}
//                 >
//                   <PlusCircle size={16} /> <span className="capitalize">{type}</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default FormUi;

"use client";
import React, { useEffect, useRef, useState } from "react";
import FieldEdit from "./FieldEdit";
import { PlusCircle } from "lucide-react";

function FormUi({
  jsonForms = {},
  onChange,
  theme = {},
  editable = true,           // when true the author/edit UI shows; when false it's read-only preview
  allowFill = false,         // when true end-users can fill the form (inputs enabled) but FieldEdit hidden
  initialValues = {},        // { fieldName: value } - used to prefill inputs (from URL or saved answers)
  onSubmit = null,           // function({ values, formId }) called when user submits (for live/public form)
  submitLabel = "Submit",
}) {
  const [formFields, setFormFields] = useState([]);
  const [values, setValues] = useState({});
  const lastLoadedFormId = useRef(null);

  const formShellBg = theme.panelBackground ?? "#ffffff";
  const formShellText = theme.text ?? "#0f172a";
  const cardBg = theme.cardBackground ?? theme.panelBackground ?? "#ffffff";
  const borderColor = theme.border ?? "#e6eaf0";
  const inputBg = theme.inputBackground ?? theme.panelBackground ?? "#ffffff";
  const primary = theme.primary ?? "#1995AD";
  const buttonText = theme.buttonText ?? "#ffffff";

  useEffect(() => {
    if (!jsonForms) {
      setFormFields([]);
      lastLoadedFormId.current = null;
      return;
    }

    if (lastLoadedFormId.current !== jsonForms?.id) {
      lastLoadedFormId.current = jsonForms?.id;
      const incoming = jsonForms?.form_fields || [];
      const initialized = incoming.map((f) => ({
        ...f,
        id: f.id || (typeof crypto !== "undefined" ? crypto.randomUUID() : Date.now() + Math.random()),
        options: f.options ?? [],
        placeholder: f.placeholder ?? "",
        required: !!f.required,
        // each field should have a stable `name` (used for URL prefill)
        name:
          f.name ||
          (f.label ? f.label.toLowerCase().replace(/\s+/g, "_").replace(/[^\w\-]/g, "") : `field_${Math.random().toString(36).slice(2, 8)}`),
      }));
      setFormFields(initialized);
      // initialize values from initialValues + defaults
      const initial = {};
      initialized.forEach((f) => {
        if (initialValues && initialValues[f.name] !== undefined) {
          initial[f.name] = initialValues[f.name];
        } else if (f.type === "checkbox") {
          initial[f.name] = !!f.defaultValue;
        } else {
          initial[f.name] = f.defaultValue ?? "";
        }
      });
      setValues(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jsonForms, initialValues]);

  // if parent (editor) wants to know about structure change:
  const propagateChange = (newFields) => {
    setFormFields(newFields);
    const updated = { ...jsonForms, form_fields: newFields };
    onChange?.(updated);
  };

  const addField = (type) => {
    const newField = {
      id: typeof crypto !== "undefined" ? crypto.randomUUID() : Date.now() + Math.random(),
      label: "New Question",
      type,
      placeholder: "",
      required: false,
      options: type === "select" || type === "radio" ? ["Option 1"] : [],
      name: `field_${Math.random().toString(36).slice(2, 8)}`,
    };
    propagateChange([...formFields, newField]);
  };

  const updateField = (id, updatedPart) => {
    const newFields = formFields.map((f) => (f.id === id ? { ...f, ...updatedPart } : f));
    propagateChange(newFields);
  };

  const deleteField = (id) => {
    const newFields = formFields.filter((f) => f.id !== id);
    propagateChange(newFields);
  };

  // CORRECT handleChange
  const handleChange = (e, field) => {
    const { name, type, value, checked, files } = e.target;
    let newVal;
    if (type === "checkbox") {
      newVal = checked;
    } else if (type === "file") {
      newVal = files;
    } else {
      newVal = value;
    }
    setValues((prev) => ({ ...prev, [name]: newVal }));
  };

  const handleRadioChange = (name, radioValue) => {
    setValues((prev) => ({ ...prev, [name]: radioValue }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    onSubmit?.({ values, formId: jsonForms?.id ?? null });
  };

  const shellStyle = { backgroundColor: formShellBg, color: formShellText, padding: "18px", borderRadius: 8 };
  const cardStyle = { backgroundColor: cardBg, borderColor, borderWidth: 1 };
  const inputBaseStyle = { borderColor, backgroundColor: inputBg, color: formShellText, padding: "8px", borderRadius: 6 };
  const addButtonStyle = { backgroundColor: primary, color: buttonText };

  const interactive = editable || allowFill; // combined flag for enabling inputs

  return (
    <div>
      <div className="form-shell rounded-md" style={shellStyle} data-theme={theme.key ?? "custom"}>
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold" style={{ color: primary }}>
            {jsonForms?.form_title || "Untitled Form"}
          </h2>
          {jsonForms?.form_subheading && (
            <p className="mt-1" style={{ color: formShellText }}>
              {jsonForms.form_subheading}
            </p>
          )}
        </div>

        {formFields.length === 0 && (
          <div className="mb-4 text-sm" style={{ color: formShellText }}>
            No questions yet.
          </div>
        )}

        <form className="space-y-6 mb-6" onSubmit={handleSubmit}>
          {formFields.map((field) => (
            <div key={field.id} className="border rounded p-4" style={{ ...cardStyle, backgroundColor: cardBg }}>
              <div className="flex items-center justify-between">
                <label className="font-semibold" style={{ color: formShellText }}>
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
              </div>

              <div className="mt-2">
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    value={values[field.name] ?? ""}
                    onChange={(e) => handleChange(e, field)}
                    placeholder={field.placeholder}
                    className="w-full border rounded p-2"
                    style={inputBaseStyle}
                    readOnly={!interactive}
                  />
                ) : field.type === "select" ? (
                  (field.options || []).length === 0 ? (
                    <div className="text-xs" style={{ color: formShellText }}>
                      No options.
                    </div>
                  ) : (
                    <select
                      name={field.name}
                      value={values[field.name] ?? ""}
                      onChange={(e) => handleChange(e, field)}
                      className="w-full border rounded p-2"
                      style={inputBaseStyle}
                      disabled={!interactive}
                    >
                      <option value="">{field.placeholder || "Select"}</option>
                      {field.options.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )
                ) : field.type === "radio" ? (
                  (field.options || []).length === 0 ? (
                    <div className="text-xs" style={{ color: formShellText }}>
                      No options.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {field.options.map((opt, i) => (
                        <label key={i} className="flex items-center gap-2" style={{ color: formShellText }}>
                          <input
                            type="radio"
                            name={field.name}
                            checked={values[field.name] === opt}
                            onChange={() => handleRadioChange(field.name, opt)}
                            disabled={!interactive}
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )
                ) : field.type === "checkbox" ? (
                  <label className="flex items-center gap-2" style={{ color: formShellText }}>
                    <input
                      name={field.name}
                      type="checkbox"
                      checked={!!values[field.name]}
                      onChange={(e) => handleChange(e, field)}
                      disabled={!interactive}
                    />
                    <span>{field.placeholder || field.label}</span>
                  </label>
                ) : (
                  <input
                    name={field.name}
                    type={field.type || "text"}
                    value={values[field.name] ?? ""}
                    onChange={(e) => handleChange(e, field)}
                    placeholder={field.placeholder}
                    style={inputBaseStyle}
                    className="w-full border rounded p-2"
                    readOnly={!interactive}
                  />
                )}
              </div>

              {editable && <FieldEdit field={field} onUpdate={updateField} onDelete={deleteField} theme={theme} />}
            </div>
          ))}

          {/* Only show submit button if onSubmit is provided (public form) */}
          {onSubmit && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-md font-semibold"
                style={{ backgroundColor: primary, color: buttonText }}
              >
                {submitLabel}
              </button>
            </div>
          )}
        </form>

        {editable && (
          <div className="pt-4 border-t" style={{ borderColor }}>
            <h3 className="font-semibold mb-2" style={{ color: formShellText }}>
              Add New Question
            </h3>
            <div className="flex flex-wrap gap-2">
              {["text", "email", "tel", "textarea", "select", "radio", "checkbox"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addField(type)}
                  className="flex items-center gap-1 px-3 py-1 rounded"
                  style={addButtonStyle}
                >
                  <PlusCircle size={16} /> <span className="capitalize">{type}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FormUi;
