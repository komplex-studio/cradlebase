---
title: Build a REST API with Node.js and Express: A Step-by-Step Guide
slug: build-rest-api-nodejs-express
category: node
date: 2026-06-06
excerpt: Build a working REST API from scratch with Node.js and Express — routes, middleware, validation, error handling, and the project structure that scales. A hands-on guide for beginners.
cover_image:
---

# Build a REST API with Node.js and Express

A REST API is the backbone of most modern applications: it is the layer your web and mobile front-ends talk to. Node.js paired with Express is one of the fastest ways to build one, and the concepts you learn here transfer to almost every other framework. In this guide you will build a small but complete API for managing a list of books, and along the way you will learn the patterns that keep an API maintainable as it grows.

## Prerequisites

You should have Node.js 18 or newer installed and be comfortable with basic JavaScript — variables, functions, and arrays. You do not need any prior backend experience. You will also want a tool to send requests, such as `curl`, Postman, or the REST client built into your editor.

## What REST actually means

REST is a style for designing APIs around *resources* — things like users, books, or orders. Each resource has a URL, and you act on it using standard HTTP methods. The convention is simple and worth memorising:

- `GET` retrieves data and never changes anything.
- `POST` creates a new resource.
- `PUT` or `PATCH` updates an existing resource.
- `DELETE` removes a resource.

So for our books example, `GET /books` lists all books, `POST /books` creates one, and `DELETE /books/42` removes the book with id 42. This predictability is what makes REST so easy to consume.

## Step 1: Set up the project

Create a folder and initialise it:

```bash
mkdir books-api && cd books-api
npm init -y
npm install express
```

Open `package.json` and add `"type": "module"` so you can use modern `import` syntax. Then create an entry file called `server.js`.

## Step 2: Create a minimal server

Start with the smallest server that runs, so you can confirm everything is wired up before adding features.

```js
import express from "express";

const app = express();
app.use(express.json()); // parse JSON request bodies

app.get("/", (req, res) => {
  res.json({ message: "Books API is running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
```

Run it with `node server.js` and visit the URL. That `express.json()` line is important — it is middleware that reads the JSON body of incoming requests and makes it available as `req.body`.

## Step 3: Build the CRUD routes

For now we will store data in a simple in-memory array. This keeps the focus on the API; later you can swap it for a real database without changing the route logic much.

```js
let books = [
  { id: 1, title: "Clean Code", author: "Robert Martin" },
  { id: 2, title: "The Pragmatic Programmer", author: "Hunt & Thomas" },
];
let nextId = 3;

// List all books
app.get("/books", (req, res) => {
  res.json(books);
});

// Get one book by id
app.get("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

// Create a book
app.post("/books", (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: "title and author are required" });
  }
  const book = { id: nextId++, title, author };
  books.push(book);
  res.status(201).json(book);
});

// Update a book
app.put("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: "Book not found" });
  const { title, author } = req.body;
  if (title) book.title = title;
  if (author) book.author = author;
  res.json(book);
});

// Delete a book
app.delete("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const exists = books.some((b) => b.id === id);
  if (!exists) return res.status(404).json({ error: "Book not found" });
  books = books.filter((b) => b.id !== id);
  res.status(204).end();
});
```

Notice the **status codes**. Returning `201` for a created resource, `404` when something is missing, and `400` for bad input is part of what makes an API feel professional and predictable. Clients rely on these codes to decide what to do.

## Step 4: Test your endpoints

With the server running, try each route:

```bash
# List books
curl http://localhost:3000/books

# Create a book
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"title":"You Don'\''t Know JS","author":"Kyle Simpson"}'

# Delete a book
curl -X DELETE http://localhost:3000/books/1
```

If the create request returns your new book with an id, your API is working end to end.

## Step 5: Add centralised error handling

Right now each route handles its own errors. As the API grows you want a single place to catch anything that slips through. Express supports this with an error-handling middleware that takes four arguments.

```js
// Place this AFTER all your routes
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});
```

You should also handle requests to routes that do not exist:

```js
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});
```

## Step 6: Organise the project so it can grow

A single `server.js` is fine for a demo, but real projects separate concerns. A common, scalable structure looks like this:

- `server.js` — starts the app and loads middleware.
- `routes/` — defines which URLs exist and maps them to controllers.
- `controllers/` — contains the logic for each route.
- `models/` — talks to the database.

This separation means you can find and change things quickly. When `POST /books` misbehaves, you know to look in the books controller, not scroll through hundreds of lines.

## Common pitfalls

**Forgetting `express.json()`.** Without it, `req.body` is undefined and every POST looks broken.

**Not validating input.** Never trust the client. Check that required fields exist and have the right type before using them.

**Leaking internal errors.** In production, do not send raw error messages or stack traces to clients — log them on the server and return a generic message.

**Blocking the event loop.** Node is single-threaded for your code. Avoid heavy synchronous work in a request handler; use asynchronous operations so the server stays responsive.

## Where to go next

The natural next step is to replace the in-memory array with a real database such as PostgreSQL or MongoDB, so your data survives a restart. After that, add authentication so only logged-in users can create or delete books, and consider input-validation libraries that turn the manual checks above into declarative schemas.

## Key takeaways

You have built a complete REST API with Node.js and Express: routes for every CRUD operation, meaningful HTTP status codes, request validation, and centralised error handling. The most important ideas — model your API around resources, use the right HTTP methods and status codes, validate input, and separate your code into routes, controllers, and models — apply to every backend you will ever build, regardless of language or framework.
