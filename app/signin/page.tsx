"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";

import { redirect } from "next/navigation";
import Link from 'next/link'
export default function SignIn() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [moveToLogin, setMoveToLogin] = useState(false);

    useEffect(()=>{
            if(moveToLogin){
                redirect("/login")
            }
    }, [moveToLogin])

    const handlesignIn = async() => {
        try {
            const response = await fetch('http://0.0.0.0:8000/api/auth/signup', {
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
      
            const data = await response.json();
            console.log(data.message); // The response from the server
            // You can handle the success response here
      
          } catch (error) {
            console.error('Error:', error);
            // You can handle errors here
        }
        setMoveToLogin(true)
    }


    return <>
        <div className="w-1/2 mx-auto ">
            <div className="mt-8 flex-col space-y-2 mb-8">
                <p>SignIn</p>
                <Input placeholder="username" onChange={e => setUsername(e.target.value)}></Input>
                <Input placeholder="password" type="password" onChange={e => setPassword(e.target.value)}></Input>
                <Button onClick={handlesignIn}>SignIn</Button>
            </div>


            <Link href="/login" replace className="border-2 p-3 rounded-md hover:bg-black hover:text-white">
                Already Registed, Go to login
            </Link>
        </div>

    </>
}