import { Users, Building, Layout } from "lucide-react";

const dashboardItems = [
    {
        title: "Pages",
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
