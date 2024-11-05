# Todo App Test Documentation

This document outlines the test scenarios for the Todo application using Playwright.

## Test Setup

- Base URL: `https://demo.playwright.dev/todomvc`
- Test items: 
  - "buy some cheese"
  - "feed the cat"
  - "book a doctors appointment"

## Test Scenarios

### 1. New Todo Operations

#### Adding Todo Items
- Can add single todo item
- Can add multiple todo items
- Input field clears after adding item
- New items append to bottom of list
- Counter updates correctly with new items

#### Input Validation
- Trims whitespace from entered text
- Empty text entries are not added

### 2. Todo Item Management

#### Marking Items Complete
- Can mark individual items as complete
- Can mark all items complete at once
- Can unmark completed items
- "Completed" class is added/removed appropriately

#### Editing Items
- Double-click enables edit mode
- Other controls hide during editing
- Changes save on blur
- Changes save on Enter
- Empty edit removes item
- Escape cancels edit
- Whitespace is trimmed

### 3. Filtering and Navigation

#### Filter Views
- "All" shows all items
- "Active" shows only uncompleted items
- "Completed" shows only completed items
- Current filter is highlighted
- Browser back/forward navigation works

#### Clear Completed
- Button appears when completed items exist
- Button removes all completed items
- Button hides when no completed items exist

### 4. Data Persistence

- Todo items persist after page reload
- Completed states persist after reload
- Item count persists
- Completed count persists

### 5. Counter Functionality

- Displays correct number of active items
- Updates when items are added/removed
- Updates when items are completed/uncompleted

## Helper Functions

### `createDefaultTodos(page)`
Creates the three default todo items for testing

### `checkNumberOfTodosInLocalStorage(page, expected)`
Verifies the total number of todos in localStorage

### `checkNumberOfCompletedTodosInLocalStorage(page, expected)`
Verifies the number of completed todos in localStorage

### `checkTodosInLocalStorage(page, title)`
Verifies specific todo exists in localStorage

## Test Coverage Areas

1. ✅ Item Creation
2. ✅ Item Editing
3. ✅ Item Completion
4. ✅ Item Deletion
5. ✅ Filtering
6. ✅ Persistence
7. ✅ Counter Updates
8. ✅ UI State Management
9. ✅ Browser Navigation

## Running Tests

Tests are written using Playwright Test framework and can be executed using: