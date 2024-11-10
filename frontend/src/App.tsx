
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
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
import { useUserStore } from "./store/useUserStore"
import AllEvents from "./components/AllEvents"
import AllUsers from "./head/AllUsers"
import AllAdmins from "./head/AllAdmins"
import AllClubCounselors from "./head/AllClubCounselors"

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useUserStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  return children;
};

const AuthenticatedUser = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useUserStore();
  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />
  }
  return children;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useUserStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  if (!user?.admin) {
    return <Navigate to="/" replace />
  }

  return children;
}
const HeadRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useUserStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  if (!user?.head) {
    return <Navigate to="/" replace />
  }

  return children;
}

const appRouter = createBrowserRouter([
  {
    path: '/',
    element:
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>,
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
      {
        path: "/:id",
        element: <EventPage />
      },
      {
        path: "/events/:id",
        element: <EventPage />
      },
      {
        path: "/events",
        element: <AllEvents />
      },
      {
        path: "/clubs",
        element: <AllClubs />
      },

      //admin
      {
        path: "/admin/club",
        element:
          <AdminRoute>
            <Club />
          </AdminRoute>
      },
      {
        path: "/admin/events",
        element:
          <AdminRoute>
            <AddEvents />
          </AdminRoute>,
      },

      // main head page
      {
        path: "/head/counselors",
        element:
          <HeadRoute>
            <AllClubCounselors />
          </HeadRoute>,
      },
      {
        path: "/head/admins",
        element:
          <HeadRoute>
            <AllAdmins />
          </HeadRoute>,
      },
      {
        path: "/head/users",
        element:
          <HeadRoute>
            <AllUsers />
          </HeadRoute>,
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
      <AuthenticatedUser>
        <Login />
      </AuthenticatedUser>,
  },
  {
    path: "/signup",
    element:
      <AuthenticatedUser>
        <Signup />
      </AuthenticatedUser>,
  },
  {
    path: "/forgot-password",
    element:
      <AuthenticatedUser>
        <ForgotPassword />
      </AuthenticatedUser>,
  },
  {
    path: '/reset-password',
    element:
      <ProtectedRoutes>
        <ResetPassword />
      </ProtectedRoutes>

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
