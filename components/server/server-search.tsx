import { Search } from "lucide-react";

interface ServerSearchProps{
    data:{
        label:string;
        type:"channel" | "member";
        data:{
            icon:React.ReactNode;
            name:string;
            id:string;
        }[] | undefined
    }[]
}
const ServerSearch = ({data}:ServerSearchProps) => {
  return (
    <>
        <button className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
            <Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400"/>
            <p>
                search
            </p>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-foreground ml-auto">
                <span className="text-xs">CMD</span>K
            </kbd>
        </button>
    </>
  );
};

export default ServerSearch;
