// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { useUser } from "@clerk/nextjs";
// import { db } from "@/app/configs/index";
// import { jsonForms } from "@/app/configs/schema";
// import { eq, and } from "drizzle-orm";
// import { ArrowLeft, Share, SquareArrowOutUpRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import FormUi from "../_components/FormUi";
// import Controller from "../_components/Controller";
// import { themes } from "@/app/_data/Themes";

// function EditForm({ params }) {
//   const { user } = useUser();
//   const [formData, setFormData] = useState(null);
//   const [jsonForm, setJsonForm] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const [selectedTheme, setSelectedTheme] = useState("light");
//   const [appliedTheme, setAppliedTheme] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     if (user && params?.formId) {
//       getFormData();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user, params]);

//   useEffect(() => {
//     const resolveTheme = () => {
//       if (selectedTheme === "system" && typeof window !== "undefined") {
//         const prefersDark =
//           window.matchMedia &&
//           window.matchMedia("(prefers-color-scheme: dark)").matches;
//         const key = prefersDark ? "dark" : "light";
//         return themes.find((t) => t.key === key) || themes[0];
//       }
//       return themes.find((t) => t.key === selectedTheme) || themes[0];
//     };

//     setAppliedTheme(resolveTheme());

//     let mq;
//     if (selectedTheme === "system" && typeof window !== "undefined") {
//       mq = window.matchMedia("(prefers-color-scheme: dark)");
//       const handler = () => setAppliedTheme(resolveTheme());
//       mq.addEventListener
//         ? mq.addEventListener("change", handler)
//         : mq.addListener(handler);
//       return () => {
//         mq.removeEventListener
//           ? mq.removeEventListener("change", handler)
//           : mq.removeListener(handler);
//       };
//     }
//   }, [selectedTheme]);

//   const getFormData = async () => {
//     try {
//       const result = await db
//         .select()
//         .from(jsonForms)
//         .where(
//           and(
//             eq(jsonForms.id, Number(params.formId)),
//             eq(
//               jsonForms.createdBy,
//               user?.primaryEmailAddress?.emailAddress || ""
//             )
//           )
//         );

//       if (!result.length) {
//         setFormData(null);
//         setJsonForm(null);
//         return;
//       }

//       const first = result[0];
//       setFormData(first);

//       if (first?.theme) {
//         setSelectedTheme(first.theme);
//       }

//       if (first?.jsonform) {
//         try {
//           const parsed =
//             typeof first.jsonform === "string"
//               ? JSON.parse(first.jsonform)
//               : first.jsonform;
//           setJsonForm(parsed);
//         } catch (e) {
//           console.error("Failed to parse jsonform:", e);
//           setJsonForm(null);
//         }
//       } else {
//         setJsonForm(null);
//       }
//     } catch (err) {
//       console.error("Error fetching form data:", err);
//       setFormData(null);
//       setJsonForm(null);
//     }
//   };

//   const handleSaveForm = async (updatedFormJson) => {
//     try {
//       setSaving(true);
//       await db
//         .update(jsonForms)
//         .set({
//           jsonform: JSON.stringify(updatedFormJson),
//           updatedAt: new Date().toISOString(),
//           theme: selectedTheme,
//         })
//         .where(eq(jsonForms.id, Number(params.formId)));

//       setSaving(false);
//       alert("✅ Form saved successfully!");
//       await getFormData();
//     } catch (error) {
//       console.error("Error updating form:", error);
//       setSaving(false);
//       alert("❌ Failed to save form. Check console.");
//     }
//   };

//   if (!formData) return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//     </div>
//   );

//   const currentTheme =
//     appliedTheme || themes.find((t) => t.key === selectedTheme) || themes[0];

//   const publicUrl = `/nitrr-form/${formData.id}`;
//   const shareLink = `${typeof window !== "undefined" ? window.location.origin : ""}${publicUrl}`;

//   return (
//     <div className="p-6 md:p-10 bg-background min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             <span className="font-medium">Back to Dashboard</span>
//           </button>

//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div>
//               <h1 className="text-3xl font-bold text-foreground">Edit Form</h1>
//               <p className="text-muted-foreground mt-1">Customize your form and preview changes</p>
//             </div>

//             <div className="flex flex-wrap gap-3">
//               <Link href={publicUrl} target="_blank">
//                 <Button variant="outline" className="flex items-center gap-2">
//                   <SquareArrowOutUpRight className="w-4 h-4" />
//                   Live Preview
//                 </Button>
//               </Link>

//               <Button
//                 onClick={() => {
//                   navigator.clipboard.writeText(shareLink);
//                   alert("Link copied to clipboard!");
//                 }}
//                 variant="outline"
//                 className="flex items-center gap-2 hover:bg-green-50 hover:text-green-600 hover:border-green-300"
//               >
//                 <Share className="w-4 h-4" />
//                 Share Link
//               </Button>

//               <Button
//                 onClick={() => handleSaveForm(jsonForm)}
//                 disabled={saving}
//                 className="gradient-button shadow-md hover:shadow-lg transition-all"
//               >
//                 {saving ? "Saving..." : "💾 Save Form"}
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Main Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           {/* Left Control Panel */}
//           <div className="lg:col-span-1">
//             <div className="modern-card p-6 sticky top-6">
//               <h3 className="font-semibold text-lg mb-4 text-foreground">Theme Settings</h3>
//               <Controller selectedTheme={selectedTheme} onChange={setSelectedTheme} />
              
//               <div className="mt-6 pt-6 border-t border-border">
//                 <p className="text-sm text-muted-foreground mb-3">
//                   💡 Changes are saved automatically
//                 </p>
//                 <div className="bg-accent/50 rounded-lg p-3">
//                   <p className="text-xs text-muted-foreground">
//                     Form ID: <span className="font-mono font-semibold">{formData.id}</span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Form Preview */}
//           <div className="lg:col-span-3">
//             <div className="modern-card p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
//               <FormUi
//                 jsonForms={jsonForm}
//                 onChange={(updated) => setJsonForm(updated)}
//                 theme={currentTheme}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default EditForm;
//   const { user } = useUser();
//   const [formData, setFormData] = useState(null);
//   const [jsonForm, setJsonForm] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const [selectedTheme, setSelectedTheme] = useState("light");
//   const [appliedTheme, setAppliedTheme] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     if (user && params?.formId) {
//       getFormData();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user, params]);

//   useEffect(() => {
//     const resolveTheme = () => {
//       if (selectedTheme === "system" && typeof window !== "undefined") {
//         const prefersDark =
//           window.matchMedia &&
//           window.matchMedia("(prefers-color-scheme: dark)").matches;
//         const key = prefersDark ? "dark" : "light";
//         return themes.find((t) => t.key === key) || themes[0];
//       }
//       return themes.find((t) => t.key === selectedTheme) || themes[0];
//     };

//     setAppliedTheme(resolveTheme());

//     let mq;
//     if (selectedTheme === "system" && typeof window !== "undefined") {
//       mq = window.matchMedia("(prefers-color-scheme: dark)");
//       const handler = () => setAppliedTheme(resolveTheme());
//       mq.addEventListener
//         ? mq.addEventListener("change", handler)
//         : mq.addListener(handler);
//       return () => {
//         mq.removeEventListener
//           ? mq.removeEventListener("change", handler)
//           : mq.removeListener(handler);
//       };
//     }
//   }, [selectedTheme]);

//   const getFormData = async () => {
//     try {
//       const result = await db
//         .select()
//         .from(jsonForms)
//         .where(
//           and(
//             eq(jsonForms.id, Number(params.formId)),
//             eq(
//               jsonForms.createdBy,
//               user?.primaryEmailAddress?.emailAddress || ""
//             )
//           )
//         );

//       if (!result.length) {
//         setFormData(null);
//         setJsonForm(null);
//         return;
//       }

//       const first = result[0];
//       setFormData(first);

//       // set selectedTheme from DB if present
//       if (first?.theme) {
//         setSelectedTheme(first.theme);
//       }

//       if (first?.jsonform) {
//         try {
//           const parsed =
//             typeof first.jsonform === "string"
//               ? JSON.parse(first.jsonform)
//               : first.jsonform;
//           setJsonForm(parsed);
//         } catch (e) {
//           console.error("Failed to parse jsonform:", e);
//           setJsonForm(null);
//         }
//       } else {
//         setJsonForm(null);
//       }
//     } catch (err) {
//       console.error("Error fetching form data:", err);
//       setFormData(null);
//       setJsonForm(null);
//     }
//   };

//   // Save updated JSON + theme to DB
//   const handleSaveForm = async (updatedFormJson) => {
//     try {
//       setSaving(true);
//       await db
//         .update(jsonForms)
//         .set({
//           jsonform: JSON.stringify(updatedFormJson),
//           updatedAt: new Date().toISOString(),
//           theme: selectedTheme,
//         })
//         .where(eq(jsonForms.id, Number(params.formId)));

//       setSaving(false);
//       alert("✅ Form saved successfully!");
//       await getFormData();
//     } catch (error) {
//       console.error("Error updating form:", error);
//       setSaving(false);
//       alert("❌ Failed to save form. Check console.");
//     }
//   };

//   if (!formData) return <div>Loading form...</div>;

//   const currentTheme =
//     appliedTheme || themes.find((t) => t.key === selectedTheme) || themes[0];

//   const publicUrl = `/nitrr-form/${formData.id}`;
//   const shareLink = `${typeof window !== "undefined" ? window.location.origin : ""}${publicUrl}`;

//   return (
//     <div className="p-10">
//       <h2
//         className="flex gap-2 items-center my-5 cursor-pointer hover:font-bold"
//         onClick={() => router.back()}
//       >
//         <ArrowLeft /> Back
//       </h2>

//       <div className="flex gap-3 mb-5">
//         <Link href={publicUrl} target="_blank">
//           <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
//             <SquareArrowOutUpRight className="h-5 w-5" />
//             Live Preview
//           </button>
//         </Link>

//         <button
//           onClick={() => navigator.clipboard.writeText(shareLink)}
//           className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
//         >
//           <Share className="h-5 w-5" />
//           Share
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//         {/* Left control panel */}
//         <div className="p-5 border rounded-lg shadow-md bg-white">
//           <h3 className="font-semibold text-lg mb-2">
//             <Controller selectedTheme={selectedTheme} onChange={setSelectedTheme} />
//           </h3>
//           <p className="text-gray-600 text-sm mb-4">
//             Edit your form and click “Save Form” to update it.
//           </p>

//           <button
//             onClick={() => handleSaveForm(jsonForm)}
//             disabled={saving}
//             className={`w-full px-4 py-2 rounded-md text-white font-semibold ${
//               saving
//                 ? "bg-gray-400"
//                 : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             {saving ? "Saving..." : "💾 Save Form"}
//           </button>
//         </div>

//         {/* Right area — neutral container */}
//         <div className="md:col-span-2 border rounded-lg p-4 h-screen overflow-y-auto bg-white">
//           <FormUi
//             jsonForms={jsonForm}
//             onChange={(updated) => setJsonForm(updated)}
//             theme={currentTheme}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default EditForm;


"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { db } from "@/app/configs/index";
import { jsonForms } from "@/app/configs/schema";
import { eq, and } from "drizzle-orm";
import { ArrowLeft, Share, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import FormUi from "../_components/FormUi";
import Controller from "../_components/Controller";
import { themes } from "@/app/_data/Themes";

function EditForm({ params }) {
  const { user } = useUser();
  const [formData, setFormData] = useState(null);
  const [jsonForm, setJsonForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("light");
  const [appliedTheme, setAppliedTheme] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (user && params?.formId) {
      getFormData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, params]);

  useEffect(() => {
    const resolveTheme = () => {
      if (selectedTheme === "system" && typeof window !== "undefined") {
        const prefersDark =
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        const key = prefersDark ? "dark" : "light";
        return themes.find((t) => t.key === key) || themes[0];
      }
      return themes.find((t) => t.key === selectedTheme) || themes[0];
    };

    setAppliedTheme(resolveTheme());

    let mq;
    if (selectedTheme === "system" && typeof window !== "undefined") {
      mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => setAppliedTheme(resolveTheme());
      mq.addEventListener
        ? mq.addEventListener("change", handler)
        : mq.addListener(handler);
      return () => {
        mq.removeEventListener
          ? mq.removeEventListener("change", handler)
          : mq.removeListener(handler);
      };
    }
  }, [selectedTheme]);

  const getFormData = async () => {
    try {
      const result = await db
        .select()
        .from(jsonForms)
        .where(
          and(
            eq(jsonForms.id, Number(params.formId)),
            eq(
              jsonForms.createdBy,
              user?.primaryEmailAddress?.emailAddress || ""
            )
          )
        );

      if (!result.length) {
        setFormData(null);
        setJsonForm(null);
        return;
      }

      const first = result[0];
      setFormData(first);

      if (first?.theme) {
        setSelectedTheme(first.theme);
      }

      if (first?.jsonform) {
        try {
          const parsed =
            typeof first.jsonform === "string"
              ? JSON.parse(first.jsonform)
              : first.jsonform;
          setJsonForm(parsed);
        } catch (e) {
          console.error("Failed to parse jsonform:", e);
          setJsonForm(null);
        }
      } else {
        setJsonForm(null);
      }
    } catch (err) {
      console.error("Error fetching form data:", err);
      setFormData(null);
      setJsonForm(null);
    }
  };

  const handleSaveForm = async (updatedFormJson) => {
    try {
      setSaving(true);
      await db
        .update(jsonForms)
        .set({
          jsonform: JSON.stringify(updatedFormJson),
          updatedAt: new Date().toISOString(),
          theme: selectedTheme,
        })
        .where(eq(jsonForms.id, Number(params.formId)));

      setSaving(false);
      alert("✅ Form saved successfully!");
      await getFormData();
    } catch (error) {
      console.error("Error updating form:", error);
      setSaving(false);
      alert("❌ Failed to save form. Check console.");
    }
  };

  if (!formData) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  const currentTheme =
    appliedTheme || themes.find((t) => t.key === selectedTheme) || themes[0];

  const publicUrl = `/nitrr-form/${formData.id}`;
  const shareLink = `${typeof window !== "undefined" ? window.location.origin : ""}${publicUrl}`;

  return (
    <div className="p-6 md:p-10 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Edit Form</h1>
              <p className="text-muted-foreground mt-1">Customize your form and preview changes</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href={publicUrl} target="_blank">
                <Button variant="outline" className="flex items-center gap-2">
                  <SquareArrowOutUpRight className="w-4 h-4" />
                  Live Preview
                </Button>
              </Link>

              <Button
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  alert("Link copied to clipboard!");
                }}
                variant="outline"
                className="flex items-center gap-2 hover:bg-green-50 hover:text-green-600 hover:border-green-300"
              >
                <Share className="w-4 h-4" />
                Share Link
              </Button>

              <Button
                onClick={() => handleSaveForm(jsonForm)}
                disabled={saving}
                className="gradient-button shadow-md hover:shadow-lg transition-all"
              >
                {saving ? "Saving..." : "💾 Save Form"}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Control Panel */}
          <div className="lg:col-span-1">
            <div className="modern-card p-6 sticky top-6">
              <h3 className="font-semibold text-lg mb-4 text-foreground">Theme Settings</h3>
              <Controller selectedTheme={selectedTheme} onChange={setSelectedTheme} />
              
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">
                  💡 Changes are saved automatically
                </p>
                <div className="bg-accent/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">
                    Form ID: <span className="font-mono font-semibold">{formData.id}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Preview */}
          <div className="lg:col-span-3">
            <div className="modern-card p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <FormUi
                jsonForms={jsonForm}
                onChange={(updated) => setJsonForm(updated)}
                theme={currentTheme}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditForm;
