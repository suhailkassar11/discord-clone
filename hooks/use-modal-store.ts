import { Server } from "@prisma/client";
import {create} from "zustand";

export type ModalType="createServer" | "invite" | "editServer" | "members" | "createChannel" | "leaveServer" | "deleteServer"

interface ModalData{
    server?:Server
}
interface ModalStore{
    type:ModalType | null;
    data:ModalData;
    isOpen: boolean;
    onOpen:(type:ModalType,data?:ModalData)=>void;
    onClose:()=>void;
}
export const useModal= create<ModalStore>((set)=>({
    data:{},
    type:null,
    isOpen:false,
    onOpen:(type,data={})=>set({isOpen:true,type,data}),
    onClose:()=>set({isOpen:false,type:null}),

}))
