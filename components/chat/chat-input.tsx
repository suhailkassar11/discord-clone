"use client";
interface ChatInputProps{
    apiUrl:string;
    query:Record<string ,any>;
    name:string;
    type: "conversation" | "channel"
}

const ChatInput = ({apiUrl,name,query,type}:ChatInputProps) => {
    return ( 
        <div className="">
            chat input
        </div>
     );
}
 
export default ChatInput;