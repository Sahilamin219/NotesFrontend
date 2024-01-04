"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import Link from 'next/link'
import Cookies from 'js-cookie';
import { redirect } from "next/navigation";

export default function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loginSuccess, setLoginSuccess] = useState(false);

    useEffect(()=>{
        if(loginSuccess){
            redirect("/")
        }
    },[loginSuccess])

    async function handleLogin(){
        let data;
        try {
            const response = await fetch('http://0.0.0.0:8000/api/auth/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: username,
                password: password,
              }),
            });
      
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
      
            data = await response.json();
            console.log('Access Token:', data.access_token); // The access token received from the server
            // You can handle the successful login here
      
          } catch (error) {
            console.error('Error:', error);
            // You can handle errors here, e.g., show an error message to the user
        }
        const token = Cookies.set('token',data.access_token)
        setLoginSuccess(true)
    }


    return <>
        <div className="w-1/2 mx-auto ">
            <div className="mt-8 flex-col space-y-2 mb-8">
                <p>Login</p>
                <Input placeholder="username" onChange={e => setUsername(e.target.value)}></Input>
                <Input placeholder="password" type="password" onChange={e => setPassword(e.target.value)}></Input>
                <Button onClick={handleLogin}>Login</Button>
            </div>


            <Link href="/signin" replace className="border-2 p-3 rounded-md hover:bg-black hover:text-white">
      Register New User
    </Link>
        </div>

    </>
}