import useSupabaseClient from "../hooks/useSupabaseClient.js"
import Loading from "../components/Loading.js"
import { useState } from 'react';

export default function Auth(){

    const { supabase } = useSupabaseClient();
    const [loading, setLoading] = useState(false);


    const checkSupabase = () => {
        return supabase !== undefined && supabase !== null;
    }

    async function signInWithGoogle(){
        setLoading(true);
        try {
            if (!checkSupabase()){
                alert("Failed to Authorize the user");
                setLoading(false);
                return;
            }
            const {data, error} = await supabase.auth.signInWithOAuth({
                provider : "google",
                options: {
                    redirectTo: import.meta.env.VITE_SUPABASE_CALLBACK_URL,
                }
            });

            if (error){
                console.log(JSON.stringify(error.message));
                alert("Error during sign-in: " + error.message);
                setLoading(false);
            }
        } catch (e) {
            console.error(e);
            alert("Sign-in failed");
            setLoading(false);
        }
    }
    
    async function signInWithGithub(){
        setLoading(true);
        try {
            if (!checkSupabase()){
                alert("Failed to Authorize the user");
                setLoading(false);
                return;
            }
            const {data, error} = await supabase.auth.signInWithOAuth({
                provider : "github",
                options: {
                    redirectTo: import.meta.env.VITE_SUPABASE_CALLBACK_URL,
                }
            });

            if (error){
                console.log(JSON.stringify(error.message));
                alert("Error during sign-in: " + error.message);
                setLoading(false);
            }
        } catch (e) {
            console.error(e);
            alert("Sign-in failed");
            setLoading(false);
        }
    }

    async function signOut(){
        setLoading(true);
        try {
            const error = await supabase.auth.signOut();
            if (!error) {
                setLoading(false);
            }
        } finally {
            setLoading(false);
        }
    }

    return(
        <>  
            {loading && <Loading />}
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-4">
                <h1 className="text-4xl mb-8">Welcome to <span className='font-bold'>"Purr"</span>plexity</h1>
                <button 
                    className="bg-blue-500 text-white px-6 py-3 border-2 border-blue-500 rounded hover:bg-blue-600 disabled:opacity-50 w-60" 
                    onClick={signInWithGoogle}
                    disabled={loading}
                >
                    {loading ? "Signing in..." : "Sign in with Google"}
                </button>
                <button 
                    className="bg-gray-800 text-white px-6 py-3 border-2 border-gray-800 rounded hover:bg-gray-900 disabled:opacity-50 w-60" 
                    onClick={signInWithGithub}
                    disabled={loading}
                >
                    {loading ? "Signing in..." : "Sign in with Github"}
                </button>
            </div>
        </>
    )

}