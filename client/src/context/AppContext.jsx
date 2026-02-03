import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    console.log("Backend URL:", backendUrl);

    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : "");
    const [userData, setUserData] = useState(false);

    const loadUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/get-data', { headers: { authorization: token } });
            if (data.success) {
                setUserData(data.user);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const value = {
        backendUrl,
        token,
        setToken,
        userData,
        setUserData,
        loadUserData
    };

    useEffect(() => {
        if (token) {
            loadUserData();
        } else {
            setUserData(false);
        }
    }, [token]);

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
