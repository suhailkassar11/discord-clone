import { Server as NextServer,Socket } from "net";
import { NextApiResponse } from "next";
import {Server as SocketIoServer} from "socket.io"
import { Member, Profile, Server } from "@prisma/client";

export type ServerWithMembersWithProfiles=Server & {
    members:(Member & {profile:Profile})[]
}

export type NextApiResponseServerIo=NextApiResponse & {
    socket:Socket & {
        server: NextServer & {
            io:SocketIoServer;
        }
    }
}