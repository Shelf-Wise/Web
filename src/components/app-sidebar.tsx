import * as React from "react";
import {
  BookOpenText,
  SquareTerminal,
  BookA,
  UserRoundCog,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: {
    name: "Acme Inc",
    logo: BookOpenText,
    plan: "Enterprise",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: SquareTerminal,
      isActive: true,
      // items: [
      //   {
      //     title: "Dashboard",
      //     url: "/",
      //   },
      // ],
    },
    {
      title: "Manage Books",
      url: "/books",
      icon: BookA,
      items: [
        {
          title: "View Books",
          url: "/books",
        },
        {
          title: "Add Book",
          url: "/books?modal=add-book",
        },
        {
          title: "Return Book",
          url: "/return-book",
        },
      ],
    },
    {
      title: "Manage Members",
      url: "#",
      icon: UserRoundCog,
      items: [
        {
          title: "View Members",
          url: "/members",
        },
        {
          title: "Add Members",
          url: "/members?modal=add-member",
        },
      ],
    },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: CircleDollarSign,
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  // ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
