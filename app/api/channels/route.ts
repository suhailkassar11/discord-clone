import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { MemberRole } from "@prisma/client"
import { NextResponse } from "next/server"

export const POST=async(req:Request)=>{
    try {
        const profile= await currentProfile()
        const {name,type}=await req.json()
        const {searchParams}=new URL(req.url)
        const serverId=searchParams.get("serverId")

        if(!profile){
            return new NextResponse('{"error":"no_auth"}',{status:401})
        }
        if(!serverId){
            return new NextResponse('server ID is missing',{status:400})
        }
        if(name==='general'){
            return new NextResponse("Name cannot be 'general'",{status:400})
        }

        const server= await db.server.update({
            where:{
                id:serverId,
                members:{
                    some:{
                        profileId:profile.id,
                        role:{
                            in:[MemberRole.ADMIN,MemberRole.MODERATOR]
                        }
                    }
                }

            },
            data:{
                channels:{
                    create:{
                        name,
                        type,
                        profileId:profile.id
                    }
                }
            }
        })

        return NextResponse.json(server)
    } catch (error) {
        console.log("[ERROR IN CREATING CHANNEL]",error)
        return new NextResponse("Internal Server Error",{status:500})
    }
}