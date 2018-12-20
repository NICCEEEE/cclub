import Home from "./components/Home"
import Register from "./components/Register"
import Login from "./components/Login"
import TopicContent from "./components/TopicContent"
import MyProfile from "./components/MyProfile"
import UserSummary from "./components/UserSummary"
import Edit from "./components/Edit"
import Notify from "./components/Notify"
import Message from "./components/Message"
import Setting from "./components/Setting"
import RouteTest from "./components/RouteTest"
import Summary from "./components/Summary"

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
    },
    {
        path: "/my-summary",
        component: MyProfile,
        routes: [
            {
                path: "/my-summary",
                component: Summary
            },
            {
                path: "/my-summary/edit",
                component: Edit
            },
            {
                path: "/my-summary/notification",
                component: Notify
            },
            {
                path: "/my-summary/message",
                component: Message
            },
            {
                path: "/my-summary/setting",
                component: Setting
            }
        ]
    },
    {
        path: "/user-summary-:username",
        component: UserSummary,
    },
    {
        path: "/route",
        component: RouteTest,
    }
]

export default routes