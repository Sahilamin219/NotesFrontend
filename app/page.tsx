"use client";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";


export default function Main() {
  const [token, changeToken] = useState(true);
  const [username, setUsername] = useState("");
  const [refresh, setRefresh] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState([{
    "content": "this is a note"
  },
{
  "content":"this is note2"
}])
  useEffect(() => {
    // alert("data");
    const token = Cookies.get('token')
    if (!token) {
      redirect('/login')
    }
    const decoded = jwtDecode(token);
    if (!decoded['sub']) {
      redirect('/login')
    }
    else {

      const fetchData = async () => {
        try {
          console.log('token stored: ' + token);
          // Make your API call using fetch or any other HTTP library
          const response = await fetch('http://0.0.0.0:8000/api/notes',{
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${Cookies.get('token')}`, // Include the access token in the Authorization header
              'Content-Type': 'application/json',
            }
          });
          
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
  
          // Parse the JSON response
          const result = await response.json();
          console.log(result)
          // console.log('noteslists',result['content'][0].notes_content);
          // Update state with the fetched data
          let notes_result = [];
          for (let i = 0; i < result['content'].length; i++) {
            notes_result.push(result['content'][i])
            // console.log('newNoteList', notes_result)
          }
          setNotes(notes_result);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      setUsername(decoded['sub'])
      fetchData()
    }

  }, [token, refresh])

  const addnote = async() => {
    if( newNote.length == 0){
      alert("no data");
      return
    }
    try {
      const response = await fetch('http://0.0.0.0:8000/api/notes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`, // Include the access token in the Authorization header
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          notes_content: newNote,
        }),
      });
      console.log('token: ' + token);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.message); // The response from the server
      // You can handle the successful note creation here
      setNewNote('')
      setRefresh(!refresh);

    } catch (error) {
      console.error('Error:', error);
      // You can handle errors here, e.g., show an error message to the user
    }
  }

  function update(idx:any){
    var data = notes[idx];
    const notesID = data.objectID;
    console.log(data, notesID);
    // Call backend to update the data
    const apiUrl = "http://0.0.0.0:8000/notes/" + notesID;
    fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${Cookies.get('token')}`, // Include the access token in the Authorization header
        // Add any additional headers required, such as authentication token
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(data.message); // The response from the server
      })
      .catch(error => {
        console.error("Error:", error);
      });
    
  }

  const deletenote = async(idx:any) => {
    var data = notes[idx];
    const notesID = data.objectID;
    let newNotes = [];
    for(let i=0;i<notes.length;i++) {
      if( i != idx) newNotes.push(notes[i]);
    }
    setNotes(newNotes)
    // Call backend to update the data
    try {
      const response = await fetch(`http://0.0.0.0:8000/api/notes/${notesID}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // If the delete is successful, update the local state or perform any other necessary actions
      // For example, you might want to fetch the updated list of notes after deletion
      // Fetching the updated notes assumes you have a function fetchNotes or similar
      // const updatedNotes = await fetchNotes();
      // setNotes(updatedNotes);

      console.log('Note deleted successfully');
    } catch (error) {
      console.error('Error deleting note:', error);
    }
    setRefresh(!refresh);
  }

  return (
    <div className="w-1/2 mx-auto mt-8">
      <p>Notes</p>
      <p>username: {username}</p>
      <Separator />

      
      {
        notes.length !=0 ?  notes.map((item, idx) => 
        <div key ={idx}  className="flex space-x-2 my-2">
          <Input value={item.notes_content} onChange={(e) =>{
            var data = JSON.parse(JSON.stringify(notes))
            data[idx]['notes_content'] = e.target.value
            setNotes(data)
          }}></Input>
          <Button onClick={()=>{
            update(idx)
          }}> Update</Button>
          <Button onClick={()=>{
            deletenote(idx)
          }}> Delete</Button>
          </div>
        ): <p>No Notes</p>
      }

      <div className="mt-8">
         
      <p>
        Add New Note
      </p>
      <div className="flex-col space-y-2">
        <Input placeholder="New Note"  value={newNote} onChange={(e) => setNewNote(e.target.value)}></Input>
      <Button onClick={()=>{
            addnote()
          }}>Add to list</Button> 
      </div>
     
      </div>
     

      
      <Button className="mt-8" onClick={() => {
        Cookies.set("token", "")
        changeToken(!token)
      }}> Logout</Button>
    </div>
  );
}
