import { createClient, type Provider } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)
const provider = 'provider' as Provider

export default function Auth(){

    async function signInWithGoogle(){
        
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
       alert(JSON.stringify(data))
    }

    }

    return(

        <div>
            <button className="color-blue-400 p-4" onClick={signInWithGoogle}>Sign in with google</button>
        </div>

    )

}