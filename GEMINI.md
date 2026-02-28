# Project Overview

This is a personal portfolio and blog built with Next.js, React, and Tailwind CSS. The project is designed with a terminal-inspired aesthetic and showcases engineering projects, photography, and technical insights.

## Building and Running

### Prerequisites

- Node.js 20.x or later
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Selkie-the-goat/website.git
    cd website
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Development Server

To start the development server, run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Building for Production

To create a production-ready build, run:

```bash
npm run build
```

The static files will be generated in the `out/` directory.

### Linting

To run the linter, use:

```bash
npm run lint
```

## Development Conventions

### Content Management

-   **Blog Posts:** Blog posts are stored as Markdown files in the `content/blog/` directory. Each post requires frontmatter with a `title`, `date`, `excerpt`, and `readTime`.
-   **Photography:** Images are located in `public/images/`. The `src/components/Photography.tsx` file contains an array of photo metadata that needs to be updated when adding new images.

### Deployment

The project is configured for automated deployment to GitHub Pages using GitHub Actions. Pushing to the `master` branch triggers the deployment workflow.

## Key Files

-   `next.config.ts`: Next.js configuration.
-   `package.json`: Project dependencies and scripts.
-   `src/app/layout.tsx`: The main layout of the application.
-   `src/app/page.tsx`: The main page of the application.
-   `src/app/blog/[slug]/page.tsx`: The template for individual blog posts.
-   `src/lib/blog.ts`: Functions for reading and parsing blog posts.
-   `content/blog/`: Directory containing the Markdown blog posts.
