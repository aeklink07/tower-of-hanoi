# 🔧 Web Tools Collection - Modern Online Utilities

A beautiful, modern, and multilingual collection of useful web tools for developers and everyday users. Built with vanilla HTML, CSS, and JavaScript - no server required!

## ✨ Features

### 🛠️ 10 Powerful Tools
1. **🎨 Color Picker** - Pick colors and get RGB, HEX, HSL, RGBA codes
2. **📝 Text Counter** - Count characters, words, lines, and paragraphs
3. **📱 QR Code Generator** - Generate QR codes for text and URLs
4. **🔐 Password Generator** - Create secure passwords with customizable options
5. **🔤 Base64 Encoder/Decoder** - Encode and decode Base64 strings
6. **🔗 URL Tools** - URL encoding and decoding utilities
7. **📄 JSON Formatter** - Format, minify, and validate JSON data
8. **⚖️ Unit Converter** - Convert between length, weight, and temperature units
9. **🎲 Random Number Generator** - Generate random numbers with range control
10. **⏰ Timestamp Converter** - Convert timestamps to human-readable dates

### 🌍 Multilingual Support
- **Dynamic Language Detection**: Automatically detects available language files
- **Easy Language Addition**: Simply add new JSON files to the `languages/` folder
- **Included Languages**: 
  - English (en)
  - Turkish (tr) - Türkçe
  - Spanish (es) - Español
  - German (de) - Deutsch
  - Italian (it) - Italiano
  - Russian (ru) - Русский
  - French (fr) - Français
- **Extensible**: Support for more languages can be easily added

### 🎨 Modern Design
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations
- **Beautiful Theme**: Gradient backgrounds and modern styling
- **Modal Interface**: Each tool opens in a sleek modal window
- **Accessibility**: Keyboard shortcuts and screen-reader friendly
- **Smooth Animations**: Fluid interactions and hover effects

### ⚡ Technical Features
- **No Server Required**: Pure client-side implementation
- **GitHub Pages Compatible**: Deploy directly to GitHub Pages
- **Local Storage**: Remembers language preference
- **Performance Optimized**: Smooth 60fps animations
- **Cross-Browser Compatible**: Works in all modern browsers
- **Copy to Clipboard**: Easy copying of results with feedback

## 🚀 Getting Started

### Simple Setup
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start using the tools!

### GitHub Pages Deployment
1. Fork this repository
2. Go to Settings > Pages
3. Select "Deploy from a branch"
4. Choose "main" branch and "/" root
5. Your tools will be available at `https://yourusername.github.io/tower-of-hanoi`

## 🛠️ Tool Details

### 🎨 Color Picker
- Interactive color selection with visual preview
- Instant generation of color codes in multiple formats:
  - HEX (e.g., #ff0000)
  - RGB (e.g., rgb(255, 0, 0))
  - HSL (e.g., hsl(0, 100%, 50%))
  - RGBA (e.g., rgba(255, 0, 0, 1))
- Click any color code to copy to clipboard

### 📝 Text Counter
- Real-time text analysis
- Counts:
  - Total characters (including spaces)
  - Characters without spaces
  - Word count
  - Line count
  - Paragraph count

### 🔐 Password Generator
- Customizable password length (4-50 characters)
- Options for:
  - Uppercase letters (A-Z)
  - Lowercase letters (a-z)
  - Numbers (0-9)
  - Special symbols (!@#$%^&*)
- One-click copying of generated passwords

### 📄 JSON Formatter
- Format JSON with proper indentation
- Minify JSON to remove whitespace
- Validate JSON syntax
- Clear error messages for invalid JSON

### ⚖️ Unit Converter
- **Length**: mm, cm, m, km, inches, feet, yards, miles
- **Weight**: grams, kg, ounces, pounds, tonnes
- **Temperature**: Celsius, Fahrenheit, Kelvin
- Real-time conversion as you type

### 🎲 Random Number Generator
- Generate single or multiple random numbers
- Customizable range (minimum and maximum values)
- Generate up to 100 numbers at once

## 🌐 Adding New Languages

Adding support for a new language is extremely simple:

1. Create a new JSON file in the `languages/` folder (e.g., `pt.json` for Portuguese)
2. Copy the structure from `en.json` and translate the values
3. The application will automatically detect and include the new language

Example language file structure:
```json
{
  "title": "Web Tools Collection",
  "subtitle": "Useful online tools for developers and users",
  "colorPicker": "Color Picker",
  // ... more translations
}
```

## 🎯 How to Use

1. **Browse Tools**: View all 10 available tools on the main page
2. **Select a Tool**: Click on any tool card to open it
3. **Use the Tool**: Follow the interface to use the tool's features
4. **Copy Results**: Click on results to copy them to your clipboard
5. **Switch Languages**: Use the language selector in the top-right corner

## 📱 Responsive Design

The tools work perfectly on:
- **Desktop**: Full-featured experience with hover effects
- **Tablet**: Touch-optimized interface with proper spacing
- **Mobile**: Compact layout with larger touch targets and optimized modals

## 🌟 Future Enhancements

- **Sound Effects**: Audio feedback for actions
- **Statistics**: Track usage and favorite tools
- **Themes**: Multiple color schemes and dark mode
- **More Tools**: Additional utilities based on user feedback
- **Offline Support**: Progressive Web App (PWA) capabilities
- **Tool Favorites**: Mark and organize favorite tools

## 🤝 Contributing

We welcome contributions! You can help by:
- **Adding new languages**: Create translation files
- **Adding new tools**: Implement additional utilities
- **Improving existing tools**: Enhance functionality
- **Reporting bugs**: Help us fix issues
- **Suggesting features**: Share your ideas

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

If you encounter any issues or have suggestions, please open an issue on GitHub.

---

**Made with ❤️ for developers and users around the world!** 

🛠️ Built with: HTML5 • CSS3 • JavaScript ES6+ • Font Awesome • Google Fonts