import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Loader2, LockKeyhole, Mail, PhoneOutgoing, User } from "lucide-react"
import { ChangeEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { SignupInputState, userSignupSchema } from "@/schema/userSchema"
// import { useUserStore } from "@/store/useUserStore"


const Signup = () => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    // const formRef = useRef();

    const navigate = useNavigate();
    // const { signup, loading } = useUserStore();

    const [errors, setErrors] = useState<Partial<SignupInputState>>({});

    const loading = false;

    const [input, setInput] = useState<SignupInputState>({
        fullname: "",
        email: "",
        password: "",
        contact: "",
    });

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    }

    const signupSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(input);

        const result = userSignupSchema.safeParse(input);
        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<SignupInputState>);
            return;
        }

        // api
        // try {
        //     await signup(input);
        //     navigate("/verify-email");
        // } catch (error) {
        //     console.log(error);
        // } await signup(input);

    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form
                // ref={formRef}
                onSubmit={signupSubmitHandler}
                className="md:p-8 w-full max-w-md rounded-lg md:border border-gray-200 mx-4 shadow-sm"
            >
                <div className="mb-4 text-center">
                    <h1 className="font-bold text-2xl text-hoverGreen dark:text-white">SIGNUP</h1>
                </div>
                <div className="mb-4">
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Full Name"
                            name="fullname"
                            value={input.fullname}
                            onChange={changeEventHandler}
                            className="pl-10 focus-visible:ring-1"
                            required
                        />
                        <User className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {errors && <span className="text-xs text-red-500">{errors.fullname}</span>}
                    </div>
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
                            type="text"
                            placeholder="Contact"
                            name="contact"
                            value={input.contact}
                            onChange={changeEventHandler}
                            className="pl-10 focus-visible:ring-1"
                            required
                        />
                        <PhoneOutgoing className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {errors && <span className="text-xs text-red-500">{errors.contact}</span>}
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
                            onCopy={(e) => e.preventDefault()}   // Disable copying
                            onPaste={(e) => e.preventDefault()}  // Disable pasting
                            onCut={(e) => e.preventDefault()}    // Disable cutting
                            onDragStart={(e) => e.preventDefault()} // Disable dragging
                            draggable={false}  // Disable drag events
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
                            Signup
                        </Button>
                    )}

                </div>
                <Separator />
                <p className="mt-4 text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default Signup