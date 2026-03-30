import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = ({ setShowLogin }) => {
    const { backendUrl, setToken } = useContext(AppContext);
    const [state, setState] = React.useState("login"); // login, register, forgot, reset
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [otp, setOtp] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            if (state === "register") {
                const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password });
                if (data.success) {
                    localStorage.setItem('token', data.token);
                    setToken(data.token);
                    setShowLogin(false);
                    toast.success("Account created successfully!");
                } else {
                    toast.error(data.message);
                }
            } else if (state === "login") {
                const { data } = await axios.post(backendUrl + '/api/user/login', { email, password });
                if (data.success) {
                    localStorage.setItem('token', data.token);
                    setToken(data.token);
                    setShowLogin(false);
                    toast.success("Logged in successfully!");
                } else {
                    toast.error(data.message);
                }
            } else if (state === "forgot") {
                const { data } = await axios.post(backendUrl + '/api/user/forgot-password', { phone });
                if (data.success) {
                    toast.success(data.message);
                    setState("reset");
                } else {
                    toast.error(data.message);
                }
            } else if (state === "reset") {
                const { data } = await axios.post(backendUrl + '/api/user/reset-password', { phone, otp, newPassword });
                if (data.success) {
                    toast.success(data.message);
                    setState("login");
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const getFormTitle = () => {
        if (state === "login") return "Login";
        if (state === "register") return "Sign Up";
        if (state === "forgot") return "Forgot Password";
        if (state === "reset") return "Reset Password";
    }

    return (
        <div onClick={() => setShowLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center text-sm text-gray-600 bg-black/50'>
            <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white">
                <p className="text-2xl font-medium m-auto">
                    <span className="text-indigo-500">User</span> {getFormTitle()}
                </p>

                {state === "register" && (
                    <div className="w-full">
                        <p>Name</p>
                        <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here name" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="text" required />
                    </div>
                )}

                {(state === "login" || state === "register") && (
                    <>
                        <div className="w-full ">
                            <p>Email</p>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here email" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="email" required />
                        </div>
                        <div className="w-full ">
                            <div className="flex justify-between items-center">
                                <p>Password</p>
                                {state === "login" && <span onClick={() => setState("forgot")} className="text-xs text-indigo-500 cursor-pointer">Forgot Password?</span>}
                            </div>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type password" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="password" required />
                        </div>
                    </>
                )}

                {state === "forgot" && (
                    <div className="w-full">
                        <p>Phone Number</p>
                        <input onChange={(e) => setPhone(e.target.value)} value={phone} placeholder="Enter your registered phone" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="tel" required />
                    </div>
                )}

                {state === "reset" && (
                    <>
                        <div className="w-full">
                            <p>OTP</p>
                            <input onChange={(e) => setOtp(e.target.value)} value={otp} placeholder="Enter 123456" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="text" required />
                        </div>
                        <div className="w-full">
                            <p>New Password</p>
                            <input onChange={(e) => setNewPassword(e.target.value)} value={newPassword} placeholder="Enter new password" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="password" required />
                        </div>
                    </>
                )}

                {state === "register" ? (
                    <p>
                        Already have account? <span onClick={() => setState("login")} className="text-indigo-500 cursor-pointer">click here</span>
                    </p>
                ) : state === "login" ? (
                    <p>
                        Create an account? <span onClick={() => setState("register")} className="text-indigo-500 cursor-pointer">click here</span>
                    </p>
                ) : (
                    <p>
                        Back to <span onClick={() => setState("login")} className="text-indigo-500 cursor-pointer">Login</span>
                    </p>
                )}

                <button className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                    {state === "register" ? "Create Account" : state === "login" ? "Login" : state === "forgot" ? "Send OTP" : "Reset Password"}
                </button>
            </form>

        </div>
    )
}

export default Login