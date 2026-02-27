# Neekson Shrestha | Portfolio

A high-performance, minimalist personal portfolio and blog built with **Next.js 15**, **React 19**, and **Tailwind CSS**. Designed with a terminal-inspired aesthetic to showcase engineering projects, photography, and technical insights.

## 🚀 Key Features

- **Dynamic Blog:** Markdown-based blog engine with static generation.
- **Darkroom:** A curated photography gallery with a minimalist layout.
- **Terminal Aesthetic:** Unique UI/UX inspired by system consoles.
- **Optimized Performance:** Built for speed with Next.js static exports and Framer Motion animations.
- **Responsive Design:** Fully adaptive for all screen sizes.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Content:** Markdown with `gray-matter` and `react-markdown`

## 📦 Getting Started

### Prerequisites

- Node.js 20.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Selkie-the-goat/neeksonshresthacomnp.git
   cd neeksonshresthacomnp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📝 Content Management

### Adding Blog Posts

Blog posts are stored as Markdown files in `content/blog/`. To add a new post:

1. Create a new `.md` file in `content/blog/`.
2. Add the required frontmatter:
   ```markdown
   ---
   title: "Your Post Title"
   date: "2026-02-27"
   excerpt: "A brief summary of your post."
   readTime: "5 min read"
   ---
   Your markdown content here...
   ```

### Adding Photography

1. Place your images in `public/images/`.
2. Update the `photos` array in `src/components/Photography.tsx` with your image paths and metadata.

## 🚢 Deployment

The site is configured for **GitHub Pages** using GitHub Actions.

### Automated Deployment

1. Push your changes to the `master` branch.
2. GitHub Actions will automatically build and deploy the site.

### Static Export

If you want to build the site manually:
```bash
npm run build
```
The static files will be generated in the `out/` directory.

> **Note:** If you are deploying to a project page (e.g., `username.github.io/repo-name`), you must update `basePath` in `next.config.ts`.

## 📂 Project Structure

```text
├── content/           # Blog posts (Markdown)
├── public/            # Static assets (images, icons)
├── src/
│   ├── app/           # Next.js App Router (pages and layouts)
│   ├── components/    # React components (UI elements)
│   ├── lib/           # Utility functions and data fetching
│   └── globals.css    # Global styles and Tailwind configuration
├── next.config.ts     # Next.js configuration
└── package.json       # Project dependencies and scripts
```

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---
*Created by [Neekson Shrestha](https://github.com/Selkie-the-goat)*
