---
title: "React Hooks Explained: useState, useEffect and Custom Hooks with Examples"
slug: react-hooks-explained-usestate-useeffect-custom-hooks
category: react
date: 2026-06-04
excerpt: Understand React Hooks once and for all. Clear explanations and runnable examples of useState, useEffect, the rules of hooks, and how to write your own custom hook.
cover_image:
---

# React Hooks Explained

Hooks are how modern React components manage state and side effects. If you have ever felt confused about *why* `useEffect` runs when it does, or stared at the dreaded "invalid hook call" error, this guide is for you. We will build a clear mental model of the two hooks you will use most — `useState` and `useEffect` — learn the rules that keep them working, and finish by writing a reusable custom hook of your own.

## What problem do hooks solve?

Before hooks, only class components could hold state, and reusing stateful logic between components was awkward. Hooks let plain functions do everything: hold state, run side effects, and share logic. The result is shorter, more readable components and logic you can extract and reuse. The word "hook" simply means a function that lets you "hook into" React's features from a function component.

## useState: giving a component memory

A function component runs from top to bottom every time it renders, so ordinary variables reset on each render. `useState` gives the component a value that *survives* between renders.

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
```

`useState(0)` returns a pair: the current value and a function to update it. The argument `0` is the initial value, used only on the first render. When you call `setCount`, React stores the new value and re-renders the component so the screen reflects it.

One subtlety trips up many beginners: state updates are not instant. Calling `setCount` schedules a re-render; the `count` variable in the current render does not change. If your new state depends on the old state, use the function form to avoid bugs:

```jsx
// Safer when the next value depends on the previous one
setCount((prev) => prev + 1);
```

## useEffect: running side effects

Rendering should be pure — it just describes the UI. But real apps need to do things *outside* of rendering: fetch data, set up a subscription, start a timer, or update the document title. These are called side effects, and `useEffect` is where they belong.

```jsx
import { useState, useEffect } from "react";

function Title({ name }) {
  useEffect(() => {
    document.title = `Hello, ${name}`;
  }, [name]); // re-run only when `name` changes

  return <p>Check the browser tab title.</p>;
}
```

The second argument — the **dependency array** — is the key to `useEffect`. It tells React when to re-run the effect:

- `[]` (empty): run once after the first render. Perfect for setup like fetching initial data.
- `[name]`: run after the first render and again whenever `name` changes.
- *omitted entirely:* run after **every** render. Rarely what you want, and a common cause of infinite loops.

## Cleaning up effects

Some effects need to be undone — a timer should be cleared, a subscription closed, an event listener removed. If you do not clean up, you get memory leaks and strange bugs. `useEffect` handles this elegantly: return a function, and React runs it before the next effect and when the component unmounts.

```jsx
useEffect(() => {
  const id = setInterval(() => console.log("tick"), 1000);

  // cleanup: runs on unmount or before the effect re-runs
  return () => clearInterval(id);
}, []);
```

Reading effects as "set something up, then tear it down" makes them far less mysterious.

## Fetching data with useEffect

A very common use is loading data when a component appears. Note how we track loading and error states, which real applications always need.

```jsx
function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => {
        if (active) setBooks(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false; // ignore the result if the component unmounted
    };
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <ul>
      {books.map((b) => (
        <li key={b.id}>{b.title}</li>
      ))}
    </ul>
  );
}
```

That `active` flag is a small but important pattern: it prevents trying to update state on a component that has already gone away.

## The rules of hooks

Hooks rely on being called in the same order every render, so React has two firm rules:

1. **Only call hooks at the top level.** Never call a hook inside a loop, condition, or nested function. If you need conditional logic, put the condition *inside* the hook, not around it.
2. **Only call hooks from React functions.** Call them from components or from other hooks — never from regular functions.

Breaking these produces the "invalid hook call" error. Most of the time the cause is calling a hook conditionally, like inside an `if` block. Keep them at the top and the error disappears.

## Writing your own custom hook

The real power of hooks is that you can build your own by combining the built-in ones. A custom hook is just a function whose name starts with `use` and that calls other hooks. This lets you extract and reuse stateful logic across components.

Here is a `useLocalStorage` hook that behaves like `useState` but persists the value:

```jsx
import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored !== null ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Usage — identical shape to useState
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Theme: {theme}
    </button>
  );
}
```

Notice how clean the component becomes. All the persistence logic lives in one reusable place, and any component can opt in with a single line.

## Common pitfalls

**Missing dependencies.** If an effect uses a value but you leave it out of the dependency array, the effect can use a stale value. Include everything the effect reads.

**Infinite loops.** Updating state inside an effect that depends on that same state re-triggers the effect endlessly. Watch your dependency arrays carefully.

**Mutating state directly.** Never do `books.push(x)`. Always create a new value: `setBooks([...books, x])`. React only re-renders when it sees a new reference.

## Key takeaways

Hooks make function components powerful: `useState` gives a component memory across renders, and `useEffect` runs side effects with precise control through its dependency array, including cleanup. Follow the two rules — call hooks at the top level and only from React functions — and you avoid the most common errors. Once you are comfortable, custom hooks let you extract and reuse logic cleanly, which is where React development really starts to feel elegant.
