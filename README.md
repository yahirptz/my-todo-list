# My Tasks

A lightweight, responsive task manager built with plain HTML, CSS, and vanilla JavaScript. It runs directly in a browser and saves tasks in `localStorage`, so no account or server is required.

## Features

- Add tasks with the Enter key or Add Task button.
- Mark tasks complete or incomplete.
- Delete individual tasks.
- Set High, Medium, or Low priority. Tasks are automatically sorted by priority.
- Add an optional location, such as `Library` or `Park`.
- Add an optional measurable goal using hours, calories, liters, miles, or kilometers.
- Log progress directly on a task. For example, a 4-mile goal with 2 miles logged shows 50% complete.
- Progress can exceed the goal. Logging 8 miles on a 4-mile goal shows 200% complete.
- Tasks are automatically dated when they are created.
- Use the Viewing date picker to browse tasks from other dates.
- Completed and incomplete counts update automatically.

## Run The App

### Using VS Code Live Server

1. Open this folder in VS Code.
2. Install the `Live Server` extension by Ritwick Dey if it is not installed.
3. Open `index.html`.
4. Right-click the file and choose **Open with Live Server**, or select **Go Live** in the VS Code status bar.
5. Your browser will open the app at a local address such as `http://127.0.0.1:5500`.

### Without an Extension

Double-click `index.html` to open it directly in a browser. All core functionality works from the local file, although Live Server provides a more convenient development workflow.

## How To Use It

1. Enter a task in the main field.
2. Optionally enter a location, choose a priority, and add a goal with its unit.
3. Select **Add Task** or press Enter.
4. For measurable tasks, enter the amount completed in the Progress field. The bar and percentage update immediately.
5. Use the date picker to switch between today and other dates with saved tasks.

## Project Structure

```text
my-todo-list-2/
├── index.html   # Page structure and form controls
├── style.css    # Layout, responsive design, and visual styling
├── script.js    # Task logic, rendering, and localStorage persistence
└── README.md    # Project documentation
```

## Data Storage

Tasks are stored in the browser's `localStorage` under the key `my-tasks`. Data is local to the browser and device being used. Clearing browser site data will remove the saved tasks.

## Requirements

- A modern web browser
- VS Code and Live Server for the recommended development workflow
- No build tools, package manager, or external JavaScript framework