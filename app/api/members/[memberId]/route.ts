import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const DELETE=async(req:Request,{params}:{params:{memberId:string}})=>{
    try {
        const profile=await currentProfile()
        const {searchParams}=new URL(req.url)
        const serverId= searchParams.get("serverId")
        if(!profile){
            return new NextResponse("Not authenticated",{status:401})
        }
        if(!serverId){
            return new NextResponse("Server ID Missing",{status:400})
        }
        if(!params.memberId){
            return new NextResponse("Member ID missing",{status:400})
        }
        const server=await db.server.update({
            where:{
                id:serverId,
                profileId:profile.id
            },
            data:{
                members:{
                    deleteMany:{
                            id:params.memberId,
                            profileId:{
                                not:profile.id
                            }
                      
                    }
                }
            },
            include:{
                members:{
                    include:{
                        profile:true
                    },
                    orderBy:{
                        role:"asc"
                    }
                }
            }
        })
        return NextResponse.json(server)

    } catch (error) {
        console.log("[ERROR IN CHANGING ROLE]",error);
        return new NextResponse("Internal Server",{status:500})
        
    }
}
export const PATCH=async(req:Request,{params}:{params:{memberId:string}})=>{
    try {
        const profile=await currentProfile()
        const {role}= await req.json()
        const {searchParams}=new URL(req.url)
        const serverId= searchParams.get("serverId")
        if(!profile){
            return new NextResponse("Not authenticated",{status:401})
        }
        if(!serverId){
            return new NextResponse("Server ID Missing",{status:400})
        }
        if(!params.memberId){
            return new NextResponse("Member ID missing",{status:400})
        }
        const server=await db.server.update({
            where:{
                id:serverId,
                profileId:profile.id
            },
            data:{
                members:{
                    update:{
                        where:{
                            id:params.memberId,
                            profileId:{
                                not:profile.id
                            }
                        },
                        data:{
                            role
                        }
                    }
                }
            },
            include:{
                members:{
                    include:{
                        profile:true
                    },
                    orderBy:{
                        role:"asc"
                    }
                }
            }
        })
        return NextResponse.json(server)

    } catch (error) {
        console.log("[ERROR IN CHANGING ROLE]",error);
        return new NextResponse("Internal Server",{status:500})
        
    }
}