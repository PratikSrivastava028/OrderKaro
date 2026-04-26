import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SHOP_ROUTES } from "../constants/endpoints";
import axiosInstance from "../lib/axios";
import { setShopsInMyCity } from "../redux/slices/userSlice";

function useGetShopByCity() {
  const dispatch = useDispatch();
  const { city } = useSelector((state) => state.user);

  useEffect(() => {
    if (!city) return; // ← wait until city is available
    const fetchShops = async () => {
      try {
        const result = await axiosInstance.get(
          SHOP_ROUTES.GET_SHOP_BY_CITY(city),
        );
        dispatch(setShopsInMyCity(result.data.shops));
      } catch (error) {
        console.log(error.response);
      }
    };
    fetchShops();
  }, [city, dispatch]);
}

export default useGetShopByCity;
