import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
    return (
        <div className="flex h-[700px] w-full">
            <div className="w-full hidden md:inline-block">
                <Image
                    className="h-full"
                    src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png"
                    alt="leftSideImage"
                    width={500}
                    height={700}
                />
            </div>
        
            <div className="w-full flex flex-col items-center justify-center">
                <SignIn path="/sign-in" />
            </div>
        </div>
    );
};


