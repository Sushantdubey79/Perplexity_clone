import { type Provider , type SupabaseClient } from '@supabase/supabase-js';
import useSupabaseClient from "../hooks/useSupabaseClient.js"
import { useNavigate } from 'react-router';
import axios from 'axios'
import { config } from '../configuration/config.js';

export default function Auth(){

    let supabase : SupabaseClient;

    let navigate = useNavigate();

    try{
        supabase = useSupabaseClient().supabase;
    }
    catch(e){
        console.log(e);
        alert("Failed to Authorize the user");
    }

    const checkSupabase = () => {

        if (supabase !== undefined || supabase !== null){
            return true
        }
        return true;

    }

    async function signInWithGoogle(){
        
        if (!checkSupabase()){
            alert("Failed to Authorize the user");
            return;
        }
        // ---cut---
        const {data, error} = await supabase.auth.signInWithOAuth({
        provider : "google",
        options: {
            redirectTo: `https://oluvmhuspgggpxjnsqka.supabase.co/auth/v1/callback`,
        }
    });

    if (error){
        console.log(JSON.stringify(error.message));
        
    }
    else{
        alert("Redirecting to Home Page");
        // const isSignUp = axios.get(`${config.BACKEND_URL}/${data}`)
        navigate("/");

        }

    }
    async function signInWithGithub(){

        if (!checkSupabase()){
            alert("Failed to Authorize the user");
            return;
        }
        // ---cut---
        const {data, error} = await supabase.auth.signInWithOAuth({
        provider : "github",
        options: {
            redirectTo: `https://oluvmhuspgggpxjnsqka.supabase.co/auth/v1/callback`,
        }
    });

    if (error){
        console.log(JSON.stringify(error.message));

    }
    else{
       
            alert("Redirecting to Home Page");
            navigate("/");

        }

    }

    async function signOut(){
        
        // ---cut---
    const error = await supabase.auth.signOut();

    alert("signed out")

    }

    return(

        <>
            <div>
                <button className="color-blue-400 p-4 border-2 mr-2" onClick={signInWithGoogle}>Sign in with google</button>
                <button className="color-blue-400 p-4 border-2" onClick={signInWithGithub}>Sign in with Github</button>
            </div>
            <div>
                <button className="color-blue-400 p-4 border-2 mt-2" onClick={signOut}>Sign Out</button>
            </div>
        </>
    )

}