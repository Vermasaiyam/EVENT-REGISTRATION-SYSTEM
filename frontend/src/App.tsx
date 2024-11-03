
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import MainLayout from './MainLayout'
import UnderConstruction from "./components/UnderConstruction"
import LandingPage from "./components/LandingPage"
import Login from "./auth/Login"
import Signup from "./auth/Signup"
import ResetPassword from "./auth/ResetPassword"
import ForgotPassword from "./auth/ForgotPassword"
import VerifyEmail from "./auth/VerifyEmail"
import Profile from "./components/Profile"
import Club from "./admin/Club"
import AddEvents from "./admin/AddEvents"
import SearchPage from "./components/SearchPage"
import ClubPage from "./components/ClubPage"
import EventPage from "./components/EventPage"
import { useThemeStore } from "./store/useThemeStore"
import { useEffect } from "react"
import AllClubs from "./components/AllClubs"

const appRouter = createBrowserRouter([
  {
    path: '/',
    element:
      // <ProtectedRoutes>
      <MainLayout />,
    // </ProtectedRoutes>,
    children: [
      {
        path: "/",
        element: <LandingPage />
      },
      {
        path: "/profile",
        element: <Profile />
      },
      {
        path: "/search/:id",
        element: <SearchPage />
      },
      {
        path: "/club/:id",
        element: <ClubPage />
      },
      {
        path: "/club/:id/:id",
        element: <EventPage />
      },
      //   {
      //     path: "/order/status",
      //     element: <Success />
      //   },
        {
          path: "/clubs",
          element: <AllClubs />
        },

      //   //admin
      {
        path: "/admin/club",
        element:
          //<AdminRoute>
          <Club />
        //</AdminRoute>
      },
      {
        path: "/admin/events",
        element:
          //<AdminRoute>
          <AddEvents />
        //</AdminRoute>,
      },

      // Under construction page
      {
        path: '*',
        element: <UnderConstruction />
      },
    ]
  },
  {
    path: "/login",
    element:
      // <AuthenticatedUser>
      <Login />
    // </AuthenticatedUser>,
  },
  {
    path: "/signup",
    element:
      //<AuthenticatedUser>
      <Signup />
    //</AuthenticatedUser>,
  },
  {
    path: "/forgot-password",
    element:
      //<AuthenticatedUser>
      <ForgotPassword />
    //</AuthenticatedUser>,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  },
  {
    path: '/verify-email',
    element: <VerifyEmail />,
  },
  // // Under construction page
  {
    path: '*',
    element: <UnderConstruction />
  },
])

function App() {

  const initializeTheme = useThemeStore((state: any) => state.initializeTheme);
  // checking auth every time when page is loaded
  useEffect(() => {
    // checkAuthentication();
    initializeTheme();
  }, []);


  return (
    <>
      <main>
        <RouterProvider router={appRouter}></RouterProvider>
      </main>
    </>
  )
}

export default App
