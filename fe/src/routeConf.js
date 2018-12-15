import Home from "./components/Home"
import Register from "./components/Register"
import Login from "./components/Login"
import TopicContent from "./components/TopicContent"

let routes = [
    {
        path: "/",
        component: Home,
        exact: true,
    },
    {
        path: "/login",
        component: Login
    },
    {
        path: "/register",
        component: Register
    },
    {
        path: "/topic/:tid",
        component: TopicContent,
    }
]

export default routes