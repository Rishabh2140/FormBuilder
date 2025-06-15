"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/app/configs/index";
import { jsonForms } from "@/app/configs/schema";
import { eq, desc } from "drizzle-orm";
import FormListItem from "./FormListItem";

function FormList() {
    const { user } = useUser();
    const [formList, setFormList] = useState([]);

    useEffect(() => {
        if (user) {
            GetFormList();
        }
    }, [user]);

    const GetFormList = async () => {
        // Resolve user email robustly
        const email =
            user?.primaryEmailAddress?.emailAddress ||
            user?.emailAddresses?.[0]?.emailAddress ||
            "";

        if (!email) {
            setFormList([]);
            return;
        }

        try {
            const result = await db
                .select({
                    id: jsonForms.id,
                    jsonform: jsonForms.jsonform,
                    createdBy: jsonForms.createdBy,
                    createdAt: jsonForms.createdAt,
                    updatedAt: jsonForms.updatedAt,
                    theme: jsonForms.theme,
                })
                .from(jsonForms)
                .where(eq(jsonForms.createdBy, email))
                .orderBy(desc(jsonForms.id));

            setFormList(result);
            console.log("FormList fetched:", result);
        } catch (err) {
            console.error("GetFormList error:", err);
            setFormList([]);
        }
    };

    // Remove deleted form locally after successful delete
    const handleDeleted = (deletedId) => {
        setFormList((prev) => prev.filter((f) => f.id !== deletedId));
    };

    // Normalize the incoming item into the shape FormListItem expects
    const normalizeForm = (item) => {
        const raw =
            item?.jsonform ??
            item?.form_json ??
            item?.formJson ??
            item?.formData ??
            item?.data;

        if (!raw) {
            if (item?.form_title || item?.form_subheading) return item;
            return {};
        }

        if (typeof raw === "string") {
            try {
                return JSON.parse(raw);
            } catch (e) {
                console.warn("Failed to parse form JSON:", e, raw);
                return {};
            }
        }

        if (typeof raw === "object") return raw;

        return {};
    };

    return (
        <div className="mt-5">
            {Array.isArray(formList) &&
                formList.map((item, idx) => {
                    const parsed = normalizeForm(item);
                    // console.log("FormList item (raw):", item, "=> parsed jsonform:", parsed);
                    return (
                        <div key={item?.id ?? idx}>
                            <FormListItem
                                formRecord={item}
                                jsonform={parsed}
                                onDeleted={handleDeleted}
                            />
                        </div>
                    );
                })}
        </div>
    );
}

export default FormList;