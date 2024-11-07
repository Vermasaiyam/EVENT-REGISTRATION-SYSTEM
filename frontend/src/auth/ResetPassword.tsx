import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2, LockKeyholeIcon } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore"
import { ResetPasswordInputState, userResetPasswordSchema } from "@/schema/userSchema";


const ResetPassword = () => {

    const navigate = useNavigate();

    const [errors, setErrors] = useState<Partial<ResetPasswordInputState>>({});

    const [show, setShow] = useState<boolean>(false);
    const [show1, setShow1] = useState<boolean>(false);

    const [input, setInput] = useState<ResetPasswordInputState>({
        oldPassword: "",
        newPassword: "",
    });

    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    }

    const handleClick = () => setShow(!show);


    const { resetPassword, loading } = useUserStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = userResetPasswordSchema.safeParse(input);
        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<ResetPasswordInputState>);
            return;
        }

        try {
            await resetPassword(input);
            navigate('/profile')
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full">
            <form className="flex flex-col gap-5 md:p-8 w-full max-w-md rounded-lg mx-4" onSubmit={handleSubmit}>
                <div className="text-center">
                    <h1 className="font-extrabold text-hoverGreen text-2xl mb-2 dark:text-yellow-50">Reset Password</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Enter your new password to reset old one</p>
                </div>
                <div className="relative w-full">
                    <Input
                        type={show1 ? "text" : "password"}
                        name="oldPassword"
                        value={input.oldPassword}
                        onChange={changeEventHandler}
                        placeholder="Enter your old password"
                        className="pl-10"
                        required
                    />
                    <LockKeyholeIcon className="absolute inset-y-2 left-2 text-gray-600 pointer-events-none" />
                    {errors && (
                        <span className="text-xs text-red-500">{errors.oldPassword}</span>
                    )}
                    <button
                        className="absolute inset-y-0 right-0 h-10 flex items-center px-3 bg-slate-100 dark:bg-[#2E3A52] focus:outline-none"
                        onClick={(e) => {
                            e.preventDefault();
                            setShow1(!show1);
                        }}
                    >
                        {show1 ? <Eye /> : <EyeOff />}
                    </button>
                </div>
                <div className="relative w-full">
                    <Input
                        type={show ? "text" : "password"}
                        name="newPassword"
                        value={input.newPassword}
                        onChange={changeEventHandler}
                        placeholder="Enter your new password"
                        className="pl-10"
                        required
                    />
                    <LockKeyholeIcon className="absolute inset-y-2 left-2 text-gray-600 pointer-events-none" />
                    {errors && (
                        <span className="text-xs text-red-500">{errors.newPassword}</span>
                    )}
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
                        <Button disabled className="bg-green hover:bg-hoverGreen dark:text-white">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                        </Button>
                    ) : (
                        <Button type="submit" className="bg-green hover:bg-hoverGreen dark:text-white">
                            Reset Password
                        </Button>
                    )
                }
                <span className="text-center">
                    Back to{" "}
                    <Link to="/" className="text-blue-500 hover:underline">Home</Link>
                </span>
            </form>
        </div>
    );
};

export default ResetPassword;
