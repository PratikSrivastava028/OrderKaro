import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ITEM_ROUTES } from "../constants/endpoints";
import axiosInstance from "../lib/axios";
import { setItemsInMyCity } from "../redux/slices/userSlice";

function useGetItemsByCity() {
  const dispatch = useDispatch();
  const { city } = useSelector((state) => state.user);
  useEffect(() => {
    if (!city) return;
    const fetchItems = async () => {
      try {
        const result = await axiosInstance.get(
          ITEM_ROUTES.GET_ITEMS_BY_CITY(city),
        );
        // console.log("result: ", result);
        dispatch(setItemsInMyCity(result.data.items));
      } catch (error) {
        console.log(error.response);
      }
    };
    fetchItems();
  }, [city, dispatch]);
}

export default useGetItemsByCity;
