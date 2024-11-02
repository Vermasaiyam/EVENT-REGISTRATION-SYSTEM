import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react"
import { ChangeEvent, useState } from "react"
import { Link } from "react-router-dom"
import { LoginInputState, userLoginSchema } from "@/schema/userSchema"
// import { useUserStore } from "@/store/useUserStore"


const Login = () => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    // const navigate = useNavigate();

    const [errors, setErrors] = useState<Partial<LoginInputState>>({});

    // const { login, loading } = useUserStore();
    const loading = false;

    const [input, setInput] = useState<LoginInputState>({
        email: "",
        password: "",
    });

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    }

    const loginSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(input);

        const result = userLoginSchema.safeParse(input);
        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<LoginInputState>)
            return;
        }
        // try {
        //     await login(input);
        //     navigate("/");
        // } catch (error) {
        //     console.log(error);
        // }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form
                onSubmit={loginSubmitHandler}
                className="md:p-8 w-full max-w-md rounded-lg md:border border-gray-200 mx-4 shadow-sm"
            >
                <div className="mb-4 text-center">
                    <h1 className="font-bold text-2xl text-hoverGreen dark:text-yellow-50">LOGIN</h1>
                </div>
                <div className="mb-4">
                    <div className="relative">
                        <Input
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={input.email}
                            onChange={changeEventHandler}
                            className="pl-10 focus-visible:ring-1"
                            required
                        />
                        <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {errors && (
                            <span className="text-xs text-red-500">{errors.email}</span>
                        )}
                    </div>
                </div>
                <div className="mb-4">
                    <div className="relative">
                        <Input
                            type={show ? "text" : "password"}
                            placeholder="Password"
                            name="password"
                            value={input.password}
                            onChange={changeEventHandler}
                            className="pl-10 focus-visible:ring-1 user-select-none"
                            required
                            onCopy={(e) => e.preventDefault()}
                            onPaste={(e) => e.preventDefault()}
                            onCut={(e) => e.preventDefault()}
                            onDragStart={(e) => e.preventDefault()}
                            draggable={false}
                        />
                        <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {errors && (
                            <span className="text-xs text-red-500">{errors.password}</span>
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
                </div>
                <div className="mb-5">
                    {loading ? (
                        <Button disabled className="w-full bg-green hover:bg-hoverGreen dark:text-white">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            className="w-full bg-green hover:bg-hoverGreen dark:text-white"
                        >
                            Login
                        </Button>
                    )}
                    <div className="mt-4 text-sm text-right">
                        <Link
                            to="/forgot-password"
                            className="text-sm hover:text-blue-500 hover:underline"
                        >
                            Forgot Password
                        </Link>
                    </div>
                </div>
                <Separator />
                <p className="mt-4 text-center">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-500">
                        Signup
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default Login