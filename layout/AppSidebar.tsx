"use client";

import { useSession } from "next-auth/react";
import AppMenuForAdmin from "./AppMenuForAdmin";
import AppMenuForInstructor from "./AppMenuForInstructor";
import AppMenuForStudent from "./AppMenuForStudent";

const AppSidebar = () => {
    const { data: session, status } = useSession();


    if (status === "loading") {
        return <p>Loading...</p>; 
    }

    if (!session) {
        return <p>Not authenticated</p>;
    }

    switch (session.user?.role) {
        case "ROLE_ADMIN":
            return <AppMenuForAdmin />;
        case "ROLE_INSTRUCTOR":
            return <AppMenuForInstructor />;
        default:
            return <AppMenuForStudent />;
    }
};

export default AppSidebar;
