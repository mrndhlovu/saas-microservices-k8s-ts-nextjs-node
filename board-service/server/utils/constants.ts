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
    name: "Agile Board",
    category: "project-management",
    bgColor: "#ddaba7",
    bgImage:
      "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNTg0OTh8MHwxfHNlYXJjaHwyfHxwcm9qZWN0JTIwbWFuYWdlbWVudHxlbnwwfHx8fDE2MzQyMDYxMDk&ixlib=rb-1.2.1&q=80&w=800",
    lists: [
      { name: "Done" },
      { name: "Current Sprint" },
      { name: "In Progress" },
      { name: "On Hold" },
      { name: "Next Up" },
      { name: "Questions" },
    ],
    desc: `Use this board to get things done. 
    It isn’t just about shipping a product, 
    or checking off items on a list, or even about marking a project as Done. 
    Getting things done is a process: it’s a way of thinking that involves planning, 
    execution, iteration, and reflection.
   `,
  },

  {
    name: "Kanban Template",
    category: "engineering",
    bgColor: "#ddaba7",
    bgImage:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNTg0OTh8MHwxfHNlYXJjaHw0fHxjb2RlJTIwcmV2aWV3fGVufDB8fHx8MTYzNDIwNjA0Mg&ixlib=rb-1.2.1&q=80&w=800",
    lists: [
      { name: "Code Review" },
      { name: "Testing" },
      { name: "In Progress" },
      { name: "Done" },
    ],
    desc: `Use this simple Kanban template to keep the engineering team on the same page and moving through work fluidly. \n\n1. Break down the roadmap by adding tasks as cards to the **Backlog** list. \n\n2. Move the cards one-by-one through **Design** as they becomes more fleshed out. *Pro tip:* You can enable Power-ups for your favorite design tools like [Figma](https://trello.com/power-ups/59b2e7611e6ece0b35eac16a/figma) or [Invision](https://trello.com/power-ups/596f2cb2d279152540b2bb31), in order to easily link and view designs without switching context.\n\n3. When a card is fully specced out and designs are attached, move it to **To Do** for engineers to pick up. \n\n4. Engineers move cards to **Doing** and assign themselves to the cards, so the whole team stays informed of who is working on what.\n\n5. Cards then move through **Code Review** when they're ready for a second set of eyes. The team can set a **List Limit** (with the List Limit Power-up) on the number of cards in Code Review, as a visual indicator for when the team needs to prioritize reviews rather than picking up new work. \n\n6. Once cards move through **Testing** and eventually ship to production, move them to **Done** and celebrate!\n.
   `,
  },

  {
    name: "Simple Todo Template",
    category: "project-management",
    bgColor: "#ddaba7",
    bgImage:
      "https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNTg0OTh8MHwxfHNlYXJjaHwzfHxhZ2lsZXxlbnwwfHx8fDE2MzQyMDU4Njg&ixlib=rb-1.2.1&q=80&w=800",
    lists: [{ name: "Todo" }, { name: "Doing" }, { name: "Done" }],
    desc: `Use this simple todo template to keep the project team on the same page and moving through work fluidly.
   `,
  },
]
