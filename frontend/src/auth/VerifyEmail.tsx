import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/useUserStore";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
    const [val, setVal] = useState<string[]>(["", "", "", "", "", ""]);
    const inputRef = useRef<any>([]);
    const navigate = useNavigate();

    // const loading = false;

    const { verifyEmail, loading } = useUserStore();

    const handleChange = (index: number, value: string) => {
        if (/^[a-zA-Z0-9]$/.test(value) || value === "") {
            const newOtp = [...val];
            newOtp[index] = value;
            setVal(newOtp);
            if (value !== "" && index < 5) {
                inputRef.current[index + 1].focus();
            }
        }
    }

    const handleKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Backspace" && !val[index] && index > 0) {
            inputRef.current[index - 1].focus();
        }
    };

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const verificationCode = val.join("");
        try {
            await verifyEmail(verificationCode);
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        inputRef.current[0].focus();
    }, []);

    return (
        <div className="flex items-center justify-center h-screen w-full">
            <div className="p-8 rounded-md w-full max-w-md flex flex-col gap-10 border border-gray-200">
                <div className="text-center">
                    <h1 className="font-extrabold text-2xl text-hoverGreen dark:text-yellow-50">Verify your email</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Enter the 6 digit code sent to your email address
                    </p>
                </div>
                <form action="" onSubmit={submitHandler}>
                    <div className="flex justify-between">
                        {
                            val.map((letter: string, index: number) => {
                                return (
                                    <Input
                                        key={index}
                                        ref={(element) => inputRef.current[index] = element}
                                        type="text"
                                        value={letter}
                                        className="md:h-12 md:w-12 w-10 h-10 text-center text-sm md:text-2xl font-normal md:font-semibold rounded-lg focus-outline-none focus-ring-2 focus:ring-indigo-500"
                                        maxLength={1}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
                                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                                            handleKeyDown(index, e)
                                        }
                                    />
                                )
                            })
                        }
                    </div>
                    {
                        loading ? (
                            <Button
                                disabled
                                className="bg-green hover:bg-hoverGreen mt-6 w-full dark:text-white"
                            >
                                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button className="bg-green hover:bg-hoverGreen mt-6 w-full dark:text-white">
                                Verify
                            </Button>
                        )
                    }
                </form>
            </div>
        </div>
    )
}

export default VerifyEmail