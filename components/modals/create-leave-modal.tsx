"use client"

import { } from "@radix-ui/react-dialog";
import { Dialog,DialogTitle, DialogContent, DialogHeader, DialogFooter, DialogDescription } from "../ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";


export const LeaveModal = () => {
    const {onClose,isOpen,type,data}=useModal()
    const [isLoading,setIsLoading]=useState(false)
    const isModalOpen=isOpen && type==="leaveServer"
    const {server}=data
    const router=useRouter()
    const onConfirm=async()=>{
        try {
            setIsLoading(true)
            await axios.patch(`/api/servers/${server?.id}/leave`)
            router.refresh()
        } catch (error) {
            console.log(error);
        }finally{
            setIsLoading(false)
        }
    }
    return ( 
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="font-bold text-center text-xl">
                        Leave Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are yoy sure you want to leave <span className="text-indigo-500 font-semibold">{server?.name}</span>?
                    </DialogDescription>
                </DialogHeader>
                    <DialogFooter className="bg-gray-100 px-6 py-4">
                        <div className="flex items-center justify-between w-full">
                            <Button disabled={isLoading} onClick={onClose}>Cancel</Button>
                            <Button disabled={isLoading} onClick={()=>onConfirm()} variant="destructive">Confirm</Button>
                        </div>
                    </DialogFooter>
            </DialogContent>
        </Dialog>
     );
}
 
export default LeaveModal;