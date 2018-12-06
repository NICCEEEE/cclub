import Home from "./components/Home"
import Register from "./components/Register"
import Login from "./components/Login"

let routes = [
    {
        path: "/",
        component: Home,
        exact: true
    },
    {
        path: "/login",
        component: Login
    },
    {
        path: "/register",
        component: Register
    },
]

export default routes