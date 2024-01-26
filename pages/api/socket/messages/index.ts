import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/type";
import { NextApiRequest} from "next";

const handler=async(req:NextApiRequest,res:NextApiResponseServerIo)=>{
    if(req.method!=="POST"){
        return res.status(405).json({message:"Method not allowed"})
    }
    try {
        const {content,fileUrl,deleted}=req.body;
        const {serverId,channelId}=req.query;
        const profile = await currentProfilePages(req)
        if(!profile){
            return res.status(400).json("Unauthorized")
        }
        if(!serverId){
            return res.status(400).json({error:"server ID Missing"})
        }
        if(!channelId){
            return res.status(400).json({error:"channel ID Missing"})
        }
        if(!content){
            return res.status(400).json({error:"content is Missing"})
        }
        const server=await db.server.findFirst({
            where:{
                id:serverId as string,
                members:{
                    some:{
                        profileId:profile.id
                    }
                }
            },
            include:{
                members:true
            }
        })

    if(!server){
        return res.status(400).json({error:"server not found"})
    }
    const channel=await db.channel.findFirst({
        where:{
            id:channelId  as string,
            serverId:serverId  as string
        }
    });
    if(!channel){
        return res.status(400).json({error:"channel not found"})
    }
    const member=server.members.find((member)=>member.profileId===profile.id );

    if(!member){
        return res.status(400).json({error:"member not found"})
    }

    const message = await db.message.create({
        data:{
            content,
            fileUrl,
            channelId:channelId as string,
            memberId:member.id,
            
        },
        include:{
            member:{
                include:{
                    profile:true
                }
            },
        }
    })
    const channelkey=`chat:${channelId}:messages`
    res?.socket?.server?.io?.emit(channelkey,message)
    return res.status(200).json(message)
    } catch (error) {
        console.log(error)
        return res.status(500).json({error})
    }
}

export default handler