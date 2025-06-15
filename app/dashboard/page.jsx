import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import React from "react";
import FormList from "./_components/FormList";
import CreateForm from "./_components/CreateForm";

function DashBoard() {
    return (
        <div className="p-8 bg-background min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h1 className="font-bold text-3xl text-foreground mb-2">
                                Dashboard
                            </h1>
                            <p className="text-muted-foreground">
                                Manage and monitor your forms
                            </p>
                        </div>
                        <CreateForm />
                    </div>
                </div>

                {/* Forms Grid */}
                <div className="mt-8">
                    <FormList />
                </div>
            </div>
        </div>
    )
}

export default DashBoard

