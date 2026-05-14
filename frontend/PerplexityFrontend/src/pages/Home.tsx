import Auth from "./Auth";
import { useEffect } from "react";
import { createClient, type Provider } from '@supabase/supabase-js';

const provider = 'provider' as Provider

export default function Home({userData}){


    return(

        <div>
            Hi User , {JSON.stringify(userData)}
        </div>



    )



}