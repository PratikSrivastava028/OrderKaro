import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { USER_ROUTES } from "../constants/endpoints";
import axiosInstance from "../lib/axios";
import { setLocation } from "../redux/slices/mapSlice";
import { clearUser, setUserData } from "../redux/slices/userSlice";

function useGetCurrentUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(USER_ROUTES.CURRENT_USER);
        const user = res.data.user;

        dispatch(setUserData(user));

        // Sync user's saved location into mapSlice so map opens at their location
        // MongoDB stores coordinates as [longitude, latitude]
        const coords = user?.location?.coordinates;
        if (coords && (coords[0] !== 0 || coords[1] !== 0)) {
          dispatch(
            setLocation({
              lat: coords[1], // latitude
              lon: coords[0], // longitude
            }),
          );
        }
      } catch (err) {
        console.log("err: ", err);
        dispatch(clearUser());
      }
    };

    fetchUser();
  }, [dispatch]);
}

export default useGetCurrentUser;
