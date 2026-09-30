# Jeren's Blog

Node.js + Express + SQLite + EJS project scaffold for a personal study blog created as a university web development assignment, using MVC architecture.

## Stack

- Node.js
- Express
- SQLite
- EJS
- MVC project structure

## Included Modules

- Article management
- Categories
- Comments
- Page statistics

## Project Structure

```text
.
|-- app.js
|-- server.js
|-- package.json
|-- .env.example
|-- config/
|   |-- app.js
|   `-- database.js
|-- controllers/
|   |-- articleController.js
|   |-- categoryController.js
|   |-- commentController.js
|   |-- homeController.js
|   `-- statsController.js
|-- database/
|   |-- schema.sql
|   `-- seed.sql
|-- middleware/
|   |-- errorHandler.js
|   |-- notFound.js
|   `-- pageStats.js
|-- models/
|   |-- articleModel.js
|   |-- categoryModel.js
|   |-- commentModel.js
|   `-- statsModel.js
|-- public/
|   |-- css/main.css
|   `-- js/main.js
|-- routes/
|   |-- articleRoutes.js
|   |-- categoryRoutes.js
|   |-- commentRoutes.js
|   |-- indexRoutes.js
|   `-- statsRoutes.js
|-- scripts/
|   |-- init-db.js
|   `-- seed-db.js
|-- utils/
|   |-- asyncHandler.js
|   `-- slugify.js
|-- views/
|   |-- articles/
|   |-- categories/
|   |-- comments/
|   |-- errors/
|   |-- home/
|   |-- partials/
|   `-- stats/
```

## Quick Start

1. Install dependencies.
2. Copy `.env.example` to `.env`.
3. Initialize the database schema.
4. Seed sample data.
5. Start the development server.

```bash
npm install
npm run db:init
npm run db:seed
npm run dev
```

## Main Routes

- `/` dashboard
- `/articles` article management
- `/categories` category management
- `/comments` comment management
- `/stats` page statistics

## Notes

- SQLite schema creation is handled by `database/schema.sql`.
- Seed content for categories, articles, comments, and statistics is handled by `database/seed.sql`.
