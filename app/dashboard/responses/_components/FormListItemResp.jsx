"use client";

import React, { useEffect, useMemo, useState } from "react";
import { db } from "@/app/configs";
import { userResponses } from "@/app/configs/schema";
import { eq } from "drizzle-orm";

function FormListItemResp({ formRecord }) {
  const [responses, setResponses] = useState([]);
  const formId = formRecord?.id ?? null;

  // Parse form title/subheading from jsonform
  const { title, subheading } = useMemo(() => {
    let parsed = {};
    try {
      parsed =
        typeof formRecord?.jsonform === "string"
          ? JSON.parse(formRecord.jsonform)
          : formRecord?.jsonform || {};
    } catch (e) {
      parsed = {};
    }
    return {
      title: parsed?.form_title ?? "Untitled Form",
      subheading: parsed?.form_subheading ?? "",
    };
  }, [formRecord]);

  useEffect(() => {
    const load = async () => {
      if (!formId) return;
      const rows = await db
        .select()
        .from(userResponses)
        .where(eq(userResponses.formId, formId));
      setResponses(rows || []);
    };
    load();
  }, [formId]);

  // Export responses to CSV
  const onExportCSV = () => {
    if (!responses.length) return;

    const parseJSONSafe = (v) => {
      try {
        return typeof v === "string" ? JSON.parse(v) : v || {};
      } catch {
        return {};
      }
    };

    // Flatten each response: include meta fields + parsed jsonResponse
    const flat = responses.map((r) => ({
      id: r.id,
      formId: r.formId,
      createdBy: r.createdBy,
      createdAt: r.createdAt,
      ...parseJSONSafe(r.jsonResponse),
    }));

    // Collect headers from union of keys
    const headers = Array.from(
      flat.reduce((set, row) => {
        Object.keys(row).forEach((k) => set.add(k));
        return set;
      }, new Set())
    );

    // Build CSV rows
    const esc = (val) => {
      const s = val == null ? "" : String(val);
      // Escape quotes and wrap in quotes if needed
      if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };

    const csvLines = [
      headers.join(","), // header row
      ...flat.map((row) => headers.map((h) => esc(row[h])).join(",")),
    ];
    const csv = csvLines.join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `form-${formId}-responses.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border shadow-sm rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {subheading && <p className="text-sm text-gray-600">{subheading}</p>}
          <p className="mt-2 text-xs text-gray-500">
            Form ID: {formId ?? "—"}
          </p>
        </div>

        <div className="text-right">
          <div className="text-sm">
            Total responses: <strong>{responses.length}</strong>
          </div>
          <button
            onClick={onExportCSV}
            disabled={!responses.length}
            className="mt-2 px-3 py-2 rounded bg-primary text-white disabled:opacity-50"
          >
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}

export default FormListItemResp;