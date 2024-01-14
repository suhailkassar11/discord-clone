import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import {v4 as uuidv4} from "uuid";

export const PATCH=async(req:Request,{params}:{params:{serverId:string}})=>{
    try {
        const profile= await currentProfile()
        if(!profile){
            return new Response("Not Authenticated",{status:401})
        }

        if(!params.serverId){
            return new NextResponse("server ID missing",{status:400})
        }

        const server=await db.server.update({
            where:{
                id:params.serverId,
                profileId:profile.id
            },
            data:{
                inviteCode: uuidv4()
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log("[server_id]",error);
        return new NextResponse("Internal Error",{status:500})
        
    }
}