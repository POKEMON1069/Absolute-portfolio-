export type Category = "product" | "uiux" | "hardware" | "web"

export interface Project {
  id: string
  image: string
  title: string
  /** short English description shown in the project card + modal */
  desc: string
  /** what I actually did on it */
  role: string
  /** tools / technologies */
  stack: string[]
  category: Category
}

export const categoryLabels: Record<Category, string> = {
  product: "产品 Product",
  uiux: "界面 UI/UX",
  hardware: "硬件 Hardware",
  web: "网页 Web",
}

export const categoryTags: Record<Category, string> = {
  product: "PRODUCT DESIGN",
  uiux: "UI / UX CASE STUDY",
  hardware: "HARDWARE · ARDUINO",
  web: "WEB",
}

export const projects: Project[] = [
  {
    id: "skibidispin",
    image: "/assets/projects/skibidispin.jpg",
    title: "SkibidiSpin",
    desc: "A customizable random wheel picker that turns everyday decisions into a spin. Add your own options, hit spin, and let the wheel decide — endlessly reusable.",
    role: "Concept · UI · Development",
    stack: ["Web app", "Interaction design", "Randomisation"],
    category: "product",
  },
  {
    id: "berty",
    image: "/assets/projects/berty.jpg",
    title: "Berty",
    desc: "An offline-focused music player with a modern interface, smooth animations and a personalised listening experience — built to work without a connection.",
    role: "Concept · UI · Development",
    stack: ["Offline-first", "Motion design", "Music UI"],
    category: "product",
  },
  {
    id: "totem-ui",
    image: "/assets/projects/totem-ui.jpg",
    title: "Totem.ui",
    desc: "A UI/UX design project focused on building modern, clean and visually appealing interfaces — components, colour and type assembled into a reusable system.",
    role: "Design system · Visual design",
    stack: ["UI/UX", "Component library", "Typography"],
    category: "uiux",
  },
  {
    id: "serene",
    image: "/assets/projects/serene.jpg",
    title: "SERENE",
    desc: "Stress Evaluation and Real-Time Emotions Notification Engine — an Arduino-based system that reads physiological signals and sends stress-related notifications in real time.",
    role: "Hardware · Sensors · Logic",
    stack: ["Arduino", "Pulse sensor", "Real-time alerts"],
    category: "hardware",
  },
  {
    id: "portfolio-site",
    image: "/assets/projects/portfolio-site.jpg",
    title: "Personal Portfolio",
    desc: "This website — my identity, projects, interests, skills and ambitions, built with React, TypeScript and Tailwind CSS around an animated 3D folder hero.",
    role: "Design · Front-end",
    stack: ["React", "TypeScript", "Tailwind CSS"],
    category: "web",
  },
]
