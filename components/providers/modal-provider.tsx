"use client";

import { useEffect, useState } from "react";
import CreateServerModal from "../modals/create-server-modal";
import InviteModal from "../modals/create-invite-modal";
import CreateEditServerModal from "../modals/create-editserver-modal";
import MembersModal from "../modals/member-modal";
import CreateChannelModal from "../modals/create-channel-modal";
import LeaveModal from "../modals/create-leave-modal";
import DeleteServer from "../modals/delete-server-modal";
import DeleteChannel from "../modals/delete-channel-modal";
import CreateEditChannelModal from "../modals/edit-channel-modal";
import MessageFileModal from "../modals/message-file-modal";

export const ModalProvider=()=>{
    const [isMounted,setIsMounted]=useState(false)
    useEffect(()=>{
        setIsMounted(true)
    },[])
    if(!isMounted){
        return null
    }
    return(
        <>
            <CreateServerModal/>
            <InviteModal/>
            <CreateEditServerModal/>
            <MembersModal/>
            <CreateChannelModal/>
            <LeaveModal/>
            <DeleteServer/>
            <DeleteChannel/>
            <CreateEditChannelModal/>
            <MessageFileModal/>
        </>
    )
}