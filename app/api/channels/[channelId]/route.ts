import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { MemberRole } from "@prisma/client"
import { NextResponse } from "next/server"

export const DELETE=async(req:Request,{params}:{params:{channelId:string}})=>{
    try {
        const profile=await currentProfile()
        const {searchParams}=new URL(req.url)
        const serverId=searchParams.get("serverId")
        if(!profile){
            return new NextResponse("Unauthorized",{status:401})
        }
        if(!serverId){
            return new NextResponse("Server ID is missing",{status:401})
        }
        if(!params?.channelId){
            return new NextResponse("channel ID is missing",{status:401})
        }
        const server=await db.server.update({
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
                    delete:{
                        id:params.channelId,
                        name:{
                            not:"general"
                        }
                    }
                }
            }
            
        })
        return NextResponse.json(server)
    } catch (error) {
        console.log("[ERROR IN DELETING THE CHANNEL]");
        return new NextResponse("Internal error",{status:500})
    }
}
export const PATCH=async(req:Request,{params}:{params:{channelId:string}})=>{
    try {
        const profile=await currentProfile()
        const {searchParams}=new URL(req.url)
        const serverId=searchParams.get("serverId")
        const {type,name}=await req.json()
        if(!profile){
            return new NextResponse("Unauthorized",{status:401})
        }
        if(!serverId){
            return new NextResponse("Server ID is missing",{status:401})
        }
        if(!params?.channelId){
            return new NextResponse("channel ID is missing",{status:401})
        }
        if(name==='general'){
            return new NextResponse("name cannot be general",{status:400})
        }
        const server=await db.server.update({
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
                    update:{
                        where:{
                            id:params.channelId,
                            NOT:{
                                name:"general",
                            }
                        },
                        data:{
                            name,
                            type
                        }
                    }
                }
            }
            
        })
        return NextResponse.json(server)
    } catch (error) {
        console.log("[ERROR IN EDITING THE CHANNEL]");
        return new NextResponse("Internal error",{status:500})
    }
}