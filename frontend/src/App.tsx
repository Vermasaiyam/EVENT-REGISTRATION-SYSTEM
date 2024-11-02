
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
      //   {
      //     path: "/search/:id",
      //     element: <SearchPage />
      //   },
      //   {
      //     path: "/restaurant/:id",
      //     element: <RestaurantPage />
      //   },
      //   {
      //     path: "/cart",
      //     element: <Cart />
      //   },
      //   {
      //     path: "/order/status",
      //     element: <Success />
      //   },
      //   {
      //     path: "/restaurants",
      //     element: <AllRestaurants />
      //   },
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
      //   {
      //     path: "/admin/orders",
      //     element: <AdminRoute><Orders /></AdminRoute>,
      //   },

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

  return (
    <>
      <main>
        <RouterProvider router={appRouter}></RouterProvider>
      </main>
    </>
  )
}

export default App
