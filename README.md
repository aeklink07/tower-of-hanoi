# 🗼 Tower of Hanoi - Modern Web Game

A modern, responsive, and multilingual implementation of the classic Tower of Hanoi puzzle game. Built with vanilla HTML, CSS, and JavaScript - no server required!

## ✨ Features

### 🎮 Gameplay
- **Interactive Gameplay**: Click-based disk movement system
- **Multiple Difficulty Levels**: 3-6 disks for varying challenge levels
- **Move Counter**: Track your efficiency
- **Timer**: Monitor your solving time
- **Undo Functionality**: Undo your last move
- **Hint System**: Get helpful suggestions when stuck
- **Win Detection**: Automatic puzzle completion detection

### 🌍 Multilingual Support
- **Dynamic Language Detection**: Automatically detects available language files
- **Easy Language Addition**: Simply add new JSON files to the `languages/` folder
- **Included Languages**: 
  - English (en)
  - Turkish (tr)
- **Extensible**: Support for Spanish, French, German, and more can be easily added

### 🎨 Modern Design
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations
- **Dark Theme**: Beautiful gradient backgrounds and modern styling
- **Accessibility**: Keyboard shortcuts and screen-reader friendly
- **Smooth Animations**: Fluid disk movements and hover effects

### ⚡ Technical Features
- **No Server Required**: Pure client-side implementation
- **GitHub Pages Compatible**: Deploy directly to GitHub Pages
- **Local Storage**: Remembers language preference
- **Performance Optimized**: Smooth 60fps animations
- **Cross-Browser Compatible**: Works in all modern browsers

## 🚀 Getting Started

### Simple Setup
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start playing!

### GitHub Pages Deployment
1. Fork this repository
2. Go to Settings > Pages
3. Select "Deploy from a branch"
4. Choose "main" branch and "/" root
5. Your game will be available at `https://yourusername.github.io/tower-of-hanoi`

## 🌐 Adding New Languages

Adding support for a new language is extremely simple:

1. Create a new JSON file in the `languages/` folder (e.g., `es.json` for Spanish)
2. Copy the structure from `en.json` and translate the values
3. The game will automatically detect and include the new language

## 🎯 How to Play

1. **Objective**: Move all disks from the left peg to the right peg
2. **Rules**:
   - Only move one disk at a time
   - Never place a larger disk on top of a smaller one
   - Use the middle peg as a temporary holder
3. **Controls**:
   - Click a peg to select it as source
   - Click another peg to move the top disk there
   - Use keyboard shortcuts: R (reset), N (new game), H (hint), U (undo)

## 🎮 Game Controls

### Mouse Controls
- **Click Peg**: Select source or destination
- **Click Buttons**: Use the control panel buttons

### Keyboard Shortcuts
- **R**: Reset game
- **N**: New game
- **H**: Show hint
- **U**: Undo last move
- **1-3**: Select peg by number

## 📱 Responsive Design

The game is fully responsive and works perfectly on:
- **Desktop**: Full-featured experience with hover effects
- **Tablet**: Touch-optimized interface
- **Mobile**: Compact layout with larger touch targets

## 🌟 Future Enhancements

- **Sound Effects**: Audio feedback for moves and wins
- **Statistics**: Track best times and move counts
- **Auto-Solve Animation**: Demonstration mode
- **Themes**: Multiple color schemes
- **Difficulty Progression**: Unlock higher difficulties
- **Online Leaderboards**: Compare with other players

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

If you encounter any issues or have suggestions, please open an issue on GitHub.

---

Enjoy playing the Tower of Hanoi! 🎮✨