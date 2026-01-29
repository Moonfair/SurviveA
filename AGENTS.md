# AGENTS.md - Development Guidelines for American Survival Simulator

## Project Overview
This is a browser-based survival simulation game (美国生存模拟器) built with vanilla JavaScript. The game simulates surviving in America with complex mechanics including health, spirit, money, credit, social connections, and income management.

## Build/Test Commands

### Running the Game
```bash
# No build system - direct browser execution
# Open index.html in any web browser
open index.html
```

### Testing
```bash
# No automated test framework - manual testing only
# Test by playing the game in browser
# Check console for debug output and errors
```

### Development Workflow
```bash
# Edit files directly - no compilation step
# Refresh browser to see changes
# Use browser dev tools for debugging
```

## Code Style Guidelines

### JavaScript Conventions
- **Modern ES6+ syntax**: Use `const`, `let`, arrow functions, template literals
- **camelCase** for variables and functions: `gameState`, `renderStatus`, `handleEvent`
- **UPPER_SNAKE_CASE** for constants: `GAME_CONFIG`, `STATUS_MAP`, `BUFF_CONFIG`
- **Functional programming**: Prefer higher-order functions (filter, find, reduce)
- **No semicolons**: Follow existing code style - omit semicolons

### File Organization
```
/
├── index.html          # Main HTML entry point
├── game.js            # Core game logic and state management
├── config.js          # Game configuration and events
├── config_expanded.js # Expanded event set (102+ events)
├── style.css          # Responsive styling
├── 大纲.md            # Game design outline (Chinese)
└── todo.md            # Development todo list
```

### Import/Dependency Patterns
- **Script tag loading**: Load in order - config first, then game logic
- **Global variables**: Use `const` for configuration, `let` for game state
- **No external dependencies**: Pure vanilla JavaScript
- **DOM access**: Use `document.getElementById()` for element selection

### State Management
- **Centralized state**: Single `gameState` object for all game data
- **Immutable updates**: Create new objects when updating state
- **Flag system**: Use `gameState.customFlag` for complex game state tracking
- **Buff system**: `gameState.activeBuffs` array for temporary effects

### Naming Conventions
- **Functions**: Descriptive verbs - `renderStatus()`, `checkGameOver()`, `triggerEvent()`
- **Variables**: Noun-based - `currentStatus`, `eventIndex`, `activeBuffs`
- **Event IDs**: Descriptive strings - `job_loss`, `medical_emergency`, `investment_opportunity`
- **CSS Classes**: kebab-case - `status-box`, `event-title`, `option-btn`

### Error Handling
- **Minimal try-catch**: Only use in critical sections (debug functions)
- **Console logging**: Extensive console.log for game state debugging
- **Graceful degradation**: Game continues even with non-critical errors
- **User feedback**: Display error messages in UI when appropriate

### UI/UX Patterns
- **Mobile-first**: Responsive design with `user-scalable=no` viewport
- **Progress bars**: Visual status indicators for all attributes
- **Modal system**: Use `resultModal` for game over screens
- **Chinese localization**: All UI text in Chinese characters

### Game Mechanics Guidelines
- **Turn-based system**: 25 turns per game (configurable via `GAME_CONFIG.totalEventNum`)
- **Attribute ranges**: 0-100 for most attributes, money in USD
- **Kill line**: $140,000 survival threshold (`GAME_CONFIG.killLineThreshold`)
- **Event weighting**: Use `weight` property for random event selection
- **Trigger conditions**: Use `triggerFlag` for conditional events

### Code Structure Patterns
```javascript
// Function organization
function initStatus() { /* initialization */ }
function renderStatus() { /* UI updates */ }
function handleEvent() { /* game logic */ }
function checkGameOver() { /* end conditions */ }

// Event structure
const EVENT_EXAMPLE = {
    id: "event_id",
    title: "事件标题",
    desc: "事件描述",
    options: [
        {
            text: "选项文本",
            result: {
                text: "结果描述",
                effects: { health: -10, money: 1000 }
            }
        }
    ]
}
```

### CSS Guidelines
- **Mobile-first**: Use max-width for desktop adaptation
- **Flexbox**: Prefer flexbox for layouts
- **CSS variables**: Define colors and sizes as CSS custom properties
- **Dark theme**: Use dark color scheme (#1a1a1a, #2d2d2d, #444)
- **Responsive**: Design for mobile screens first

### Performance Considerations
- **No build step**: Direct file serving - optimize file sizes
- **DOM updates**: Minimize DOM manipulation, batch updates
- **Event delegation**: Use event listeners efficiently
- **Memory management**: Clean up intervals and event listeners

### Debugging
- **Console output**: Use console.log for game state tracking
- **Browser dev tools**: Use for DOM inspection and debugging
- **Error handling**: Check browser console for JavaScript errors
- **State inspection**: Log gameState object frequently

## Development Notes
- **Language**: Game is primarily in Chinese - maintain consistency
- **Browser compatibility**: Modern browsers only (ES6+ features)
- **File encoding**: UTF-8 for Chinese character support
- **No package management**: All code is self-contained
- **Direct execution**: No build tools, bundlers, or transpilation needed