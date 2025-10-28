import React from "react";
import DashboardLayout from "@/layouts/Dashboard";
import AuthLayout from "@/layouts/Auth";
import Login from "@/pages/Login";
import EmployeeList from "@/pages/EmployeeList";
import DepartmentList from "@/pages/DepartmentList";
import EmployeeForm from "@/pages/EmployeeForm";

const routes = [
    // {
    //     path: "auth",
    //     element: <AuthLayout />,
    //     children: [
    //         {
    //             path: "",
    //             element: <Login />,
    //         },
    //     ],
    // },
    {
        path: "/",
        element: <DashboardLayout />,
        children: [
            {
                path: "employees",
                element: <EmployeeList />,
            },
            {
                path: "departments",
                element: <DepartmentList />,
            },
            {
                path: "new",
                element: <EmployeeForm />,
            },
            {
                path: "edit/:id",
                element: <EmployeeForm />,
            }
        ],
    },
];

export default routes;
