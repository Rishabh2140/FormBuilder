import { NextResponse } from "next/server";
import { db } from "@/app/configs/index";
import { jsonForms } from "@/app/configs/schema";
import { and, eq } from "drizzle-orm";

export async function DELETE(req, { params }) {
  try {
    const id = Number(params?.id);
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
    }

    // Optional ownership check via header
    const email = req.headers.get("x-user-email");
    const whereClause = email
      ? and(eq(jsonForms.id, id), eq(jsonForms.createdBy, email))
      : eq(jsonForms.id, id);

    const deleted = await db.delete(jsonForms).where(whereClause).returning();

    if (!deleted?.length) {
      return NextResponse.json({ ok: false, error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, deleted: deleted[0] }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/forms/[id] error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
