"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/type";
import { ScrollArea } from "../ui/scroll-area";
import UserAvatar from "../user-avatar";
import { Check, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";

const roleIconMap={
    "GUEST":null,
    "MODERATOR":<ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"/>,
    "ADMIN":<ShieldAlert className="h-4 w-4 ml-2 text-rose-500"/>,
}

export const MembersModal = () => {
  const { onClose, isOpen, type, data } = useModal();
  const [loadingId,setLoadingId]=useState("")
  const isModalOpen = isOpen && type === "members";
  const { server } = data as { server: ServerWithMembersWithProfiles };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="font-bold text-center text-xl">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-center">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-8">
            {server?.members?.map((member)=>(
                <div key={member.id} className="flex items-center gap-x-2 mb-6">
                    <UserAvatar src={member.profile.imageUrl} className=""/>
                    <div className="flex flex-col gap-y-1">
                        <div className="text-xs font-semibold flex items-cener gap-x-1">
                            {member.profile.name}
                            {roleIconMap[member.role]}
                        </div>
                        <p className="text-xs text-zinc-500">
                            {member.profile.email}
                        </p>
                    </div>
                    {server.profileId !== member.profileId && loadingId !== member.id && (
                        <div className="ml-auto">
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <MoreVertical className="h-4 w-4 text-zinc-500"/>
                                </DropdownMenuTrigger>
                               <DropdownMenuContent side="left">
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger className="flex items-center">
                                            <ShieldQuestion className="w-4 h-4 mr-2"/>
                                            <span>Role</span>
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem >
                                                    <Shield className="h-4 w-4 mr-2"/>
                                                    guest
                                                    {member?.role==="GUEST" && (
                                                        <Check className="h-4 w-4 ml-auto"/>
                                                    )}
                                                </DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                               </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>
            ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MembersModal;
