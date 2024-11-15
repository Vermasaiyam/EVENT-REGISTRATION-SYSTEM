// import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { Button } from "./ui/button";
import { Calendar, Calendar1, GraduationCap, Loader2, LogOut, Menu, Moon, Newspaper, Sun, User, User2, UserCheck2, Users2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import InitialsAvatar from 'react-initials-avatar';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "./ui/separator";
import { useThemeStore } from "@/store/useThemeStore";
import { useUserStore } from "@/store/useUserStore";

const Navbar = () => {
    const { user, logout } = useUserStore();
    // const admin: boolean = true;
    const location = useLocation();

    const isActive = (path:any) => location.pathname === path ? "text-hoverGreen dark:text-green" : "";

    const { setTheme } = useThemeStore();

    return (
        <nav className="bg-white dark:bg-[#020817] px-4 shadow-sm">
            <div className="container flex justify-between items-center mx-auto">
                {/* Logo */}
                <Link to={'/'} className="flex items-center">
                    <img src="/logo.png" alt="ABES Logo" className="md:h-14 h-10 my-2 mr-0" />
                    <span className="md:font-bold md:text-xl font-semibold text-lg text-hoverGreen dark:text-yellow-100">ABES - EventHub</span>
                </Link>

                <div className="hidden lg:flex space-x-6 items-center">
                    <Link to="/" className={`hover:text-hoverGreen font-medium ${isActive("/")}`}>Home</Link>
                    <Link to="/clubs" className={`hover:text-hoverGreen font-medium ${isActive("/clubs")}`}>Clubs</Link>
                    <Link to="/events" className={`hover:text-hoverGreen font-medium ${isActive("/events")}`}>Events</Link>


                    {(user?.admin || user?.clubCounselor || user?.head || user?.clubMember) && (
                        <Menubar>
                            <MenubarMenu>
                                <MenubarTrigger className="cursor-pointer">Dashboard</MenubarTrigger>
                                <MenubarContent>
                                    {
                                        (user?.admin || user?.clubMember || user?.clubCounselor) && (
                                            <div className="">
                                                <Link to="/admin/club">
                                                    <MenubarItem className="cursor-pointer">My ClubSpace</MenubarItem>
                                                </Link>
                                                <Link to="/admin/events">
                                                    <MenubarItem className="cursor-pointer">My Events</MenubarItem>
                                                </Link>
                                            </div>
                                        )
                                    }
                                    {
                                        user?.head && (
                                            <div className="">
                                                <Link to="/head/counselors">
                                                    <Separator className="my-2" />
                                                    <MenubarItem className="cursor-pointer">Club Counselors</MenubarItem>
                                                </Link>
                                                <Link to="/head/admins">
                                                    <MenubarItem className="cursor-pointer">Club Heads</MenubarItem>
                                                </Link>
                                                <Link to="/head/users">
                                                    <MenubarItem className="cursor-pointer">All Users</MenubarItem>
                                                </Link>
                                            </div>
                                        )
                                    }
                                    {
                                        user?.clubCounselor && (
                                            <div className="">
                                                <Link to="/clubCounselor/members">
                                                    <Separator className="my-2" />
                                                    <MenubarItem className="cursor-pointer">My Club Members</MenubarItem>
                                                </Link>
                                                <Link to="/clubCounselor/users">
                                                    <MenubarItem className="cursor-pointer">All Users</MenubarItem>
                                                </Link>
                                            </div>
                                        )
                                    }
                                </MenubarContent>
                            </MenubarMenu>
                        </Menubar>
                    )}
                </div>

                <div className="hidden lg:flex space-x-4 items-center">

                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                    <span className="sr-only">Toggle theme</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="cursor-pointer">
                                    <AvatarImage src={user?.profilePicture} alt={user?.fullname} />
                                    <AvatarFallback><InitialsAvatar name={user?.fullname || "??"} className="h-full w-full flex items-center justify-center bg-slate-200 p-2 rounded-full" /></AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel className="">My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link to={'/profile'} className='flex w-fit items-center gap-2 cursor-pointer'>
                                        <User2 />
                                        <Button variant="ghost">View Profile</Button>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    {/* <button onClick={logout} className='flex w-fit items-center gap-2 cursor-pointer'> */}
                                    <button onClick={logout} className='flex w-fit items-center gap-2 cursor-pointer'>
                                        <LogOut />
                                        <Button variant="ghost" >Logout</Button>
                                    </button>
                                </DropdownMenuItem>

                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                </div>

                <div className="lg:hidden">
                    <MobileNavbar />
                </div>
            </div>

        </nav>
    )
}

export default Navbar

const MobileNavbar = () => {
    const { setTheme } = useThemeStore();

    const { user, loading, logout } = useUserStore();

    // const admin: boolean = true;
    // const loading: boolean = false;

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    size={"icon"}
                    className="rounded-full bg-gray-200 text-black hover:bg-gray-200"
                    variant="outline"
                >
                    <Menu size={"18"} />
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader className="flex flex-row items-center justify-between mt-2">
                    <SheetTitle className="text-hoverGreen">
                        <Link to={'/'} className="flex items-center">
                            <img src="/logo.png" alt="ABES Logo" className="md:h-10 h-6 my-2 mr-2" />
                            <span className="md:font-bold md:text-xl font-semibold text-lg text-hoverGreen dark:text-yellow-100">ABES - EventHub</span>
                        </Link>
                    </SheetTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SheetHeader>
                <Separator className="my-2" />
                <SheetDescription className="flex-1">
                    <Link
                        to="/profile"
                        className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                    >
                        <User />
                        <span>Profile</span>
                    </Link>
                    <Link to="/clubs" className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium">
                        <Newspaper />
                        <span>Clubs</span>
                    </Link>
                    <Link to="/events" className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium">
                        <Calendar />
                        <span>Events</span>
                    </Link>
                    <div className="my-2">
                        <Separator />
                    </div>

                    {(user?.admin || user?.head || user?.clubCounselor || user?.clubMember) && (
                        <>
                            {
                                (user?.admin || user?.clubMember || user?.clubCounselor) && (
                                    <div className="">
                                        <Link
                                            to="/admin/club"
                                            className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                                        >
                                            <Newspaper />
                                            <span>My ClubSpace</span>
                                        </Link>
                                        <Link
                                            to="/admin/events"
                                            className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                                        >
                                            <Calendar1 />
                                            <span>My Events</span>
                                        </Link>
                                        <Separator className="my-2" />
                                    </div>
                                )
                            }

                            {/* for head - super admin */}
                            {
                                user?.head && (
                                    <div className="">
                                        <Link
                                            to="/head/counselors"
                                            className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                                        >
                                            <GraduationCap />
                                            <span>Club Counselors</span>
                                        </Link>
                                        <Link
                                            to="/head/admins"
                                            className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                                        >
                                            <UserCheck2 />
                                            <span>Club Heads</span>
                                        </Link>
                                        <Link
                                            to="/head/users"
                                            className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                                        >
                                            <Users2 />
                                            <span>All Users</span>
                                        </Link>
                                        <Separator className="my-2" />
                                    </div>
                                )
                            }

                            {/* for club Counselors */}
                            {
                                user?.clubCounselor && (
                                    <div className="">
                                        <Link
                                            to="/clubCounselor/members"
                                            className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                                        >
                                            <UserCheck2 />
                                            <span>My Club Members</span>
                                        </Link>
                                        <Link
                                            to="/clubCounselor/users"
                                            className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                                        >
                                            <Users2 />
                                            <span>All Users</span>
                                        </Link>
                                    </div>
                                )
                            }
                        </>
                    )}
                </SheetDescription>
                <SheetFooter className="flex flex-col gap-4">
                    <Link to={'/profile'} className="flex flex-row items-center gap-2">
                        <Avatar>
                            <AvatarImage src={user?.profilePicture} alt={user?.fullname} />
                            <AvatarFallback><InitialsAvatar name={user?.fullname || "??"} className="h-full w-full flex items-center justify-center bg-slate-200 p-2 rounded-full" /></AvatarFallback>
                        </Avatar>
                        <h1 className="font-bold">{user?.fullname}</h1>
                    </Link>
                    <SheetClose asChild>
                        {loading ? (
                            <Button className="bg-green hover:bg-hoverGreen">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button
                                onClick={logout}
                                className="bg-green hover:bg-hoverGreen"
                            >
                                Logout
                            </Button>
                        )}
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};