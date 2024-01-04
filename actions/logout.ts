"use server";

import {signOut} from "@/auth";


export const logout = async () =>{
    //if you want to do some server stuff before sign out
    await signOut();
}