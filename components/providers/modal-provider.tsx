"use client";

import { useEffect, useState } from "react";
import CreateServerModal from "../modals/create-server-modal";
import InviteModal from "../modals/create-invite-modal";
import CreateEditServerModal from "../modals/create-editserver-modal";
import MembersModal from "../modals/member-modal";

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
        </>
    )
}