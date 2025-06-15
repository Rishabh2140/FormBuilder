// app/dashboard/_components/FormListItem.jsx
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Share2, Eye, Calendar, FileCheck } from "lucide-react";
import { RWebShare } from "react-web-share";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function FormListItem({ formRecord, jsonform, item, onDeleted }) {
  const router = useRouter();

  const record = formRecord ?? item ?? null;
  const recordId = record?.id ?? null;

  let raw = undefined;
  if (jsonform !== undefined) {
    raw = jsonform;
  } else if (record) {
    raw = record.jsonform ?? record.form_json ?? record.json;
  }

  let parsed = null;
  try {
    if (typeof raw === "string") parsed = JSON.parse(raw);
    else if (typeof raw === "object") parsed = raw;
  } catch (e) {
    console.error("Failed to parse form JSON:", e, raw);
  }

  const title = parsed?.form_title ?? "Untitled Form";
  const subheading = parsed?.form_subheading ?? "";

  const liveUrl = recordId ? `/nitrr-form/${recordId}` : "#";
  const editUrl = recordId ? `/edit-form/${recordId}` : "#";
  const responsesUrl = recordId ? `/dashboard/responses?formId=${recordId}` : "#";

  const handleDelete = async () => {
    if (!recordId) return;
    try {
      const res = await fetch(`/api/forms/${recordId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("Delete failed:", body);
        alert("Failed to delete form. See console for details.");
        return;
      }
      if (typeof onDeleted === "function") onDeleted(recordId);
      else router.refresh();
      alert("Form deleted successfully.");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete form. See console for details.");
    }
  };

  return (
    <div className="modern-card p-6 mb-4 hover:-translate-y-1 transition-all duration-200">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* Form Info */}
        <div className="flex-1 space-y-2">
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
          {subheading && (
            <p className="text-sm text-muted-foreground">{subheading}</p>
          )}
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
            {record?.createdAt && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{record.createdAt}</span>
              </div>
            )}
            {recordId && (
              <span className="bg-accent px-2 py-1 rounded-md">
                ID: {recordId}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Link href={liveUrl} target="_blank">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors" 
              disabled={!recordId}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Preview</span>
            </Button>
          </Link>

          <Link href={editUrl}>
            <Button 
              size="sm"
              className="flex items-center gap-2 bg-primary hover:bg-primary/90" 
              disabled={!recordId}
            >
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
          </Link>

          <RWebShare
            data={{
              text: `Check out this form: ${title}`,
              url: typeof window !== "undefined" ? window.location.origin + liveUrl : liveUrl,
              title: title,
            }}
            onClick={() => {
              console.log("Shared via web share");
            }}
          >
            <Button 
              variant="outline"
              size="sm"
              className="flex items-center gap-2 hover:bg-green-50 hover:text-green-600 hover:border-green-300 transition-colors" 
              disabled={!recordId}
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </RWebShare>

          <Link href={responsesUrl}>
            <Button 
              variant="outline"
              size="sm"
              className="flex items-center gap-2 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300 transition-colors" 
              disabled={!recordId}
            >
              <FileCheck className="w-4 h-4" />
              <span className="hidden sm:inline">See Responses</span>
            </Button>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors" 
                disabled={!recordId}
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Form</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete <strong>{title}</strong>? This action cannot be undone and all responses will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

export default FormListItem;
