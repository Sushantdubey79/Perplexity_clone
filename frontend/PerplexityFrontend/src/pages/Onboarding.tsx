import { useEffect, useRef } from 'react';
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
    const attemptedRef = useRef(false);
    const alertShownRef = useRef(false);

    const handleOnboardingFailure = async (errorMsg: string) => {
    console.error("Onboarding failed:", errorMsg);

    localStorage.removeItem("userData");
    await supabase.auth.signOut();

    if (!alertShownRef.current) {
        alertShownRef.current = true;
        alert(`Onboarding failed: ${errorMsg}`);
    }

    navigate("/", { replace: true });
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
                
                const isUserPresent = await axios.get(
                    config.BACKEND_URL + "/user/isUser/" + supabaseId,
                    { headers: { Authorization: userData?.access_token } }
                    ).then((response) => response.data.success === "userExist").catch(() => false); // simplified
                
                // If user doesn't exist, create them
                if (!isUserPresent) {
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
                navigate("/home");
                
            } catch (e) {
                console.error("Onboarding error:", e);
                await handleOnboardingFailure("An error occurred during setup");
            }
        };

        setupUser();
    }, [loading , userData, navigate, supabase]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-4">
            <Loading />
            <p className="text-gray-700">Setting up your account...</p>
        </div>
    );
}
