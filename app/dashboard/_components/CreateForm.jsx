"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AiChatSession } from "@/app/configs/AiModals";
import { db } from "@/app/configs";
import { jsonForms } from "@/app/configs/schema";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";

const PROMPT = `
You are an AI form generator trained to create registration forms for college club and committee recruitments.

Given the description below, return a structured JSON object with:
- form_title
- form_subheading
- form_fields (array of fields)
Each field should have: name, label, placeholder, type, required, and options (if select/radio).

Return only the JSON object — no explanation text.
`;

function CreateForm() {
  const [openDialog, setOpenDialog] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const onCreateForm = async () => {
    try {
      setLoading(true);
      console.log("User input:", userInput);

      const result = await AiChatSession.sendMessage("Description: " + userInput + PROMPT);
      console.log("Full AI result:", result);

      const text = await result.response.text();
      console.log("AI response text:", text);

      if (text) {
        const resp = await db.insert(jsonForms).values({
          jsonform: text,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD/MM/YYYY"),
        }).returning({ id: jsonForms.id });

        console.log("✅ New Form Created, ID:", resp[0].id);

        if(resp[0].id){
            router.push('/edit-form/' + resp[0].id);
        }
      }
    } catch (error) {
      console.error("❌ Error while creating form:", error);
      alert("Failed to create form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button 
        onClick={() => setOpenDialog(true)}
        className="gradient-button shadow-md hover:shadow-lg transition-all"
        size="lg"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Create New Form
      </Button>
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Create New Form with AI
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Describe the form you want to create and our AI will generate it for you instantly.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Textarea
              className="min-h-[120px] text-base resize-none"
              onChange={(event) => setUserInput(event.target.value)}
              placeholder="Example: Create a registration form for Technical Club recruitment with fields for name, email, phone, year, branch, technical skills, and previous experience..."
              aria-label="Form Description"
            />
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 <strong>Tip:</strong> Be specific about the fields you need and their types (text, email, phone, dropdown, etc.)
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button 
              variant="outline" 
              onClick={() => setOpenDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              disabled={loading || !userInput.trim()} 
              onClick={onCreateForm}
              className="gradient-button min-w-[120px]"
            >
              {loading ? (
                <>
                  <Loader2 className='animate-spin mr-2' size={16} />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className='mr-2' size={16} />
                  Create
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateForm;
