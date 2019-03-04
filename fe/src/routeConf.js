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
import Summary from "./components/Summary"
import RootPage from "./components/RootPage"
import NotFound from "./components/NotFound"
import Asm from "./components/Asm"
import Question from "./components/Question"

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
        path: "/user-summary-:username-:uid",
        component: UserSummary,
    },
    {
        path: "/asm",
        component: Asm,
    },
    {
        path: "/Question",
        component: Question
    },
    {
        path: "/rootRoot",
        component: RootPage
    },
    {
        path: "*",
        component: NotFound
    }
]

export default routes