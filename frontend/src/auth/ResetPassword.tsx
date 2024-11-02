import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Loader2, LockKeyholeIcon } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

const ResetPassword = () => {
    const [show, setShow] = useState<boolean>(false);
    const handleClick = () => setShow(!show);

    const [newPassword, setNewPassword] = useState<string>("");
    const loading = false;

    return (
        <div className="flex items-center justify-center min-h-screen w-full">
            <form className="flex flex-col gap-5 md:p-8 w-full max-w-md rounded-lg mx-4">
                <div className="text-center">
                    <h1 className="font-extrabold text-hoverGreen text-2xl mb-2 dark:text-yellow-50">Reset Password</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Enter your new password to reset old one</p>
                </div>
                <div className="relative w-full">
                    <Input
                        type={show ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter your new password"
                        className="pl-10"
                        required
                    />
                    <LockKeyholeIcon className="absolute inset-y-2 left-2 text-gray-600 pointer-events-none" />
                    <button
                        className="absolute inset-y-0 right-0 h-10 flex items-center px-3 bg-slate-100 dark:bg-[#2E3A52] focus:outline-none"
                        onClick={(e) => {
                            e.preventDefault();
                            handleClick();
                        }}
                    >
                        {show ? <Eye /> : <EyeOff />}
                    </button>
                </div>
                {
                    loading ? (
                        <Button disabled className="bg-green hover:bg-hoverGreen dark:text-white"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</Button>
                    ) : (
                        <Button className="bg-green hover:bg-hoverGreen dark:text-white">Reset Password</Button>
                    )
                }
                <span className="text-center">
                    Back to{" "}
                    <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
                </span>
            </form>
        </div>
    )
}

export default ResetPassword