"use client";
import { CardWrapper } from "./Card-wrapper";
import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form,FormControl,FormField,FormItem,FormLabel,
FormMessage } from "../ui/form";
import { useState, useTransition } from "react";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../FormError";
import { FormSuccess } from "../form-success";
import { login } from "@/actions/login";
import { useSearchParams } from "next/navigation";
import Link from "next/link";



const LoginForm = () => {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
    ? "Email already in use with different provider"  : "" ;
    
    const [showTwoFactor,setShowTwoFactor] = useState(false);
    const [isPending,startTransition] = useTransition();
    const [error,setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
          email: "",
        },
      });

      const onSubmit = (values:z.infer<typeof LoginSchema>)=>{
        setError("");
        setSuccess("");

        startTransition(()=>{
            login(values, callbackUrl)
                .then((data)=>{
                    if (data?.error) {
                        form.reset();
                        setError(data.error);
                      }           
                      if (data?.success) {
                        form.reset();
                        setSuccess(data.success);
                      }
                      if(data?.twoFactor) {
                        setShowTwoFactor(true);
                      }
                })
                .catch(()=>setError("Something went wrong!"));

        });
      };


  return (
    <CardWrapper
    headerLabel="Welcome back"
    backButtonHref="/auth/register"
    backButtonLabel="Don't you have an account?"
    showSocial
    >
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6">
                <div className="space-y-4">
                  {showTwoFactor && (
                    <FormField 
                    control={form.control}
                    name="code"
                    render={({field}) =>(
                        <FormItem>
                            <FormLabel>Two Factor Code</FormLabel>
                            <FormControl>
                                <Input 
                                disabled={isPending}
                                {...field}
                                placeholder="123456"
                                />
                            </FormControl>
                            <FormMessage 
                            
                            />
                        </FormItem>
                    )}
                    />
                  )}
                  {!showTwoFactor && (
                        <>          
                        <FormField 
                          control={form.control}
                          name="email"
                          render={({field}) =>(
                              <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                      <Input 
                                      disabled={isPending}
                                      {...field}
                                      placeholder="John.doe@example.com"
                                      type="email"
                                      />
                                  </FormControl>
                                  <FormMessage 
                                  
                                  />
                              </FormItem>
                          )}
                          />
                           <FormField 
                          control={form.control}
                          name="password"
                          render={({field}) =>(
                              <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                      <Input 
                                      disabled={isPending}
                                      {...field}
                                      placeholder="******"
                                      type="password"
                                      />
                                  </FormControl>
                                  <Button size="sm" variant="link" asChild className="px-0 font-normal">
                                      <Link href="/auth/reset">
                                          Forgot Password?
                                      </Link>
                                  </Button>
                                  <FormMessage                           
                                  />
                              </FormItem>
                          )}
                          />
                          </>
                  )                
                    }
                </div>
                <FormError
                    message={error || urlError}
                    />
                <FormSuccess 
                message={success}
                />
                <Button type="submit" className="w-full"  disabled={isPending}>
                    {showTwoFactor ? "Confirm" : "Login"}
                </Button>
            </form>
        </Form>
    </CardWrapper>
  )
}

export default LoginForm