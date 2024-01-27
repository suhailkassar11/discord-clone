import { ChatHeader } from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface MemberPageProps {
  params: {
    serverId: string;
    memberId: string;
  };
  searchParams: {
    video?: boolean;
  };
}
const MemberIdPage = async ({ params, searchParams }: MemberPageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }
  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }
  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );
  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }
  const { memberOne, memberTwo } = conversation;
  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={otherMember.profile.name}
        imageUrl={otherMember.profile.imageUrl}
        type="conversation"
        serverId={params.serverId}
      />
      {searchParams.video && (
        <MediaRoom chatId={conversation.id} video={true} audio={true} />
      )}
      {!searchParams.video && (
        <>
          <ChatMessages
            name={otherMember.profile.name}
            member={currentMember}
            chatId={conversation.id}
            apiUrl="/api/direct-messages"
            socketUrl="/api/socket/direct-messages"
            socketQuery={{ conversationId: conversation.id }}
            paramKey="conversationId"
            paramValue={conversation.id}
            type="conversation"
          />
          <ChatInput
            apiUrl="/api/socket/direct-messages"
            name={otherMember.profile.name}
            query={{ conversationId: conversation.id }}
            type="conversation"
          />
        </>
      )}
    </div>
  );
};

export default MemberIdPage;
