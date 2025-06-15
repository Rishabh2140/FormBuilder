// "use client"
// import React, { useEffect } from 'react'
// import Image from 'next/image'
// import { Button } from '@/components/ui/button'
// import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
// import Link from 'next/link'


// function Header() {
//     const { user, isSignedIn } = useUser();
//     const path = usePathname();
//     useEffect(()=>{
//         console.log(path)
//     },[])
//   return !path.includes('nitrr-form') &&  (
//     <div className='p-5 border-b shadow-sm'>
//         <div className='flex items-center justify-between'>
//             <Image src={'/logo.svg'} 
//             width={30} height={30} alt='logo' />
//             {isSignedIn?
//             <div className='flex items-center gap-5'>
//                 <Link href={'/dashboard'}>
//                     <Button variant="outline">DashBoard</Button>
                
//                 </Link>
//                 <UserButton/>

//             </div>:
//             <SignInButton>
//                 <Button>Get Started</Button>
//             </SignInButton>
//             }
//         </div>
//     </div>
//   )
// }

// export default Header

"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormInput } from "lucide-react";

function Header() {
  const { user, isSignedIn } = useUser();
  const path = usePathname();

  useEffect(() => {
    console.log("Current path:", path);
  }, [path]);

  // Hide Header on public /nitrr-form/[formId] routes
  if (path.includes("nitrr-form")) return null;

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="flex items-center gap-3">
            <Image 
              src="/nitrr.svg" 
              width={45} 
              height={45} 
              alt="NIT Raipur Logo"
              className="object-contain"
            />
            <Image 
              src="/icell-coloured-logo.webp" 
              width={50} 
              height={50} 
              alt="Innovation Cell Logo"
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-xl text-foreground tracking-tight">
              Form Builder
            </h1>
            <p className="text-xs text-muted-foreground -mt-0.5">NIT Raipur</p>
          </div>
        </Link>

        {/* Navigation - Removed Dashboard and Responses links */}

        {/* Actions */}
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <>
              <Link href="/dashboard">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hidden sm:flex items-center gap-2"
                >
                  <FormInput className="w-4 h-4" />
                  My Forms
                </Button>
              </Link>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9"
                  }
                }}
              />
            </>
          ) : (
            <SignInButton mode="modal">
              <Button className="gradient-button shadow-md hover:shadow-lg transition-all">
                Get Started
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
