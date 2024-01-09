"use client"

import { DialogTitle} from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "../ui/dialog";
import { Form,FormControl,FormField,FormItem,FormLabel,FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

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
   

    
    const form=useForm({
        resolver:zodResolver(formSchema),
        defaultValues: {
            name:"",
            imageUrl:"",
        }
    })

    const isLoading=form.formState.isSubmitting;

    const onSubmit=async(values:z.infer<typeof formSchema>)=>{
        console.log(values)
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
                                    TODO: Image Upload
                                </div>
                                <FormField control={form.control} name="name" render={({field})=>(
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            server name
                                        </FormLabel>
                                        <FormControl>
                                            <Input className="bg-zinc-300/50 border-0 focus-visible:ring-offset-0" placeholder="enter server name " disabled={isLoading}/>
                                        </FormControl>
                                    </FormItem>
                                )}>

                                </FormField>
                            </div>
                        </form>
                    </Form>
            </DialogContent>
        </Dialog>
     );
}
 
export default InitiaModal;