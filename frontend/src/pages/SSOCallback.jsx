import { HandleSSOCallback, useUser, useClerk } from "@clerk/react";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AUTH_ROUTES } from "../constants/endpoints";
import axiosInstance from "../lib/axios";
import { setUserData } from "../redux/slices/userSlice";
import { toast } from "sonner";

export default function SSOCallback() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { isLoaded: isClerkLoaded } = useClerk();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const syncAttempted = useRef(false);

  useEffect(() => {
    const syncUser = async () => {
      if (syncAttempted.current || !user) return;
      syncAttempted.current = true;

      try {
        console.log("Syncing user with backend:", user.primaryEmailAddress?.emailAddress);
        
        const response = await axiosInstance.post(AUTH_ROUTES.LOGIN_WITH_SSO, {
          email: user.primaryEmailAddress?.emailAddress,
          fullName: user.fullName,
          clerkId: user.id,
          mobile: user.primaryPhoneNumber?.phoneNumber || "0000000000",
        });
        
        toast.success("Welcome back!");
        dispatch(setUserData(response.data.user));
        navigate("/");
      } catch (error) {
        console.error("Backend sync error:", error);
        toast.error("Failed to sync account: " + (error.response?.data?.message || error.message));
        navigate("/login");
      }
    };

    if (isUserLoaded && user) {
      syncUser();
    }
  }, [isUserLoaded, user, dispatch, navigate]);

  return (
    <HandleSSOCallback
      navigateToSignIn={() => navigate("/login")}
      navigateToSignUp={() => navigate("/register")}
    >
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
          <p className="text-stone-600 text-sm font-medium animate-pulse">
            Completing sign in...
          </p>
        </div>
      </div>
    </HandleSSOCallback>
  );
}
