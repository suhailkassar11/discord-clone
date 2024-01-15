"use client"

import { DialogTitle} from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "../ui/dialog";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCcw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";


export const MembersModal = () => {
    const router=useRouter()
    const {onOpen,onClose,isOpen,type,data}=useModal()
    const [copied,setCopied]=useState(false)
    const [isLoading,setIsLoading]=useState(false)
    const isModalOpen=isOpen && type==="members"
    const origin=useOrigin()
    const {server}=data
    const inviteUrl=`${origin}/invite/${server?.inviteCode}`

    const onCopy=()=>{
        navigator.clipboard.writeText(inviteUrl)
        setCopied(true)

        setTimeout(()=>{setCopied(false)},1000);
    }
    
    const onNew=async()=>{
        try {
            setIsLoading(true)
            const response=await axios.patch(`/api/servers/${server?.id}/invite-code`)
            onOpen("invite",{server:response.data})
        } catch (error) {
            console.log(error)
        }finally{
            setIsLoading(false)
        }
    }
    
    return ( 
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="font-bold text-center text-xl">
                        Invite Friends
                    </DialogTitle>
                </DialogHeader>
                    <div className="p-6">
                        <Label className="uppercase text-xs font-semibold text-zinc-500 dark:text-secondary/70">
                            Server invite people
                        </Label>
                        <div className="flex border-0 items-center mt-2 gap-x-2">
                            <Input readOnly disabled={isLoading} className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" value={inviteUrl}/>
                            <Button disabled={isLoading} className={cn(copied?"bg-green-500":"bg-zinc-200/50")}  size="icon" >
                            {copied?<Check className=" h-4 w-4"/>: <Copy onClick={onCopy} className="h-4 w-4"/>}    
                           </Button>
                        </div>
                        <Button onClick={onNew} disabled={isLoading} >
                            generate another link <RefreshCcw className="ml-2 h-4 w-4"/>
                        </Button>
                    </div>
            </DialogContent>
        </Dialog>
     );
}
 
export default MembersModal;