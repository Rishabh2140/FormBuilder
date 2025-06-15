"use client";
import { db } from '@/app/configs';
import { jsonForms, userResponses } from '@/app/configs/schema';
import React, { useEffect, useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function Responses() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const formIdParam = searchParams.get('formId');
  const formId = formIdParam ? Number(formIdParam) : null;

  const [formList, setFormList] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) getFormList(); }, [user]);

  const getFormList = async () => {
    const result = await db
      .select()
      .from(jsonForms)
      .where(eq(jsonForms.createdBy, user?.primaryEmailAddress?.emailAddress));
    setFormList(result);
  };

  useEffect(() => {
    const load = async () => {
      if (!formId) { setResponses([]); return; }
      setLoading(true);
      try {
        const rows = await db
          .select()
          .from(userResponses)
          .where(eq(userResponses.formId, formId));
        setResponses(rows || []);
      } finally {
        setLoading(false);
      }
    };
    if (user) load();
  }, [user, formId]);

  const selectedForm = useMemo(
    () => (formId ? formList.find(f => f.id === formId) : null),
    [formList, formId]
  );

  const parsedSelected = useMemo(() => {
    let parsed = {};
    try {
      parsed = typeof selectedForm?.jsonform === "string"
        ? JSON.parse(selectedForm.jsonform)
        : selectedForm?.jsonform || {};
    } catch { parsed = {}; }
    return {
      title: parsed?.form_title ?? "Untitled Form",
      subheading: parsed?.form_subheading ?? ""
    };
  }, [selectedForm]);

  const exportCSV = () => {
    if (!responses.length || !formId) return;
    const parseJSONSafe = (v) => {
      try { return typeof v === "string" ? JSON.parse(v) : v || {}; } catch { return {}; }
    };
    const flat = responses.map(r => ({
      id: r.id,
      formId: r.formId,
      createdBy: r.createdBy,
      createdAt: r.createdAt,
      ...parseJSONSafe(r.jsonResponse),
    }));
    const headers = Array.from(flat.reduce((s, r) => { Object.keys(r).forEach(k => s.add(k)); return s; }, new Set()));
    const esc = (v) => {
      const s = v == null ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [headers.join(","), ...flat.map(r => headers.map(h => esc(r[h])).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `form-${formId}-responses.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl flex items-center justify-between'>
        Responses
      </h2>

      {!formId && (
        <div className="mt-6 space-y-3">
          {formList.length > 0 ? (
            formList.map((form) => {
              let parsed = {};
              try {
                parsed = typeof form.jsonform === "string" ? JSON.parse(form.jsonform) : form.jsonform;
              } catch {}
              return (
                <Link
                  key={form.id}
                  href={`/dashboard/responses?formId=${form.id}`}
                  className="block p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="text-lg font-semibold">
                    {parsed?.form_title ?? "Untitled Form"}
                  </div>
                  {parsed?.form_subheading && (
                    <div className="text-sm text-gray-600">
                      {parsed.form_subheading}
                    </div>
                  )}
                </Link>
              );
            })
          ) : (
            <h3>No forms found.</h3>
          )}
        </div>
      )}

      {formId && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xl font-semibold">{parsedSelected.title}</div>
              {parsedSelected.subheading && (
                <div className="text-sm text-gray-600">{parsedSelected.subheading}</div>
              )}
              <div className="text-xs text-gray-500 mt-1">Form ID: {formId}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/dashboard/responses')}
                className="px-3 py-2 rounded border"
              >
                ← Back
              </button>
              <button
                onClick={exportCSV}
                disabled={!responses.length}
                className="px-3 py-2 rounded bg-primary text-white disabled:opacity-50"
              >
                Export CSV
              </button>
            </div>
          </div>

          {loading ? (
            <div>Loading responses...</div>
          ) : responses.length === 0 ? (
            <div>No responses yet.</div>
          ) : (
            <div className="space-y-3">
              {responses.map((r) => {
                let data = {};
                try { data = typeof r.jsonResponse === 'string' ? JSON.parse(r.jsonResponse) : r.jsonResponse || {}; } catch {}
                return (
                  <div key={r.id} className="p-4 border rounded">
                    <div className="text-xs text-gray-500 mb-2">
                      Response ID: {r.id} • {r.createdAt}
                    </div>
                    <pre className="text-sm whitespace-pre-wrap break-words">{JSON.stringify(data, null, 2)}</pre>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Responses;