"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import FileUpload from "../file-upload";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog,DialogTitle, DialogContent, DialogDescription, DialogFooter, DialogHeader } from "../ui/dialog";
import { Form,FormControl,FormField,FormItem,FormLabel,FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const formSchema=z.object({
    name:z.string().min(1,{
        message:"server name is required"
    }),
    imageUrl:z.string().min(1,{
        message:"server image is required"
    })
})

export const InitiaModal = () => {
    const[isMounted,setIsMounted]=useState(false)
    const router=useRouter()

    
    const form=useForm({
        resolver:zodResolver(formSchema),
        defaultValues: {
            name:"",
            imageUrl:"",
        }
    })

    const isLoading=form.formState.isSubmitting;

    const onSubmit=async(values:z.infer<typeof formSchema>)=>{
        try {
            await axios.post("/api/servers",values)
            form.reset();
            router.refresh()
            window.location.reload()
        } catch (error) {
            
        }
    }
    
    
    useEffect(()=>{
        setIsMounted(true)
    },[])
    if(!isMounted){
        return null
    }
    
    return ( 
        <Dialog open>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="font-bold text-center text-xl">
                        Customize your server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        give your server a personality with a name and an image, You can always change it later
                    </DialogDescription>
                </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" >
                            <div className="space-y-8 px-6">
                                <div className="flex items-center justify-center text-center">
                                    <FormField control={form.control} name="imageUrl" render={({field})=>(
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload
                                                    endpoint="serverImage"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}/>
                                </div>
                                <FormField control={form.control} name="name" render={({field})=>(
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            server name
                                        </FormLabel>
                                        <FormControl>
                                            <Input className="bg-zinc-300/50 border-0 focus-visible:ring-offset-0" placeholder="enter server name " disabled={isLoading}
                                             {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                            </div>
                            <DialogFooter className="bg-gray-100 px-6 py-4">
                                <Button variant="primary">
                                    create
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
            </DialogContent>
        </Dialog>
     );
}
 
export default InitiaModal;