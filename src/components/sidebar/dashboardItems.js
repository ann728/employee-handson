import {Users, Building, Layout, Files} from "lucide-react";

const dashboardItems = [
    {
        title: "社員管理",
        pages: [
            {
                href: "/employees",
                title: "社員一覧",
                icon: Users,
            },
            {
                href: "/departments",
                title: "部署一覧",
                icon: Building,
            },
        ],
    },
    {
        title: "設定",
        pages: [
            {
                href: "/file",
                title: "ファイルアップロード",
                icon: Files,
            }
        ]
    },
];

export default dashboardItems;
