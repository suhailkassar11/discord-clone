import { Hash } from "lucide-react";

interface ChatWelcomeProps {
  type: "channel" | "conversation";
  name: string;
}

const ChatWelcome = ({ type, name }: ChatWelcomeProps) => {
  return (
    <div>
      {type === "channel" && (
        <div className="h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center">
          <Hash className="h-12 w-12 text-white" />
        </div>
      )}
      <p className="text-xl md:text-3xl font-bold">
        {type==="channel" ? "welcome to #" : ""}{name}
      </p>
      <p>
        {type==="channel" ? `this is the start of the #${name} channel`:`this is the start of your conversation with ${name}`}
      </p>
    </div>
  );
};

export default ChatWelcome;