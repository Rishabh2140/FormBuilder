// "use client";

// import React, { useEffect, useState } from "react";
// import FormUi from "@/app/edit-form/_components/FormUi";
// import { db } from "@/app/configs/index";
// import { jsonForms } from "@/app/configs/schema";
// import { eq } from "drizzle-orm";
// import { themes } from "@/app/_data/Themes";

// /**
//  * LiveForm page (read-only)
//  * - Debug friendly: logs params, timings, DB response, parse errors
//  * - Resolves theme safely: either stored as a key (string) or a JSON object
//  *
//  * URL: /nitrr-form/:formid
//  */
// function LiveForm({ params }) {
//   const [record, setRecord] = useState(null);
//   const [jsonForm, setJsonForm] = useState(null);
//   const [themeObj, setThemeObj] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [lastError, setLastError] = useState(null);
//   const [debugInfo, setDebugInfo] = useState(null);

//   useEffect(() => {
//     // defensive: log incoming params
//     console.log("[LiveForm] params:", params);
//     if (params?.formid) {
//       fetchForm(Number(params.formid));
//     } else {
//       // If param name is different (e.g. formId), log that too
//       console.warn("[LiveForm] params.formid is missing — full params:", params);
//       setLoading(false);
//       setLastError("Missing form id in params (expected params.formid).");
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [params]);

//   const fetchForm = async (formId) => {
//     setLoading(true);
//     setLastError(null);
//     setDebugInfo(null);

//     console.log(`[LiveForm] fetching form id=${formId} from DB...`);
//     const startFetch = performance.now();

//     try {
//       const result = await db
//         .select()
//         .from(jsonForms)
//         .where(eq(jsonForms.id, formId));

//       const fetchDuration = Math.round(performance.now() - startFetch);
//       console.log(`[LiveForm] db query completed in ${fetchDuration}ms`, result);

//       setDebugInfo((prev) => ({ ...prev, fetchDuration, rowCount: result?.length ?? 0 }));

//       if (!result || result.length === 0) {
//         setRecord(null);
//         setJsonForm(null);
//         setThemeObj(null);
//         setLoading(false);
//         setLastError(`No record found for id=${formId}`);
//         console.warn(`[LiveForm] No record found for id=${formId}`);
//         return;
//       }

//       const first = result[0];
//       setRecord(first);

//       // parse jsonform safely and measure parse time
//       let parsed = null;
//       let parseError = null;
//       const startParse = performance.now();
//       try {
//         parsed =
//           typeof first.jsonform === "string" ? JSON.parse(first.jsonform) : first.jsonform;
//       } catch (e) {
//         parseError = String(e);
//         console.error("[LiveForm] JSON parse error for jsonform:", e);
//       }
//       const parseDuration = Math.round(performance.now() - startParse);
//       setDebugInfo((prev) => ({ ...prev, parseDuration, parseError }));

//       if (!parsed) {
//         setJsonForm(null);
//         setLastError(`Failed to parse jsonform for id=${formId}: ${parseError}`);
//         setLoading(false);
//         return;
//       }

//       setJsonForm(parsed);

//       // Resolve theme: it might be stored as a string key (e.g. "monokai") or as JSON
//       let resolvedTheme = null;
//       try {
//         if (!first.theme) {
//           resolvedTheme = themes.find((t) => t.key === "light");
//         } else if (typeof first.theme === "string") {
//           // Try as a simple key first
//           const byKey = themes.find((t) => t.key === first.theme);
//           if (byKey) {
//             resolvedTheme = byKey;
//           } else {
//             // Attempt JSON.parse in case DB contains JSON string
//             try {
//               const parsedThemeCandidate = JSON.parse(first.theme);
//               // If parsedThemeCandidate has a key field, try to match; else use as object
//               if (parsedThemeCandidate?.key) {
//                 resolvedTheme =
//                   themes.find((t) => t.key === parsedThemeCandidate.key) || parsedThemeCandidate;
//               } else {
//                 resolvedTheme = parsedThemeCandidate;
//               }
//             } catch (e) {
//               // not JSON, fallback to default
//               console.warn("[LiveForm] theme string is not a known key or JSON; falling back to light", first.theme);
//               resolvedTheme = themes.find((t) => t.key === "light");
//             }
//           }
//         } else if (typeof first.theme === "object") {
//           // if stored as JSON object already (rare), use it
//           resolvedTheme = first.theme;
//         } else {
//           resolvedTheme = themes.find((t) => t.key === "light");
//         }
//       } catch (e) {
//         console.error("[LiveForm] error resolving theme:", e);
//         resolvedTheme = themes.find((t) => t.key === "light");
//       }

//       setThemeObj(resolvedTheme);

//       setLoading(false);
//       console.log("[LiveForm] finished setup — record, parsed json, theme ready");
//     } catch (err) {
//       console.error("[LiveForm] unexpected error fetching form:", err);
//       setLastError(String(err));
//       setLoading(false);
//       setDebugInfo((prev) => ({ ...prev, fetchError: String(err) }));
//     }
//   };

//   // Small local spinner (no external component required)
//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen p-6">
//         <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mb-4" />
//         <div className="text-sm text-gray-600">Loading form preview…</div>
//       </div>
//     );
//   }

//   if (lastError) {
//     return (
//       <div className="p-8">
//         <h2 className="text-xl font-semibold mb-2">Error loading form</h2>
//         <pre className="p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700">{String(lastError)}</pre>

//         <div className="mt-4">
//           <h3 className="font-medium">Debug info</h3>
//           <pre className="p-3 bg-gray-50 border rounded text-xs">
//             {JSON.stringify(
//               {
//                 params,
//                 debugInfo,
//                 recordSummary: record ? { id: record.id, theme: record.theme } : null,
//               },
//               null,
//               2
//             )}
//           </pre>
//         </div>
//       </div>
//     );
//   }

//   if (!jsonForm) {
//     return (
//       <div className="p-8">
//         <h2>No form JSON available</h2>
//         <pre className="mt-2 text-sm text-gray-600">{JSON.stringify(record ?? {}, null, 2)}</pre>
//       </div>
//     );
//   }

//   // Apply background image if present
//   const backgroundStyle = record?.backgroundImage
//     ? {
//         backgroundImage: `url(${record.backgroundImage})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         minHeight: "100vh",
//       }
//     : { minHeight: "100vh" };

//   return (
//     <div className="p-10 flex justify-center items-start" style={backgroundStyle}>
//       <div className="w-full max-w-3xl">
//         <FormUi jsonForms={jsonForm} onChange={() => {}} theme={themeObj} editable={false} />
//         {/* Debug panel (collapsed) — useful during development */}
//         <details className="mt-4 text-xs text-gray-600">
//           <summary className="cursor-pointer">Debug info (click to expand)</summary>
//           <pre className="mt-2 p-3 bg-gray-50 border rounded text-xs">
//             {JSON.stringify({ params, record, debugInfo }, null, 2)}
//           </pre>
//         </details>
//       </div>
//     </div>
//   );
// }

// export default LiveForm;


"use client";

import React, { useEffect, useState } from "react";
import FormUi from "@/app/edit-form/_components/FormUi";
import { useSearchParams } from "next/navigation";
import { db } from "@/app/configs/index";
import { jsonForms } from "@/app/configs/schema";
import { eq } from "drizzle-orm";
import { themes } from "@/app/_data/Themes";

function LiveForm({ params }) {
  const searchParams = useSearchParams();

  const [record, setRecord] = useState(null);
  const [jsonForm, setJsonForm] = useState(null);
  const [themeObj, setThemeObj] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastError, setLastError] = useState(null);

  const [initialValuesFromUrl, setInitialValuesFromUrl] = useState({});

  useEffect(() => {
    // build object from ?a=b&c=d
    const q = {};
    if (searchParams) {
      for (const [k, v] of searchParams.entries()) {
        if (v === "true") q[k] = true;
        else if (v === "false") q[k] = false;
        else q[k] = v;
      }
    }
    setInitialValuesFromUrl(q);
  }, [searchParams]);

  useEffect(() => {
    if (params?.formid) {
      fetchForm(Number(params.formid));
    } else {
      setLoading(false);
      setLastError("Missing form id in params (expected params.formid).");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const fetchForm = async (formId) => {
    setLoading(true);
    setLastError(null);

    try {
      const result = await db
        .select()
        .from(jsonForms)
        .where(eq(jsonForms.id, formId));

      if (!result || result.length === 0) {
        setRecord(null);
        setJsonForm(null);
        setThemeObj(null);
        setLoading(false);
        setLastError(`No record found for id=${formId}`);
        return;
      }

      const first = result[0];
      setRecord(first);

      // parse jsonform safely
      let parsed = null;
      try {
        parsed =
          typeof first.jsonform === "string" ? JSON.parse(first.jsonform) : first.jsonform;
      } catch (e) {
        console.error("JSON parse error for jsonform:", e);
      }

      if (!parsed) {
        setJsonForm(null);
        setLastError(`Failed to parse jsonform for id=${formId}`);
        setLoading(false);
        return;
      }

      setJsonForm(parsed);

      // resolve theme (fallback to 'light')
      let resolvedTheme = themes.find((t) => t.key === "light");
      if (first?.theme) {
        if (typeof first.theme === "string") {
          const byKey = themes.find((t) => t.key === first.theme);
          if (byKey) resolvedTheme = byKey;
          else {
            try {
              const parsedThemeCandidate = JSON.parse(first.theme);
              resolvedTheme =
                (parsedThemeCandidate?.key && themes.find((t) => t.key === parsedThemeCandidate.key)) ||
                parsedThemeCandidate ||
                resolvedTheme;
            } catch (e) {
              // leave fallback
            }
          }
        } else if (typeof first.theme === "object") {
          resolvedTheme = first.theme;
        }
      }
      setThemeObj(resolvedTheme);

      setLoading(false);
    } catch (err) {
      console.error("unexpected error fetching form:", err);
      setLastError(String(err));
      setLoading(false);
    }
  };

  const submitResponse = async ({ values, formId }) => {
    try {
      const body = {
        formId: params.formid,
        jsonResponse: values,
        createdBy: "anonymous",
      };
      const res = await fetch("/api/submit-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to submit");
      const data = await res.json();
      alert("Thanks — form submitted!");
      console.log("submission result:", data);
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to submit form. Check console.");
    }
  };

  const backgroundStyle = record?.backgroundImage
    ? {
        backgroundImage: `url(${record.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }
    : { minHeight: "100vh" };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mb-4" />
        <div className="text-sm text-gray-600">Loading form preview…</div>
      </div>
    );
  }

  if (lastError) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-semibold mb-2">Error loading form</h2>
        <pre className="p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700">{String(lastError)}</pre>

        <div className="mt-4">
          <h3 className="font-medium">Debug info</h3>
          <pre className="p-3 bg-gray-50 border rounded text-xs">
            {JSON.stringify({ params, record: record ? { id: record.id, theme: record.theme } : null }, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  if (!jsonForm) {
    return (
      <div className="p-8">
        <h2>No form JSON available</h2>
        <pre className="mt-2 text-sm text-gray-600">{JSON.stringify(record ?? {}, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="p-10 flex justify-center items-start" style={backgroundStyle}>
      <div className="w-full max-w-3xl">
        <FormUi
          jsonForms={jsonForm}
          onChange={() => {}}
          theme={themeObj}
          editable={false}            // keep author-edit UI hidden
          allowFill={true}            // allow public users to fill the form
          initialValues={initialValuesFromUrl}
          onSubmit={submitResponse}
          submitLabel="Submit Response"
        />

        <details className="mt-4 text-xs text-gray-600">
          <summary className="cursor-pointer">Debug info (click to expand)</summary>
          <pre className="mt-2 p-3 bg-gray-50 border rounded text-xs">
            {JSON.stringify({ params, record }, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}

export default LiveForm;
