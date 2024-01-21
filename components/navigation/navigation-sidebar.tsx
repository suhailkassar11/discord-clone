import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import NavigationAction from "./navigation-action";
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area";
import NavigationItem from "./navigation-item";
import { ModeToggle } from "../mode-toggle";
import { UserButton } from "@clerk/nextjs";

export const NavigationSidebar = async() => {
    const profile=await currentProfile()
    if(!profile){
        return redirect("/")
    }
    const servers=await db.server.findMany({
        where:{
            members:{
                some:{
                    profileId:profile.id,
                }
            }
        }
    })

    return ( 
        <div className="dark:bg-[#1E1F22] bg-[#E3E5E8] py-3 w-full text-primary h-full space-y-4 flex flex-col items-center">
            <NavigationAction/>
            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"/>
            <ScrollArea className="flex-1 w-full">
                {servers.map((server)=>(
                    <div key={server.id}>
                        <NavigationItem id={server.id} imageUrl={server.imageUrl} name={server.name}/>
                    </div>
                ))}
            </ScrollArea>
            <div className="mt-auto pb-3 flex flex-col items-center gap-y-4">
                <ModeToggle/>
                <UserButton afterSignOutUrl="/" appearance={{
                    elements:{
                        avatarBox:"h-[48px] w-[48px]"
                    }
                }}/>
            </div>
        </div>
     );
}
 
export default NavigationSidebar ;