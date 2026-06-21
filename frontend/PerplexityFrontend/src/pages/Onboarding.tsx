import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { config } from '../configuration/config.js';
import Loading from '../components/Loading.js';
import { useUserData } from '../hooks/useUserData.js';
import useSupabaseClient from '../hooks/useSupabaseClient.js';

export default function Onboarding() {
    const navigate = useNavigate();
    const { userData , loading } = useUserData();
    const { supabase } = useSupabaseClient();
    const [,setProcessing] = useState(true);
    const attemptedRef = useRef(false);
    const alertShownRef = useRef(false);

    const handleOnboardingFailure = async (errorMsg: string) => {
        console.error("Onboarding failed:", errorMsg);
        
        // Clean up
        localStorage.removeItem("userData");
        await supabase.auth.signOut();
        
        // Show alert only once
        if (!alertShownRef.current) {
            alertShownRef.current = true;
            alert("Onboarding failed. Please try again");
        }
        
        // Redirect to auth
        setProcessing(false);
        navigate("/");
    };

    useEffect(() => {
        // Wait until userData is loaded
        if (loading) {
            console.log("Onboarding: Waiting for userData to load...");
            return;
        }

        // Prevent multiple attempts
        if (attemptedRef.current) return;
        attemptedRef.current = true;

        const setupUser = async () => {
            if (!userData) {
                await handleOnboardingFailure("No user data found");
                return;
            }

            try {
                const supabaseId = userData?.supaBaseId;
                console.log("Onboarding: Checking if user exists with ID:", supabaseId);
                
                let userExists = false;
                
                // Check if user already exists in database
                try {
                    const isUserPresent = await axios.get(config.BACKEND_URL + "/user/isUser/" + supabaseId, {
                        headers: { Authorization: userData?.access_token }
                    })
                    
                    
                    if (isUserPresent.data.success === "userExist"){
                        console.log("Onboarding: User found in database " + JSON.stringify(isUserPresent.data));
                        userExists = true;
                    }
                    else{
                        userExists = false
                    }
                }
                catch (e: any) {
                    console.log("Onboarding: User not found in database, will create");
                    userExists = false;
                }
                
                // If user doesn't exist, create them
                if (!userExists) {
                    console.log("Onboarding: Creating new user");
                    try {
                        await axios.post(config.BACKEND_URL + "/user", {
                            name: userData?.username || userData?.email?.split('@')[0],
                            email: userData?.email,
                            supaBaseId: userData?.supaBaseId
                        }, { headers: { Authorization: userData?.access_token } })
                        console.log("Onboarding: User created successfully");
                    }
                    catch (e: any) {
                        console.error("Onboarding: Create user error:", e);
                        await handleOnboardingFailure("Failed to create user in database");
                        return;
                    }
                }
                
                // User exists or was created, proceed to home
                console.log("Onboarding: Complete, navigating to home");
                // Mark onboarding as complete
                localStorage.setItem(`onboarded_${userData.supaBaseId}`, 'true');
                setProcessing(false);
                navigate("/home");
                
            } catch (e) {
                console.error("Onboarding error:", e);
                await handleOnboardingFailure("An error occurred during setup");
            }
        };

        setupUser();
    }, [loading]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-4">
            <Loading />
            <p className="text-gray-700">Setting up your account...</p>
        </div>
    );
}
