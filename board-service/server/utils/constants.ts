export const allowedBoardUpdateFields = [
  "title",
  "category",
  "archived",
  "prefs.starred",
  "prefs.image",
  "prefs.color",
]
export const allowedListUpdateFields = ["title", "archived"]
export const allowedCardUpdateFields = [
  "title",
  "archived",
  "description",
  "label",
  "colorCover",
  "imageCover",
  "edgeColor",
  "coverUrl",
  "due",
  "dueComplete",
  "dueReminder",
  "start",
]

export const boardUnEditableFields = ["createdAt", "updatedAt", "id"]

export const allowedUploadTypes = [
  "jpeg",
  "png",
  "pdf",
  "doc",
  "jpg",
  "yaml",
  "yml",
  "svg",
  "x-yaml",
]

export const generateRandomColor = () => {
  var letters = "0123456789ABCDEF"
  var color = "#"
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

export const BOARD_TEMPLATES = [
  {
    name: "1-on-1 Meeting Agenda",
    bgColor: "#5cace4",
    category: "team-management",
    description:
      "This board keeps myself and my direct reports on the same page.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8cf",
  },
  {
    name: "2020 Online Bullet Journal - BuJo",
    bgColor: "#ecf4f4",
    category: "productivity",
    description:
      "Get into bullet journaling without having to carry a notebook everywhere you go.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8d0",
  },
  {
    name: "30 60 90 Day Plan Template",
    bgColor: "#08a3f3",
    category: "operations-hr",
    description: "Help your new team members excel in their first 90 days.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8d1",
  },
  {
    name: "4 Ls Exercise",
    bgColor: "#1c0d19",
    category: "personal",
    description:
      "How do you be the best version of you? The 4 L's exercise is designed for you as a leader/role model.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8d2",
  },
  {
    name: "4Ls",
    bgColor: "#fcf5d5",
    category: "team-management",
    description:
      "Reflect back on your work and use what you’ve learned to improve as a team. ",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8d3",
  },
  {
    name: "5 Product Management Buckets",
    bgColor: "#5a5534",
    category: "product-management",
    description:
      "We manage product management tasks by splitting the work into 5 different buckets. ",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8d4",
  },
  {
    name: "8 Creative Habits",
    bgColor: "#474b4b",
    category: "productivity",
    description:
      "A proven framework for implementing crucial habits for a sustainable and productive creative practice!\n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8d5",
  },
  {
    name: "A CRM & Sales Pipeline by Crmble",
    bgColor: "#5c8cc4",
    category: "sales",
    description:
      "Turn your Trello board into a powerful yet easy to use CRM system.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8d6",
  },
  {
    name: "A Customer Support solution by Crmble",
    bgColor: "#f4c44c",
    category: "support",
    description:
      "Turn your Trello board into a powerful yet easy to use Customer Support service.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8d7",
  },
  {
    name: "A Hiring & Recruiting board by Crmble",
    bgColor: "#64c4c4",
    category: "operations-hr",
    description:
      "A template with Power-Ups to help with hiring and recruiting.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8d8",
  },
  {
    name: "Academic Conference Presentation Tracker",
    bgColor: "#2f2c2a",
    category: "education",
    description:
      "A Trello board to keep track of conference presentation details and to remind yourself of important deadlines.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8d9",
  },
  {
    name: "Academic Literature Review",
    bgColor: "#6f5e5d",
    category: "education",
    description:
      "Keep track of what you've read and your notes in one place for long writing projects, like dissertations.\n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8da",
  },
  {
    name: "Academic Publishing Tracker",
    bgColor: "#c1aaa1",
    category: "education",
    description:
      "Keep track of where and when you have submitted an article and celebrate your wins!\n\n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8db",
  },
  {
    name: "Academic Research Degree Application Tracker",
    bgColor: "#402e23",
    category: "education",
    description:
      "Keep track of the many moving parts in the process of applying for a research degree position.\n\n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8dc",
  },
  {
    name: "Advanced Project Budgeting and Time Tracking",
    bgColor: "#6b7476",
    category: "project-management",
    description:
      "Track time and budget for your projects with ease and less manual work.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8dd",
  },
  {
    name: "Agile Board",
    bgColor: "#bda8b9",
    category: "project-management",
    description:
      "Getting things done is a process: it’s a way of thinking that involves planning, execution, iteration, and reflection.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8de",
  },
  {
    name: "Agile Marketing",
    bgColor: "#2d331a",
    category: "marketing",
    description: "A template for ecommerce marketers.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8df",
  },
  {
    name: "Agile Sprint Board",
    bgColor: "#096c98",
    category: "engineering",
    description:
      "Develop an agile workflow that keeps your team of developers on task and under deadline.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8e0",
  },
  {
    name: "Agile Talent Acquisition",
    bgColor: "#697172",
    category: "operations-hr",
    description: "An agile approach to hiring and recruiting.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8e1",
  },
  {
    name: "Align Your Team With V2MOM",
    bgColor: "#c6c4cd",
    category: "business",
    description:
      "Get everyone in your organization in sync, whether you’re a small business or a global company.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8e2",
  },
  {
    name: "An Order Management Pipeline by Crmble",
    bgColor: "#d4e49c",
    category: "business",
    description:
      "Use this board to manage inventory or swag requests with the Crmble Power-Up!",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8e3",
  },
  {
    name: "Android Developer Roadmap",
    bgColor: "#33241e",
    category: "engineering",
    description: "A study guide for developing on Android.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8e4",
  },
  {
    name: "Annual Email Marketing Calendar",
    bgColor: "#d3d0ca",
    category: "marketing",
    description: "Provide an overview of your marketing team's email program.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8e5",
  },
  {
    name: "Annual Life Goals & Planning",
    bgColor: "#0079BF",
    category: "productivity",
    description: "Lay out your yearly goals and track your accomplishments.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8e6",
  },
  {
    name: "Apartment Search Template",
    bgColor: "#ccc8c4",
    category: "personal",
    description: "Organize your search for a rental apartment or house.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8e7",
  },
  {
    name: "Artist Commissions",
    bgColor: "#0c0d0c",
    category: "design",
    description:
      "This board is for creative professionals who need a simple but effective workflow for client work.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8e8",
  },
  {
    name: "Bike Repair Pipeline",
    bgColor: "#989195",
    category: "sales",
    description:
      "Track bike repair orders from start to finish with a Trello repair pipeline.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8e9",
  },
  {
    name: "Blog Content Schedule",
    bgColor: "#989493",
    category: "marketing",
    description:
      "A scheduled pipeline of all upcoming and published content for your blog.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8ea",
  },
  {
    name: "Book Clubs",
    bgColor: "#f1e4cf",
    category: "personal",
    description:
      "Keep your book club on the same page, vote on the book you're reading next!",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8eb",
  },
  {
    name: "Budget Template",
    bgColor: "#464038",
    category: "personal",
    description: "Track monthly expenses and recurring charges.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8ec",
  },
  {
    name: "Building A Customer Feedback Program",
    bgColor: "#04bc6c",
    category: "support",
    description:
      "Learn how to build an effective, centralized, and systematic customer feedback program.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8ed",
  },
  {
    name: "Business Model Canvas",
    bgColor: "#b8afa1",
    category: "business",
    description: "Develop new or document existing business models.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8ee",
  },
  {
    name: "Business Plan",
    bgColor: "#29587a",
    category: "business",
    description:
      "Create a strong business plan and collaborate with others throughout the process. ",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8ef",
  },
  {
    name: "CRM Pipeline",
    bgColor: "#0e4379",
    category: "sales",
    description:
      "Create a pipeline for managing incoming leads or requests that is adaptable to your team’s needs!",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8f0",
  },
  {
    name: "Ceremony Bookings ",
    bgColor: "#e8e7e7",
    category: "project-management",
    description:
      "Learn how two of Scotland's most in-demand celebrants keep track of all their incoming requests!",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8f1",
  },
  {
    name: "Change Management Workflow Tool",
    bgColor: "#8f989f",
    category: "business",
    description: "Manage the change workflow for your business.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8f2",
  },
  {
    name: "Character Setup",
    bgColor: "#f4b714",
    category: "design",
    description:
      "A template for writers to setup the characters of your stories in order and make distinguishing characteristics obvious.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8f3",
  },
  {
    name: "Christmas Planner",
    bgColor: "#2f4a4d",
    category: "personal",
    description:
      "Get into the holiday spirit with less stress and more sparkle ✨",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8f4",
  },
  {
    name: "Client Marketing Campaign",
    bgColor: "#FFFFFF",
    category: "marketing",
    description:
      "Manage a campaign + assets seamlessly between your teams and an external agency.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8f5",
  },
  {
    name: "Client Workflow Management",
    bgColor: "#eabf1e",
    category: "project-management",
    description:
      "Use a Trello board to go paperless while managing a client workflow.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8f6",
  },
  {
    name: "Collaboration Board",
    bgColor: "#c6b096",
    category: "team-management",
    description: "A helpful template for collaborating with teams on projects.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8f7",
  },
  {
    name: "Commission Queue for Artists",
    bgColor: "#aca7aa",
    category: "personal",
    description:
      "Keep track of your artist commissions while informing others of your progress.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8f8",
  },
  {
    name: "Company Overview",
    bgColor: "#c8d1dc",
    category: "business",
    description:
      "Get everybody on the same page with a high-level overview of what's going on across the organization.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8f9",
  },
  {
    name: "Content Collection",
    bgColor: "#0079BF",
    category: "marketing",
    description:
      "Use a Trello board to keep a collection of draft content for social media purposes.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8fa",
  },
  {
    name: "Contract Review",
    bgColor: "#102a18",
    category: "sales",
    description:
      "Coordinate contract and security reviews with your Legal and IT Departments without email.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8fb",
  },
  {
    name: "Copywriting",
    bgColor: "#bb9c57",
    category: "marketing",
    description:
      "Copy projects get added to the backlog, and whenever a copywriter is free they assign themselves to the card and add a link to their Google Doc with the new copy.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8fc",
  },
  {
    name: "Creative Content Workflow",
    bgColor: "#133a5b",
    category: "marketing",
    description:
      "Blogger, vLoggers, artists, content connoisseurs, this template makes managing your creative content delivery workflow super easy. ",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8fd",
  },
  {
    name: "Customer Onboarding",
    bgColor: "#ece4ec",
    category: "sales",
    description:
      "Enable seamless customer onboarding by inviting new customers to a shared Trello board.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8fe",
  },
  {
    name: "Customer Success Board",
    bgColor: "#fbf4e2",
    category: "sales",
    description: "A lightweight, visual way to track customers at-a-glance!",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da8ff",
  },
  {
    name: "Customer Success Management",
    bgColor: "#859fc1",
    category: "support",
    description:
      "This board provides a shared space for a customer success manager and customer to track details related to a software deployment.\n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da900",
  },
  {
    name: "Customer Support Knowledge Base",
    bgColor: "#071b1d",
    category: "support",
    description:
      "Streamlined communication between support and the Science Team. Support can easily find the information needed and submit a request to the Science Team in case there is a necessity.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da901",
  },
  {
    name: "Customer Support Template",
    bgColor: "#344cc4",
    category: "support",
    description:
      "Manage all customer relations with no code, no email client, entirely inside Trello.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da902",
  },
  {
    name: "DACI Decision Making Framework",
    bgColor: "#e2fbfc",
    category: "team-management",
    description:
      "Define each person's role in making high-impact group decisions",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da903",
  },
  {
    name: "Daily Task Management",
    bgColor: "#d7dad2",
    category: "productivity",
    description: "Keep track of what to do and when.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da904",
  },
  {
    name: "Daily Tasks Planner",
    bgColor: "#d1cdd0",
    category: "personal",
    description:
      "Declutter your life by using this simple & easy task management template.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da905",
  },
  {
    name: "Dating Funnel Template",
    bgColor: "#f6b805",
    category: "personal",
    description: "An agile process for falling in love.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da906",
  },
  {
    name: "Decision Tracking Board",
    bgColor: "#412c40",
    category: "business",
    description:
      "Keep your team aligned with a board dedicated to tracking the outcomes of decisions.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da907",
  },
  {
    name: "Design Huddle ",
    bgColor: "#4d488e",
    category: "design",
    description:
      "Use design huddles to create a safe space for feedback within your team.\n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da908",
  },
  {
    name: "Design Project Board Template",
    bgColor: "#969493",
    category: "design",
    description: "A template for architectural design teams.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da909",
  },
  {
    name: "Design Project Template",
    bgColor: "#d4d4d5",
    category: "design",
    description:
      "An easy to use template for planning and monitoring your branding and product design projects online.\n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da90a",
  },
  {
    name: "Design Sprint",
    bgColor: "#8d4667",
    category: "design",
    description:
      "Use this design sprint template to ideate on early concepts and test ideas out with customers.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da90b",
  },
  {
    name: "Design System Checklist",
    bgColor: "#787a80",
    category: "design",
    description:
      "A design system unites product teams around a common visual language.\n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da90c",
  },
  {
    name: "Discover the best of  New York City in 48 hours",
    bgColor: "#000000",
    category: "personal",
    description:
      "Check out this sample itinerary for exploring the best NYC has to offer in a mere 48 hours. ",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da90d",
  },
  {
    name: "Discover the best of Paris in 48 hours",
    bgColor: "#000000",
    category: "personal",
    description:
      "Check out this sample itinerary for exploring the best Paris has to offer in a mere 48 hours. ",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da90e",
  },
  {
    name: "Discover the best of Rome in 48 hours",
    bgColor: "#000000",
    category: "personal",
    description:
      "Check out this sample itinerary for exploring the best Rome has to offer in a mere 48 hours.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da90f",
  },
  {
    name: "Distributed Team Brainstorming",
    bgColor: "#87756a",
    category: "remote-work",
    description: "A better way to brainstorm new ideas.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da910",
  },
  {
    name: "Dream Builder Goals Template Board",
    bgColor: "#f0e3df",
    category: "personal",
    description:
      "Effectively keep track of your goals and progress for each quarter.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da911",
  },
  {
    name: "Editorial Calendar",
    bgColor: "#b5af95",
    category: "marketing",
    description:
      "Using a Trello board to manage your team's editorial calendar allows you to see the status of every blog post from fresh idea to published post.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da912",
  },
  {
    name: "Editorial Workflow",
    bgColor: "#f7f7f8",
    category: "marketing",
    description:
      "Learn about how Wired UK uses Trello to publish 1000+ articles a year ✏️🔎",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da913",
  },
  {
    name: "Eisenhower Matrix Task Board",
    bgColor: "#d3ebf4",
    category: "project-management",
    description:
      "The Eisenhower Matrix is a powerful method to organize your tasks.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da914",
  },
  {
    name: "Email Workflow",
    bgColor: "#248390",
    category: "marketing",
    description:
      "Perfect your email process with the ultimate collaborative workflow.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da915",
  },
  {
    name: "Employee Manual",
    bgColor: "#d3c4a9",
    category: "operations-hr",
    description:
      "Get your new hires up and running with this simple employee manual!",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da916",
  },
  {
    name: "Enterprise Feature Requests",
    bgColor: "#8081d4",
    category: "support",
    description:
      "It’s important to keep feedback from our clients in a centralized and visible place.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da917",
  },
  {
    name: "Etsy Order Fulfillment",
    bgColor: "#a97d55",
    category: "sales",
    description: "Easy order management with Trello + Etsy! \n\n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da918",
  },
  {
    name: "Fabrication Process",
    bgColor: "#1c4b7b",
    category: "product-management",
    description:
      "We use this board to track work orders as they move through each department in the fabrication shop.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da919",
  },
  {
    name: "Family Adventure Board",
    bgColor: "#dee0e3",
    category: "personal",
    description:
      "This board helps me and my family keep track of all the fun things we want to do when we're not working!",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da91a",
  },
  {
    name: "Figuring Out Your Podcast Idea",
    bgColor: "#201543",
    category: "marketing",
    description:
      "The template breaks down what to consider when starting a podcast.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da91b",
  },
  {
    name: "Find Your Passion in Life",
    bgColor: "#7f1f37",
    category: "personal",
    description: "Questions to help you discover your passion.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da91c",
  },
  {
    name: "Freelance Branding Project",
    bgColor: "#6ba3b5",
    category: "design",
    description: "Use this template to run your next Branding project. ",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da91d",
  },
  {
    name: "Game Design Template",
    bgColor: "#040404",
    category: "design",
    description: "Easy-to-organize template for planning a video game project.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da91e",
  },
  {
    name: "Game Development",
    bgColor: "#717eb1",
    category: "engineering",
    description:
      "This is a template designed to help game developers organise their ideas and progress.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da91f",
  },
  {
    name: "Game Development Template",
    bgColor: "#d9e3eb",
    category: "engineering",
    description:
      "A template for indie game developers to track their progress.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da920",
  },
  {
    name: "Getting Things Done - GTD",
    bgColor: "#62a6d4",
    category: "productivity",
    description:
      "An implementation of the GTD (Getting Things Done) methodology, by David Allen.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da921",
  },
  {
    name: "Go To Market Strategy Template",
    bgColor: "#048ca1",
    category: "marketing",
    description:
      "Seamlessly coordinate cross-team go-to-market brand and product launches with a single Trello board.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da922",
  },
  {
    name: "Goal Setting Basics",
    bgColor: "#e9e8e8",
    category: "personal",
    description:
      "A simple introduction to Trello as well as an effective Goal Tracking System.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da923",
  },
  {
    name: "Goals and Tasks - Personal Life",
    bgColor: "#071746",
    category: "personal",
    description:
      "Attractive, simple board for tracking goals, tasks, longer term projects, and other loose ends across your personal life.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da924",
  },
  {
    name: "Government Meeting Agenda",
    bgColor: "#2d2720",
    category: "team-management",
    description:
      "An ideal framework for collaboratively planning your meeting agenda for recurring team meetings.\n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da925",
  },
  {
    name: "Government Onboarding Process For New Hires",
    bgColor: "#ececea",
    category: "operations-hr",
    description:
      "Proper onboarding helps ensure a positive experience for new hires as they get up and running.\n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da926",
  },
  {
    name: "Government Program Management",
    bgColor: "#cccac8",
    category: "team-management",
    description:
      "A simple template that any program manager at a government agency can quickly customize.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da927",
  },
  {
    name: "Government Project Management",
    bgColor: "#bec4c8",
    category: "project-management",
    description:
      "Use this visual tool to bust down team silos and make it easy to collaborate and get more done.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da928",
  },
  {
    name: "Grant Tracking Template",
    bgColor: "#929295",
    category: "business",
    description:
      "Track grant funding opportunities for your non profit organization or social enterprise.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da929",
  },
  {
    name: "Groceries Template",
    bgColor: "#fcbe8a",
    category: "personal",
    description: "A basic groceries template that you can slide items around. ",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da92a",
  },
  {
    name: "Guided Gratitude Practice",
    bgColor: "#FFFFFF",
    category: "personal",
    description: "Establish a personal or group gratitude practice.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da92b",
  },
  {
    name: "HR Team Learning Tracker",
    bgColor: "#9da272",
    category: "operations-hr",
    description:
      "A shared resource for the HR team to keep track of all of the courses they have completed.\n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da92c",
  },
  {
    name: "Heuristic Evaluation",
    bgColor: "#c2965e",
    category: "design",
    description:
      "Use this board to conduct a heuristic evaluation of any UI projects your team is working on.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da92d",
  },
  {
    name: "Home Purchase Template",
    bgColor: "#e6e8ea",
    category: "personal",
    description:
      "Use Trello to track and manage all of the things you need to do  to buy your first home.\n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da92e",
  },
  {
    name: "Household Chores",
    bgColor: "#f3cab9",
    category: "personal",
    description: "An easy way to organize your household chores.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da92f",
  },
  {
    name: "Houseplant Tracking Template 🌱",
    bgColor: "#3d5552",
    category: "personal",
    description:
      "Use this template to track your houseplants by following their growth, care, and other details.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da930",
  },
  {
    name: "Inbound Marketing Campaign Template",
    bgColor: "#d5d5d8",
    category: "marketing",
    description:
      "Get a full view of contents and assets when working on multiple integrated campaigns.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da931",
  },
  {
    name: "Incoming Requests",
    bgColor: "#88b69b",
    category: "marketing",
    description:
      "Facilitate a system for managing company-wide incoming marketing requests without endless email chains.\n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da932",
  },
  {
    name: "Innovation Weeks",
    bgColor: "#130804",
    category: "engineering",
    description:
      "Innovation Weeks are extended periods of time set aside to encourage innovation in products, development techniques and the development ecosystem within a company or team.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da933",
  },
  {
    name: "Interior Design Order Tracking",
    bgColor: "#d0e1e1",
    category: "design",
    description:
      "Easily place and track orders for your interior design projects.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da934",
  },
  {
    name: "Interview Study Tracker",
    bgColor: "#343530",
    category: "personal",
    description:
      "Track your progress and keep organized when studying for job interviews.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da935",
  },
  {
    name: "Inventory Management powered by Smart Fields",
    bgColor: "#9d968e",
    category: "operations-hr",
    description:
      "Keep track of inventory using Smart Fields for quantity, price, value, and more.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da936",
  },
  {
    name: "Job Hunt",
    bgColor: "#6789ad",
    category: "operations-hr",
    description:
      "Track your applications and the stage you're at with each company you've applied to!",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da937",
  },
  {
    name: "KUDO Cards Wall",
    bgColor: "#b6a2a5",
    category: "team-management",
    description:
      "Express your recognition and gratefulness for your coworkers.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da938",
  },
  {
    name: "Kanban Dev Board",
    bgColor: "#04040c",
    category: "engineering",
    description:
      "For software development teams following a Kanban process + best practices for getting started.\n\n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da939",
  },
  {
    name: "Kanban Template",
    bgColor: "#ddaba7",
    category: "engineering",
    description: "A simple and visual workflow for engineering teams.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da93a",
  },
  {
    name: "Kitchen Project",
    bgColor: "#e9e3d9",
    category: "personal",
    description:
      "Whether it’s a room refresh or a full-blown remodel, a Trello board is the best way to stay on top of every little detail.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da93b",
  },
  {
    name: "Language Learning Template",
    bgColor: "#eabf1e",
    category: "education",
    description:
      "A comprehensive template for a self-instructed or class based curriculum for learning a new language.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da93c",
  },
  {
    name: "Lean Canvas",
    bgColor: "#2d3032",
    category: "business",
    description:
      "Lean Canvas is a 1-page business plan template created by Ash Maurya that helps you deconstruct your idea into its key assumptions. ",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da93d",
  },
  {
    name: "Learn A Language",
    bgColor: "#d9c9b9",
    category: "education",
    description:
      "Learn a language by breaking up your study into small, achievable tasks.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da93e",
  },
  {
    name: "Lesson Planning",
    bgColor: "#0476f7",
    category: "education",
    description: "Use this Trello board to plan your lessons out in advance.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da93f",
  },
  {
    name: "Life Watchers 2020",
    bgColor: "#142434",
    category: "productivity",
    description:
      "Stay accountable to your life goals with a team of trusted friends/advisors!",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da940",
  },
  {
    name: "Lifestyle Goals (Living Room Remodel)",
    bgColor: "#496853",
    category: "personal",
    description: "Add cards to map out and plan your goals.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da941",
  },
  {
    name: "M&A Due Diligence Template",
    bgColor: "#668ba6",
    category: "business",
    description: "Manage the complexities of a merger / acquisition process.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da942",
  },
  {
    name: "Managing Translations",
    bgColor: "#c6baa0",
    category: "project-management",
    description:
      "We translate Trello into 21 languages by following this localization process.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da943",
  },
  {
    name: "Marc Andreesen Productivity System",
    bgColor: "#f2eae2",
    category: "productivity",
    description:
      "Make your own productivity system based on Marc Andreessen's personal method. ",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da944",
  },
  {
    name: "Marketing Master Editorial Calendar",
    bgColor: "#a1a2a7",
    category: "marketing",
    description:
      "This master content calendar helps us track content across a geographically distributed team.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da945",
  },
  {
    name: "Marketing Overview",
    bgColor: null,
    category: "marketing",
    description:
      "Use this board to create a stronger sense of transparency within your marketing team and the company.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da946",
  },
  {
    name: "Marketing Requests",
    bgColor: "#040404",
    category: "marketing",
    description:
      "This board is a collaboration board between the JotForm marketing and growth teams.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da947",
  },
  {
    name: "Meal Planning",
    bgColor: "#d3c9bc",
    category: "personal",
    description:
      "Free up your time and energy with this Meal Planning board. Customize as needed.\n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da948",
  },
  {
    name: "Meal Planning Board",
    bgColor: "#8ed4de",
    category: "personal",
    description: "Because your recipes need a repository!",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da949",
  },
  {
    name: "Medium Articles Template",
    bgColor: "#f2f9fb",
    category: "marketing",
    description:
      "A template to optimise the process of publishing articles online by providing a productive workflow solution.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da94a",
  },
  {
    name: "Meeting Agenda Template",
    bgColor: "#082038",
    category: "team-management",
    description: "Plan more effective and better team meetings.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da94b",
  },
  {
    name: "Milano by food",
    bgColor: "#e1d339",
    category: "personal",
    description:
      "An ongoing collection of my favorite cuisines and restaurants in Milan, Italy.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da94c",
  },
  {
    name: "Mise-En-Place Personal Productivity System",
    bgColor: "#ebecec",
    category: "productivity",
    description:
      "Increase your productivity with this board that can be used every day.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da94d",
  },
  {
    name: "Montessori Inspired Planning & Homeschool Education",
    bgColor: "#d9ddda",
    category: "education",
    description: "Prepare for your home to become a Montessori inspired space.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da94e",
  },
  {
    name: "Moving Plan",
    bgColor: "#dde3f2",
    category: "personal",
    description:
      "When my husband and I decided to move to a new state, I instantly knew we would need a Trello board. ",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da94f",
  },
  {
    name: "Mr. Rogers: “Watercooler” Video Chat Planner",
    bgColor: "#d4dbeb",
    category: "remote-work",
    description: "A simple way to build team culture.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da950",
  },
  {
    name: "My Climate Action Plan (MyCAP)",
    bgColor: "#8dc1f4",
    category: "personal",
    description:
      "Take action to protect our planet, both at work and at home. ",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da951",
  },
  {
    name: "New Baby",
    bgColor: "#eeeae9",
    category: "personal",
    description: "A handy template for expectant parents to get prepared.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da952",
  },
  {
    name: "New Test Automation Development Project",
    bgColor: "#55b9cb",
    category: "engineering",
    description:
      "Guide the initial tasks necessary for developing a Software Test Automation project.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da953",
  },
  {
    name: "New Year's Resolutions",
    bgColor: "#bac0c3",
    category: "personal",
    description:
      "Set your New Year's resolutions - and stick to them! - with this Trello template.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da954",
  },
  {
    name: "OKRs",
    bgColor: "#a0baca",
    category: "business",
    description:
      "Learn how Kevan Lee helps his team prioritize and plan by setting OKRs - objectives and key results.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da955",
  },
  {
    name: "Office Party Planning",
    bgColor: "#dac2de",
    category: "team-management",
    description: "Use this Trello board to plan an amazing office party!",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da956",
  },
  {
    name: "Offsite Planning",
    bgColor: "#091327",
    category: "team-management",
    description:
      "Use this template to plan your next team offsite! The whole team has access to this board before, during, and after the offsite to stay informed. ",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da957",
  },
  {
    name: "Onboarding Process For New Hires",
    bgColor: "#ccdbea",
    category: "operations-hr",
    description:
      "Ensure that every new hire has a meaningful onboarding experience.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da958",
  },
  {
    name: "Personal & Work Goals",
    bgColor: "#b4a297",
    category: "productivity",
    description:
      "Track the status of your personal and professional productivity. Set goals and achieve them.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da959",
  },
  {
    name: "Personal (or Work) Productivity System - Know your Priorities",
    bgColor: "#65674a",
    category: "productivity",
    description:
      "Use this template to maximize your productivity in a way that aligns with your real priorities.\n\n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da95a",
  },
  {
    name: "Personal Workflow Board",
    bgColor: "#24948c",
    category: "personal",
    description: "Use this template to manage your everyday workflow.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da95b",
  },
  {
    name: "Photography Order Production Tracking",
    bgColor: "#83acbc",
    category: "design",
    description:
      "A template for tracking the production of photography orders and works.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da95c",
  },
  {
    name: "Photography Session Workflow Tracking",
    bgColor: "#141414",
    category: "design",
    description:
      "Use this board to track your photography sessions once they have been booked, to have an overview of your workflow stages.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da95d",
  },
  {
    name: "Pitch Deck",
    bgColor: "#cd9654",
    category: "business",
    description:
      "This template guides you on building your Investor Pitch Deck for Startups.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da95e",
  },
  {
    name: "Plan Your Life",
    bgColor: "#fcfbfb",
    category: "personal",
    description: "Find your direction and commit to some life changes.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da95f",
  },
  {
    name: "Plan your Studies - Vet Student",
    bgColor: "#fbde05",
    category: "education",
    description: "A template to help vet students conquer clinics and beyond!",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da960",
  },
  {
    name: "Planning Your Day (a Kanban template)",
    bgColor: "#f1c9dd",
    category: "productivity",
    description:
      "A simple Kanban style board for you to keep your life organized.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da961",
  },
  {
    name: "Podcast Workflow Template",
    bgColor: "#212121",
    category: "marketing",
    description:
      "The one-stop-shop for managing your podcast production workflow.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da962",
  },
  {
    name: "Portfolio - Step by Step guide",
    bgColor: "#dde6e5",
    category: "design",
    description:
      "This template is for beginners who want to make a portfolio for their next job.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da963",
  },
  {
    name: "Post A Job [Hiring Process]",
    bgColor: "#2464f4",
    category: "operations-hr",
    description:
      "Keep your Indeed job postings organized and hire the best candidates possible.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da964",
  },
  {
    name: "Post-Mortem Meeting Board",
    bgColor: "#FFFFFF",
    category: "team-management",
    description:
      "This boards help you celebrate what worked and learn from what didn't. ",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da965",
  },
  {
    name: "Premortem",
    bgColor: "#e2fafa",
    category: "project-management",
    description:
      "Anticipate risks so you can solve for them while there's still time.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da966",
  },
  {
    name: "Product Roadmap Template",
    bgColor: "#bcbcc6",
    category: "product-management",
    description:
      "Track product development and feature requests with stakeholders and product owners.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da967",
  },
  {
    name: "Productivity Template ",
    bgColor: "#121d16",
    category: "productivity",
    description:
      "A day-to-day productivity template to help you stay organized.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da968",
  },
  {
    name: "Productivity Workflow",
    bgColor: "#4c423f",
    category: "productivity",
    description:
      "As a team we're always trying out new productivity methods, use this board to try each one!",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da969",
  },
  {
    name: "Program Management Template",
    bgColor: "#060907",
    category: "project-management",
    description:
      "A simple template with valuable links to resources that will help program managers quickly bootstrap the PMO team.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da96a",
  },
  {
    name: "Project Based Learning",
    bgColor: "#cdccca",
    category: "education",
    description:
      "A key aspect of organizing projects is creating a timeline, responsibilities, and checklists.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da96b",
  },
  {
    name: "Project Management",
    bgColor: "#4126ab",
    category: "project-management",
    description:
      "Use this basic structure to build your team's ideal workflow, for projects big or small.\n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da96c",
  },
  {
    name: "Publishing Process",
    bgColor: "#6e6d69",
    category: "marketing",
    description:
      "From ideation to publication. The Telegraph uses Trello + automation to get things done.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da96d",
  },
  {
    name: "Reader Manager",
    bgColor: "#252d34",
    category: "personal",
    description:
      "Keep track of what you've read, want to read, and suggestions from others.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da96e",
  },
  {
    name: "Reading List",
    bgColor: "#343530",
    category: "personal",
    description: "A visual way to keep track of the books you want to read.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da96f",
  },
  {
    name: "Real Estate Organization",
    bgColor: "#c7c9bc",
    category: "sales",
    description: "Stay on top of your real estate leads.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da970",
  },
  {
    name: "Recruiting Pipeline",
    bgColor: "#046f49",
    category: "operations-hr",
    description:
      "Manage your recruiting pipeline from anticipated future needs to closed positions. Get a scannable view of your recruiting pipeline by creating a card for each position. Save time by attaching job descriptions to each positions’ card so that they can be accessed and updated by anyone on the team. Streamline your process by creating copiable template cards with checklists for each step required to fill an open role.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da971",
  },
  {
    name: "Recurring Bill Tracker",
    bgColor: "#212221",
    category: "personal",
    description:
      "Set up Trello to update each day with recurring bills so you always have an eye on what's coming up.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da972",
  },
  {
    name: "Remote Class Template",
    bgColor: "#b3ccdb",
    category: "education",
    description: "Stay organized in a remote learning environment.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da973",
  },
  {
    name: "Remote Cooking Challenge",
    bgColor: "#535151",
    category: "personal",
    description:
      "Help your team or friend group bond from afar with the remote cooking challenge! ",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da974",
  },
  {
    name: "Remote Team Bonding Template",
    bgColor: "#95b1cc",
    category: "remote-work",
    description:
      "Create a space for your team to share experiences for remote activities. ",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da975",
  },
  {
    name: "Remote Team Hub",
    bgColor: "#b3afa8",
    category: "remote-work",
    description: "A mission control center for your team productivity.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da976",
  },
  {
    name: "Remote Team Meetings",
    bgColor: "#dabdcf",
    category: "remote-work",
    description: "Bring focus and transparency to your remote team meetings.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da977",
  },
  {
    name: "Research Iteration",
    bgColor: "#c8ccc7",
    category: "design",
    description: "Set-up your user research plan from start to finish!",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da978",
  },
  {
    name: "Research Project",
    bgColor: "#0d0d0d",
    category: "design",
    description:
      "At Trello, research is fundamental to building great experiences.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da979",
  },
  {
    name: "Retail Sales Pipeline",
    bgColor: "#6bb7bd",
    category: "sales",
    description:
      "We use this retail sales pipeline to manage orders across 12 retail shops.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da97a",
  },
  {
    name: "SEO Content Creation",
    bgColor: "#929295",
    category: "marketing",
    description:
      "Get your content production down to a science with SEO in mind.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da97b",
  },
  {
    name: "Sales Funnel powered by Smart Fields",
    bgColor: "#3f3430",
    category: "sales",
    description:
      "Keep track of sales leads, and highlight revenue, expenses, and profit using the Smart Fields Power-up.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da97c",
  },
  {
    name: "Sales Pipeline",
    bgColor: "#67b6cd",
    category: "sales",
    description:
      "A simple and actionable way of keeping track of your deals.\n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da97d",
  },
  {
    name: "Salesforce Project",
    bgColor: "#154425",
    category: "project-management",
    description: "Manage your Salesforce projects on Trello. ",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da97e",
  },
  {
    name: "Scalify Marketing Process Template",
    bgColor: "#1e4ef4",
    category: "marketing",
    description:
      "For small marketing teams who want to get things done better and faster!",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da97f",
  },
  {
    name: "Scientific Research Project (Template)",
    bgColor: "#040404",
    category: "project-management",
    description:
      "Use this template to manage your next scientific research project.\n\n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da980",
  },
  {
    name: "Scrum Board",
    bgColor: "#04040c",
    category: "engineering",
    description:
      "For software teams following a Scrum process including best practices.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da981",
  },
  {
    name: "Self Care (Daily)",
    bgColor: "#0b0d0b",
    category: "personal",
    description:
      "Stick to some self care activities for more energy throughout the day.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da982",
  },
  {
    name: "Service Desk - Incident Impact Analysis",
    bgColor: "#abaab1",
    category: "support",
    description:
      "Gather the key data around an incident to address it effectively.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da983",
  },
  {
    name: "Setlist Organizer",
    bgColor: "#0d0a07",
    category: "personal",
    description:
      "Use this template to plan your band's upcoming gigs, store your chord charts, and everything your band needs to be successful.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da984",
  },
  {
    name: "Shipping Planner",
    bgColor: "#1c4b7b",
    category: "product-management",
    description:
      "We use this board to track delivery orders. Shipping and Receiving teams can easily track shipments and get directions to deliver products.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da985",
  },
  {
    name: "Simple Project Board",
    bgColor: "#417510",
    category: "project-management",
    description: "Move projects through brainstorm, to do, doing, and done.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da986",
  },
  {
    name: "Site Reliability",
    bgColor: "#061015",
    category: "engineering",
    description:
      "Manage and maintain systems-related improvements, architecture, and development.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da987",
  },
  {
    name: "Site tracker",
    bgColor: "#428dde",
    category: "project-management",
    description: "Keep stakeholders apprised of plans for new sites.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da988",
  },
  {
    name: "Social Media Marketing Board",
    bgColor: "#bfbfbf",
    category: "marketing",
    description:
      "Simple social media marketing board to keep all your social media resources, plans and efforts organized for your business.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da989",
  },
  {
    name: "Software Development [Web App, iOS App, Android App]",
    bgColor: "#b1d2f1",
    category: "engineering",
    description:
      "Manage tasks and deadlines for software development projects.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da98a",
  },
  {
    name: "Software Engineering Career Design",
    bgColor: "#b2b2bd",
    category: "engineering",
    description:
      "Plan your software engineering career - where you are, and where you want to be!",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da98b",
  },
  {
    name: "Speaker guide for online events",
    bgColor: "#352e22",
    category: "marketing",
    description: "Prep for your next virtual event with precision! \n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da98c",
  },
  {
    name: "Sprint Retrospectives",
    bgColor: "#d37c73",
    category: "engineering",
    description:
      "Replace whiteboards with Trello boards for more informative and accessible team retrospectives.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da98d",
  },
  {
    name: "Staff Scheduling",
    bgColor: "#a37947",
    category: "team-management",
    description: "Manage team schedules and shifts.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da98e",
  },
  {
    name: "Superpowers and Kryptonite Exercise",
    bgColor: "#c3a4d1",
    category: "team-management",
    description:
      "This is a great exercise for team offsites. Get to know your teammates' strengths and weaknesses, and build shared understanding and empathy. \n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da98f",
  },
  {
    name: "Support Ticket Management",
    bgColor: "#041f1f",
    category: "support",
    description: "A template to manage incoming IT requests.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da990",
  },
  {
    name: "Swift Developer Roadmap",
    bgColor: "#77782f",
    category: "engineering",
    description:
      "A template to learn the foundations of Swift for iOS app development.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da991",
  },
  {
    name: "Syllabus Template",
    bgColor: "#d4d9fb",
    category: "education",
    description:
      "Using Trello allows my students to participate in the actual development of the content within the syllabus. ",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da992",
  },
  {
    name: "Tability's Public Start Up Roadmap",
    bgColor: "#0c5454",
    category: "product-management",
    description:
      "Create a sense of transparency between your users and your team.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da993",
  },
  {
    name: "Teaching: Weekly Planning",
    bgColor: "#faaf92",
    category: "education",
    description:
      "A board per class. The lists are the weeks of the semester, cards are things I need to do for class each week.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da994",
  },
  {
    name: "Team Focus Board",
    bgColor: "#ece4ec",
    category: "team-management",
    description:
      "Make our weekly team meetings more visual and engaging when discussing what is important. ",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da995",
  },
  {
    name: "Team Goal Setting Central",
    bgColor: "#95b7e4",
    category: "business",
    description:
      "Keep execs and higher-ups happy with this clear and trackable goal setting process.\n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da996",
  },
  {
    name: "Team Health Monitor",
    bgColor: "#b2b2b2",
    category: "team-management",
    description:
      "Assess your team against the eight attributes most commonly found among healthy teams.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da997",
  },
  {
    name: "Team Icebreaker: Surviving the Apocalypse",
    bgColor: "#494c54",
    category: "team-management",
    description:
      "Try this fun icebreaker during team hangouts, offsites, and more! ",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da998",
  },
  {
    name: "Team Organization Central",
    bgColor: "#a84c97",
    category: "team-management",
    description:
      "Store all essential team resources, schedules, project summaries, updates and more.\n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da999",
  },
  {
    name: "Team Retrospectives With Post-itⓇ + Trello",
    bgColor: "#f4f4ec",
    category: "team-management",
    description:
      "Gather your team together and put those Post-itⓇ Super Sticky Notes to work with Trello!",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da99a",
  },
  {
    name: "Team Tasks - 5 Things Workflow",
    bgColor: "#e44404",
    category: "team-management",
    description: 'Learn the "rule of five" for managing better teams.',
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da99b",
  },
  {
    name: "Thank You Notes",
    bgColor: "#968272",
    category: "personal",
    description:
      "Writing thank you notes after your wedding can be overwhelming, but with Trello, it can be fun, too!",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da99c",
  },
  {
    name: "The PM Skills Assessment by Marty Cagan (SVPG.com)",
    bgColor: "#5f919d",
    category: "product-management",
    description:
      "Implement the PM Skills Assessment process from Silicon Valley Product Group.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da99d",
  },
  {
    name: "Timed Effort Planner",
    bgColor: "#bfbfbf",
    category: "productivity",
    description:
      "Improve productivity by categorizing different tasks into different timed buckets.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da99e",
  },
  {
    name: "Town Hall Meetings",
    bgColor: null,
    category: "business",
    description:
      "To facilitate the transparency of these meetings we created a Trello board that is open to everyone at the company.\n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da99f",
  },
  {
    name: "Trade-offs",
    bgColor: "#fcf4f4",
    category: "project-management",
    description: "Define and prioritize project trade-offs to save time later.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9a0",
  },
  {
    name: "Travel Bucket List",
    bgColor: "#000000",
    category: "personal",
    description:
      "Use this simple and shareable bucket list board for planning your ultimate #travelgoals. ",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9a1",
  },
  {
    name: "Travel Itinerary Template",
    bgColor: "#fc9404",
    category: "personal",
    description:
      "This template is a great place to keep track of all the details for your next multi-destination trip!",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9a2",
  },
  {
    name: "Travel Packing Checklist",
    bgColor: "#726358",
    category: "personal",
    description: "Ensure you pack everything for your perfect vacation.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9a3",
  },
  {
    name: "Travel Planning",
    bgColor: "#a8babe",
    category: "personal",
    description: "Plan and execute the perfect trip!",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9a4",
  },
  {
    name: "Travel Planning Template",
    bgColor: "#aba7a7",
    category: "personal",
    description: "Plan your trip from start to finish.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9a5",
  },
  {
    name: "UNICEF Global Innovation Centre",
    bgColor: "#0493f0",
    category: "project-management",
    description:
      "Working with any number of countries at any given time, UNICEF is able to keep track of every location, including all points of contact and every important document, on dedicated Trello boards.\n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9a6",
  },
  {
    name: "UX Empathy Mapping",
    bgColor: "#4BBF6B",
    category: "design",
    description: "Topics to cover during a empathy mapping workshop.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9a7",
  },
  {
    name: "User Story Mapping Template",
    bgColor: "#bfbfbf",
    category: "product-management",
    description:
      "A template for mapping digital product's user stories with multiple user roles. ",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9a8",
  },
  {
    name: "Video Production",
    bgColor: "#f3f3f4",
    category: "project-management",
    description: "Use this board to manage your video production.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9a9",
  },
  {
    name: "Web Design | Development",
    bgColor: "#242625",
    category: "design",
    description:
      "This is a quick setup for all freelance and personal web design and web development projects.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9aa",
  },
  {
    name: "Web Development",
    bgColor: "#f3d05d",
    category: "engineering",
    description:
      "A simple template to help  web developers organize and manage tasks.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9ab",
  },
  {
    name: "Website Task Planner",
    bgColor: "#dfdede",
    category: "marketing",
    description:
      "10 Phases you'll need to plan, design, create, test, and launch a professional-looking website for your SMB.\n\n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9ac",
  },
  {
    name: "Wedding Day Timeline",
    bgColor: "#2a3f1f",
    category: "personal",
    description:
      "Keep track of your schedule so that you can spend more time enjoying every moment.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9ad",
  },
  {
    name: "Wedding Party",
    bgColor: "#be9b81",
    category: "personal",
    description:
      "Use this board to coordinate wedding party logistics, plan bachelor/ette parties and showers, and more!\n\n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9ae",
  },
  {
    name: "Wedding Planning",
    bgColor: "#4d6065",
    category: "personal",
    description:
      "This template has the master list of wedding-related tasks, broken down by how many months out you are from the big day.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9af",
  },
  {
    name: "Weekly Meeting Template",
    bgColor: "#494848",
    category: "business",
    description:
      "This is a weekly meeting template compatible with the Entrepreneurial Operating System (EOS).",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9b0",
  },
  {
    name: "Weekly Music Lesson Template",
    bgColor: "#040404",
    category: "education",
    description: "For music instructors who teach an instrument online.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9b1",
  },
  {
    name: "Weekly Planner",
    bgColor: "#0079BF",
    category: "productivity",
    description: "Use this simple planner to schedule out your entire week!",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9b2",
  },
  {
    name: "Weekly Team Meetings",
    bgColor: "#f3ab98",
    category: "team-management",
    description:
      "Always make the most of valuable meeting minutes with a clearer agenda, attached decks & more.\n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9b3",
  },
  {
    name: "Wellbeing Discussion Template",
    bgColor: "#061e2b",
    category: "operations-hr",
    description:
      "Gauge the wellbeing of your team on a consistent basis with retrospective and ideation sessions. ",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9b4",
  },
  {
    name: "Where to next: Travel inspiration board",
    bgColor: "#fc7c5c",
    category: "personal",
    description: "Use this template to start planning your next dream trip ✈️",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9b5",
  },
  {
    name: "White Elephant!",
    bgColor: "#312f24",
    category: "personal",
    description:
      "Everyone's favorite holiday gift exchange game that can now be played virtually!",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9b6",
  },
  {
    name: "Work From Home Daily Planner",
    bgColor: "#d1d1d1",
    category: "remote-work",
    description: "Plan, collaborate and monitor your work-from-home schedule.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9b7",
  },
  {
    name: "Work request and intake process",
    bgColor: "#263a47",
    category: "project-management",
    description:
      "An easy and automated way for coworkers to request work from you.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9b8",
  },
  {
    name: "Working Agreements",
    bgColor: "#6ba5ee",
    category: "team-management",
    description:
      "Create a list of expectations with your teammates for successful collaboration.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9b9",
  },
  {
    name: "Writing A Book",
    bgColor: "#5fa5f4",
    category: "personal",
    description:
      "Whether it's an epic novel or a children's book, we've got you covered with a template that can help you along your literary journey. ",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9ba",
  },
  {
    name: "Yoga Flow Creator",
    bgColor: "#89609E",
    category: "personal",
    description:
      "Create yoga flows with this template chock full of visual pose cards!\n\n",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9bb",
  },
  {
    name: "aADDIE Template",
    bgColor: "#00AECC",
    category: "design",
    description:
      "Use the time tested ADDIE instructional design model to get your project up and running quickly.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9bc",
  },
  {
    name: "eCourse Workflow",
    bgColor: "#e9e8e8",
    category: "education",
    description: "Launch your eCourse with ease and organization.",
    visibility: "public",
    lists: [
      {
        name: "Todo",
      },
      {
        name: "Doing",
      },
      {
        name: "Done",
      },
    ],
    id: "616b219b1b91e902541da9bd",
  },
]
