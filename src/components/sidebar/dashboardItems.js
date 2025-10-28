import { Users, Building, Layout } from "lucide-react";

const dashboardItems = [
    {
        title: "社員管理",
        pages: [
            {
                href: "/employees",
                title: "従業員一覧",
                icon: Users,
            },
            {
                href: "/departments",
                title: "部署一覧",
                icon: Building,
            },
        ],
    },
];

export default dashboardItems;
