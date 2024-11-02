// import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Button } from "./ui/button";
import { HandPlatter, Loader2, LogOut, Menu, Moon, PackageCheck, ShoppingCart, SquareMenu, Sun, User, User2, UtensilsCrossed } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import InitialsAvatar from 'react-initials-avatar';
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
// import { useUserStore } from "@/store/useUserStore";
// import { useCartStore } from "@/store/useCartStore";
// import { useThemeStore } from "@/store/useThemeStore";



const Navbar = () => {
//   const { user, logout } = useUserStore();
  const admin: boolean = true;
  const cart = [1, 2, 3];

//   const { cart } = useCartStore();
//   const {setTheme} = useThemeStore();

  return (
    <nav className="bg-white dark:bg-[#020817] px-4 shadow-sm">
      <div className="container flex justify-between items-center mx-auto">
        {/* Logo */}
        <Link to={'/'} className="flex items-center">
          <img src="/logo.png" alt="Feasto Logo" className="md:h-20 h-16 mr-0" />
          <span className="md:font-bold md:text-xl font-semibold text-lg text-hoverGreen dark:text-yellow-100">ABES - EventHub</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-6 items-center">
          <Link to="/" className="hover:text-hoverGreen font-medium">Home</Link>
          {/* <Link to="/profile" className="hover:text-hoverGreen  font-medium">Profile</Link> */}
          <Link to="/menu" className="hover:text-hoverGreen  font-medium">Menu</Link>
          <Link to="/restaurants" className="hover:text-hoverGreen  font-medium">Restaurants</Link>
          <Link to="/order/status" className="hover:text-hoverGreen  font-medium">My Orders</Link>

          {/* {user?.admin && ( */}
          {admin && (
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger className="cursor-pointer">Dashboard</MenubarTrigger>
                <MenubarContent>
                  <Link to="/admin/restaurant">
                    <MenubarItem className="cursor-pointer">My Restaurant</MenubarItem>
                  </Link>
                  <Link to="/admin/menu">
                    <MenubarItem className="cursor-pointer">My Menu</MenubarItem>
                  </Link>
                  <Link to="/admin/orders">
                    <MenubarItem className="cursor-pointer">Orders</MenubarItem>
                  </Link>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          )}
        </div>

        {/* Right-side buttons */}
        <div className="hidden lg:flex space-x-4 items-center">

          <Link to="/cart" className="relative cursor-pointer">
            <ShoppingCart />
            {cart.length > 0 && (
              <Button
                size={"icon"}
                className="absolute -inset-y-3 left-4 -top-2 text-xs rounded-full w-4 h-4 bg-red-500 hover:bg-red-500"
              >
                {cart.length}
              </Button>
            )}
          </Link>

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
                {/* <DropdownMenuItem onClick={()=> setTheme('light')}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={()=> setTheme('dark')}>Dark</DropdownMenuItem> */}
                <DropdownMenuItem >Light</DropdownMenuItem>
                <DropdownMenuItem >Dark</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  {/* <AvatarImage src={user?.profilePicture} alt={user?.fullname} /> */}
                  <AvatarImage src="" alt="" />
                  <AvatarFallback>SV</AvatarFallback>
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
                  <button className='flex w-fit items-center gap-2 cursor-pointer'>
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
  // const { setTheme } = useThemeStore();

//   const { user, loading, logout } = useUserStore();
//   const { cart } = useCartStore();
//   const {setTheme} = useThemeStore();

  const cart = [1, 2, 3];
  const admin:boolean = true;
  const loading:boolean = false;

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
          <SheetTitle className="text-hoverGreen">FEASTO</SheetTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuItem onClick={()=> setTheme('light')}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={()=> setTheme('dark')}>Dark</DropdownMenuItem> */}
              <DropdownMenuItem >Light</DropdownMenuItem>
              <DropdownMenuItem >Dark</DropdownMenuItem>
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
          <Link to="/menu" className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium">
            <SquareMenu />
            <span>Menu</span>
          </Link>
          <Link to="/restaurants" className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium">
            <UtensilsCrossed />
            <span>Restaurants</span>
          </Link>
          <Link
            to="/order/status"
            className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
          >
            <HandPlatter />
            <span>My Orders</span>
          </Link>
          <Link
            to="/cart"
            className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
          >
            <ShoppingCart />
            <span>Cart ({cart.length})</span>
          </Link>
          <div className="my-2">
            <Separator />
          </div>
          {/* {user?.admin && ( */}
          {admin && (
            <>
              <Link
                to="/admin/menu"
                className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
              >
                <SquareMenu />
                <span>My Menu</span>
              </Link>
              <Link
                to="/admin/restaurant"
                className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
              >
                <UtensilsCrossed />
                <span>My Restaurant</span>
              </Link>
              <Link
                to="/admin/orders"
                className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
              >
                <PackageCheck />
                <span>Restaurant Orders</span>
              </Link>
            </>
          )}
        </SheetDescription>
        <SheetFooter className="flex flex-col gap-4">
          <Link to={'/profile'} className="flex flex-row items-center gap-2">
            <Avatar>
              {/* <AvatarImage src={user?.profilePicture} alt={user?.fullname} /> */}
              <AvatarImage src="" alt="" />
              <AvatarFallback>SV</AvatarFallback>
            </Avatar>
            {/* <h1 className="font-bold">{user?.fullname}</h1> */}
            <h1 className="font-bold">ABES</h1>
          </Link>
          <SheetClose asChild>
            {loading ? (
              <Button className="bg-green hover:bg-hoverGreen">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                // onClick={logout}
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