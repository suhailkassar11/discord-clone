"use client";

import axios from "axios";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { ChannelType } from "@prisma/client";
import qs from "query-string";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect } from "react";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "server name is required",
    })
    .refine((name) => name !== "general", {
      message: "Channel name cannot be 'general'",
    }),
  type: z.nativeEnum(ChannelType),
});

export const CreateEditChannelModal = () => {
  const router = useRouter();
  const { onClose, isOpen, type ,data} = useModal();
  const isModalOpen = isOpen && type === "editChannel";
  const {server,channel}=data
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: channel?.type || ChannelType.TEXT,
    },
  });
  useEffect(()=>{
    if(channel){
      form.setValue("name",channel.name)
      form.setValue("type",channel.type)
    }
  },[form,channel])

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
    
      const url=qs.stringifyUrl({
        url:`/api/channels/${channel?.id}`,
        query:{
            serverId:server?.id
        }
      })
      await axios.patch(url, values);
      form.reset();
      router.refresh();
      onClose();
    } catch (error) {}
  };
  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="font-bold text-center text-xl">
            Edit Channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-zinc-300/50 border-0 focus-visible:ring-offset-0"
                        placeholder="enter server name "
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel Type</FormLabel>
                    <Select  disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                      <SelectTrigger className="bg-zinc-300/50 border-0 focus-visible:ring-offset-0">
                        <SelectValue placeholder="Channel Type" />
                      </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((type,index)=>(
                        <SelectItem key={index} value={type}>{type.toLowerCase()}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="primary">save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditChannelModal;
