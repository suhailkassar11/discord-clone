import { Member, MemberRole, Message, Profile } from "@prisma/client";
import UserAvatar from "../user-avatar";
import { Edit, File, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import ActionTooltip from "../action-tooltip";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ChatItemsProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currrentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  GUEST: null,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
};

const ChatItems = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currrentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemsProps) => {
  const [isEditting,setIsEditting]=useState()
  const [isDeleting,setIsDeleting]=useState()
  const fileType = fileUrl?.split(".").pop();
  const isAdmin = currrentMember.role === MemberRole.ADMIN;
  const isModerator = currrentMember.role === MemberRole.MODERATOR;
  const isOwner = currrentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPdf = fileType === "pdf" && fileUrl;
  const isImage = !isPdf && fileUrl;

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="font-semibold text-sm hover:underline cursor-pointer">
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-40 w-40"
            >
              <Image fill src={fileUrl} alt={content} className="object-cover"/>
            </a>
          )}
          {isPdf && (
            <div className="relative flex items-center p-2 mt-2 rouded-md bg-background/10">
            <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400"/>
            <a href={fileUrl} rel="noopener noreferrer" target="_blank" className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">
                PDF File
            </a>
            </div>
          )}
            {!isPdf && !isEditting && !isImage && (
                <p className={cn("text-sm text-zinc-600 dark:text-zinc-300", deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1")}>
                    {content}
                    {isUpdated && !deleted && (
                    <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                        (edited)
                    </span>
                    )}
                </p>
            )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
            {
                canEditMessage && (
                    <ActionTooltip label="Edit">
                        <Edit className="h-4 w-4 cursor-pointer ml-auto text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"/>
                    </ActionTooltip>
                )
            }
            <ActionTooltip label="Delete">
            <Trash className="h-4 w-4 cursor-pointer ml-auto text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"/>
            </ActionTooltip>
        </div>
      )}
    </div>
  );
};

export default ChatItems;
