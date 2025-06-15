// app/api/submit-response/route.js
import { NextResponse } from "next/server";
import { db } from "@/app/configs/index";
import { userResponses } from "@/app/configs/schema";

export async function POST(req) {
  try {
    const body = await req.json();
    // body: { formId, jsonResponse, createdBy }
    const jsonResponseStr = typeof body.jsonResponse === "string" ? body.jsonResponse : JSON.stringify(body.jsonResponse || {});
    const createdBy = body.createdBy ?? "anonymous";
    const createdAt = new Date().toISOString();

    const inserted = await db.insert(userResponses).values({
      jsonResponse: jsonResponseStr,
      createdBy,
      createdAt,
      formId: body.formId ? Number(body.formId) : null, // optional column if you add it
    }).returning();

    return NextResponse.json({ ok: true, inserted: inserted }, { status: 201 });
  } catch (err) {
    console.error("submit-response error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
