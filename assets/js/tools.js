class WebToolsCollection {
    constructor() {
        this.currentLanguage = this.getCookie('webToolsLanguage') || 'en';
        this.availableLanguages = [];
        this.translations = {};
        this.currentTool = null;
        
        this.init();
    }

    setCookie(name, value, days = 365) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    async init() {
        await this.loadAvailableLanguages();
        await this.loadTranslations(this.currentLanguage);
        await this.loadFooter();
        this.setupEventListeners();
        this.setupLanguageSelector();
        this.updateTexts();
    }

    async loadAvailableLanguages() {
        try {
            const response = await fetch('languages/');
            const text = await response.text();
            
            // Extract language files from directory listing
            const matches = text.match(/href="([a-z]{2}\.json)"/g);
            if (matches) {
                this.availableLanguages = matches.map(match => {
                    const file = match.match(/href="([a-z]{2})\.json"/)[1];
                    return file;
                });
            } else {
                this.availableLanguages = ['en', 'tr', 'es', 'de', 'it', 'ru', 'fr'];
            }
        } catch (error) {
            console.warn('Could not load language directory, using default languages');
            this.availableLanguages = ['en', 'tr', 'es', 'de', 'it', 'ru', 'fr'];
        }
    }

    async loadTranslations(language) {
        try {
            const response = await fetch(`languages/${language}.json`);
            this.translations = await response.json();
        } catch (error) {
            console.warn(`Could not load translations for ${language}, falling back to English`);
            if (language !== 'en') {
                await this.loadTranslations('en');
            }
        }
    }

    async loadFooter() {
        try {
            const response = await fetch('footer.html');
            const footerHtml = await response.text();
            document.getElementById('footer-container').innerHTML = footerHtml;
        } catch (error) {
            console.warn('Could not load footer');
        }
    }

    setupEventListeners() {
        // Tool cards click handlers
        document.querySelectorAll('.tool-card').forEach(card => {
            card.addEventListener('click', () => {
                const toolType = card.getAttribute('data-tool');
                this.openTool(toolType);
            });
        });

        // Modal close handlers
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal when clicking outside
        document.getElementById('toolModal').addEventListener('click', (e) => {
            if (e.target.id === 'toolModal') {
                this.closeModal();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentTool) {
                this.closeModal();
            }
        });
    }

    setupLanguageSelector() {
        const languageSelect = document.getElementById('languageSelect');
        
        // Set current language
        languageSelect.value = this.currentLanguage;
        
        // Add change handler
        languageSelect.addEventListener('change', async (e) => {
            const newLanguage = e.target.value;
            this.currentLanguage = newLanguage;
            this.setCookie('webToolsLanguage', newLanguage);
            await this.loadTranslations(newLanguage);
            this.updateTexts();
        });
    }

    updateTexts() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (this.translations[key]) {
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.placeholder = this.translations[key];
                } else {
                    element.textContent = this.translations[key];
                }
            }
        });
    }

    t(key) {
        return this.translations[key] || key;
    }

    openTool(toolType) {
        this.currentTool = toolType;
        const modal = document.getElementById('toolModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        // Set title
        modalTitle.textContent = this.getToolTitle(toolType);

        // Load tool interface
        modalBody.innerHTML = this.getToolInterface(toolType);

        // Show modal
        modal.classList.add('show');
        modal.style.display = 'flex';

        // Initialize tool
        this.initializeTool(toolType);
    }

    closeModal() {
        const modal = document.getElementById('toolModal');
        modal.classList.remove('show');
        modal.style.display = 'none';
        this.currentTool = null;
    }

    getToolTitle(toolType) {
        const titles = {
            'color-picker': this.t('colorPicker'),
            'text-counter': this.t('textCounter'),
            'qr-generator': this.t('qrGenerator'),
            'password-generator': this.t('passwordGenerator'),
            'base64-encoder': this.t('base64Encoder'),
            'url-tools': this.t('urlTools'),
            'json-formatter': this.t('jsonFormatter'),
            'unit-converter': this.t('unitConverter'),
            'random-generator': this.t('randomGenerator'),
            'timestamp-converter': this.t('timestampConverter')
        };
        return titles[toolType] || toolType;
    }

    getToolInterface(toolType) {
        switch (toolType) {
            case 'color-picker':
                return this.getColorPickerInterface();
            case 'text-counter':
                return this.getTextCounterInterface();
            case 'qr-generator':
                return this.getQRGeneratorInterface();
            case 'password-generator':
                return this.getPasswordGeneratorInterface();
            case 'base64-encoder':
                return this.getBase64EncoderInterface();
            case 'url-tools':
                return this.getUrlToolsInterface();
            case 'json-formatter':
                return this.getJSONFormatterInterface();
            case 'unit-converter':
                return this.getUnitConverterInterface();
            case 'random-generator':
                return this.getRandomGeneratorInterface();
            case 'timestamp-converter':
                return this.getTimestampConverterInterface();
            default:
                return '<p>Tool not implemented yet.</p>';
        }
    }

    getColorPickerInterface() {
        return `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="colorInput">${this.t('selectColor') || 'Select Color'}:</label>
                    <input type="color" id="colorInput" value="#ff0000">
                </div>
                
                <div class="color-preview">
                    <div class="color-preview-fill" id="colorPreview"></div>
                </div>
                
                <div class="output-group">
                    <h4>${this.t('colorCodes') || 'Color Codes'}:</h4>
                    <div class="color-codes">
                        <div class="color-code-item">
                            <label>HEX:</label>
                            <div class="color-code-value" id="hexValue" onclick="webTools.copyToClipboard(this)">
                                #ff0000
                                <span class="copy-feedback">${this.t('copied') || 'Copied!'}</span>
                            </div>
                        </div>
                        <div class="color-code-item">
                            <label>RGB:</label>
                            <div class="color-code-value" id="rgbValue" onclick="webTools.copyToClipboard(this)">
                                rgb(255, 0, 0)
                                <span class="copy-feedback">${this.t('copied') || 'Copied!'}</span>
                            </div>
                        </div>
                        <div class="color-code-item">
                            <label>HSL:</label>
                            <div class="color-code-value" id="hslValue" onclick="webTools.copyToClipboard(this)">
                                hsl(0, 100%, 50%)
                                <span class="copy-feedback">${this.t('copied') || 'Copied!'}</span>
                            </div>
                        </div>
                        <div class="color-code-item">
                            <label>RGBA:</label>
                            <div class="color-code-value" id="rgbaValue" onclick="webTools.copyToClipboard(this)">
                                rgba(255, 0, 0, 1)
                                <span class="copy-feedback">${this.t('copied') || 'Copied!'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getTextCounterInterface() {
        return `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="textInput">${this.t('enterText') || 'Enter your text'}:</label>
                    <textarea id="textInput" placeholder="${this.t('typeHere') || 'Type or paste your text here...'}"></textarea>
                </div>
                
                <div class="output-group">
                    <h4>${this.t('statistics') || 'Statistics'}:</h4>
                    <div class="color-codes">
                        <div class="color-code-item">
                            <label>${this.t('characters') || 'Characters'}:</label>
                            <div class="color-code-value" id="charCount">0</div>
                        </div>
                        <div class="color-code-item">
                            <label>${this.t('charactersNoSpaces') || 'Characters (no spaces)'}:</label>
                            <div class="color-code-value" id="charNoSpaceCount">0</div>
                        </div>
                        <div class="color-code-item">
                            <label>${this.t('words') || 'Words'}:</label>
                            <div class="color-code-value" id="wordCount">0</div>
                        </div>
                        <div class="color-code-item">
                            <label>${this.t('lines') || 'Lines'}:</label>
                            <div class="color-code-value" id="lineCount">0</div>
                        </div>
                        <div class="color-code-item">
                            <label>${this.t('paragraphs') || 'Paragraphs'}:</label>
                            <div class="color-code-value" id="paragraphCount">0</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getQRGeneratorInterface() {
        return `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="qrInput">${this.t('enterTextOrUrl') || 'Enter text or URL'}:</label>
                    <textarea id="qrInput" placeholder="${this.t('typeTextOrUrl') || 'Type text or URL here...'}"></textarea>
                </div>
                
                <div class="button-group">
                    <button class="btn btn-primary" onclick="webTools.generateQR()">${this.t('generateQR') || 'Generate QR Code'}</button>
                </div>
                
                <div class="output-group" id="qrOutput" style="display: none;">
                    <h4>${this.t('qrCode') || 'QR Code'}:</h4>
                    <div id="qrcode" style="text-align: center; margin: 1rem 0;"></div>
                    <div class="button-group" style="justify-content: center;">
                        <button class="btn btn-secondary" onclick="webTools.downloadQR()">${this.t('download') || 'Download'}</button>
                    </div>
                </div>
            </div>
        `;
    }

    getPasswordGeneratorInterface() {
        return `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="passwordLength">${this.t('passwordLength') || 'Password Length'}:</label>
                    <input type="range" id="passwordLength" min="4" max="50" value="12">
                    <span id="lengthDisplay">12</span>
                </div>
                
                <div class="input-group">
                    <label>${this.t('options') || 'Options'}:</label>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <label style="display: flex; align-items: center; gap: 0.5rem;">
                            <input type="checkbox" id="includeUppercase" checked>
                            ${this.t('includeUppercase') || 'Include Uppercase (A-Z)'}
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem;">
                            <input type="checkbox" id="includeLowercase" checked>
                            ${this.t('includeLowercase') || 'Include Lowercase (a-z)'}
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem;">
                            <input type="checkbox" id="includeNumbers" checked>
                            ${this.t('includeNumbers') || 'Include Numbers (0-9)'}
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem;">
                            <input type="checkbox" id="includeSymbols">
                            ${this.t('includeSymbols') || 'Include Symbols (!@#$%^&*)'}
                        </label>
                    </div>
                </div>
                
                <div class="button-group">
                    <button class="btn btn-primary" onclick="webTools.generatePassword()">${this.t('generatePassword') || 'Generate Password'}</button>
                </div>
                
                <div class="output-group" id="passwordOutput" style="display: none;">
                    <h4>${this.t('generatedPassword') || 'Generated Password'}:</h4>
                    <div class="color-code-value" id="passwordResult" onclick="webTools.copyToClipboard(this)">
                        <span class="copy-feedback">${this.t('copied') || 'Copied!'}</span>
                    </div>
                </div>
            </div>
        `;
    }

    getBase64EncoderInterface() {
        return `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="base64Input">${this.t('enterText') || 'Enter text'}:</label>
                    <textarea id="base64Input" placeholder="${this.t('typeTextHere') || 'Type text here...'}"></textarea>
                </div>
                
                <div class="button-group">
                    <button class="btn btn-primary" onclick="webTools.encodeBase64()">${this.t('encode') || 'Encode'}</button>
                    <button class="btn btn-secondary" onclick="webTools.decodeBase64()">${this.t('decode') || 'Decode'}</button>
                </div>
                
                <div class="output-group">
                    <h4>${this.t('result') || 'Result'}:</h4>
                    <div class="result-display" id="base64Result" onclick="webTools.copyToClipboard(this)"></div>
                </div>
            </div>
        `;
    }

    getUrlToolsInterface() {
        return `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="urlInput">${this.t('enterUrl') || 'Enter URL'}:</label>
                    <input type="text" id="urlInput" placeholder="https://example.com">
                </div>
                
                <div class="button-group">
                    <button class="btn btn-primary" onclick="webTools.encodeUrl()">${this.t('encodeUrl') || 'Encode URL'}</button>
                    <button class="btn btn-secondary" onclick="webTools.decodeUrl()">${this.t('decodeUrl') || 'Decode URL'}</button>
                </div>
                
                <div class="output-group">
                    <h4>${this.t('result') || 'Result'}:</h4>
                    <div class="result-display" id="urlResult" onclick="webTools.copyToClipboard(this)"></div>
                </div>
            </div>
        `;
    }

    getJSONFormatterInterface() {
        return `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="jsonInput">${this.t('enterJson') || 'Enter JSON'}:</label>
                    <textarea id="jsonInput" placeholder='{"key": "value"}'></textarea>
                </div>
                
                <div class="button-group">
                    <button class="btn btn-primary" onclick="webTools.formatJSON()">${this.t('format') || 'Format'}</button>
                    <button class="btn btn-secondary" onclick="webTools.minifyJSON()">${this.t('minify') || 'Minify'}</button>
                    <button class="btn btn-info" onclick="webTools.validateJSON()">${this.t('validate') || 'Validate'}</button>
                </div>
                
                <div class="output-group">
                    <h4>${this.t('result') || 'Result'}:</h4>
                    <div class="result-display" id="jsonResult"></div>
                </div>
            </div>
        `;
    }

    getUnitConverterInterface() {
        return `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="unitType">${this.t('conversionType') || 'Conversion Type'}:</label>
                    <select id="unitType" onchange="webTools.updateUnitOptions()">
                        <option value="length">${this.t('length') || 'Length'}</option>
                        <option value="weight">${this.t('weight') || 'Weight'}</option>
                        <option value="temperature">${this.t('temperature') || 'Temperature'}</option>
                    </select>
                </div>
                
                <div class="input-group">
                    <label for="inputValue">${this.t('value') || 'Value'}:</label>
                    <input type="number" id="inputValue" placeholder="1" onchange="webTools.convertUnit()">
                </div>
                
                <div class="input-group">
                    <label for="fromUnit">${this.t('from') || 'From'}:</label>
                    <select id="fromUnit" onchange="webTools.convertUnit()"></select>
                </div>
                
                <div class="input-group">
                    <label for="toUnit">${this.t('to') || 'To'}:</label>
                    <select id="toUnit" onchange="webTools.convertUnit()"></select>
                </div>
                
                <div class="output-group">
                    <h4>${this.t('result') || 'Result'}:</h4>
                    <div class="result-display" id="unitResult"></div>
                </div>
            </div>
        `;
    }

    getRandomGeneratorInterface() {
        return `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="minValue">${this.t('minimumValue') || 'Minimum Value'}:</label>
                    <input type="number" id="minValue" value="1">
                </div>
                
                <div class="input-group">
                    <label for="maxValue">${this.t('maximumValue') || 'Maximum Value'}:</label>
                    <input type="number" id="maxValue" value="100">
                </div>
                
                <div class="input-group">
                    <label for="countValue">${this.t('count') || 'Count'}:</label>
                    <input type="number" id="countValue" value="1" min="1" max="100">
                </div>
                
                <div class="button-group">
                    <button class="btn btn-primary" onclick="webTools.generateRandomNumbers()">${this.t('generate') || 'Generate'}</button>
                </div>
                
                <div class="output-group">
                    <h4>${this.t('randomNumbers') || 'Random Numbers'}:</h4>
                    <div class="result-display" id="randomResult"></div>
                </div>
            </div>
        `;
    }

    getTimestampConverterInterface() {
        return `
            <div class="tool-interface">
                <div class="input-group">
                    <label for="timestampInput">${this.t('timestamp') || 'Timestamp'}:</label>
                    <input type="number" id="timestampInput" placeholder="1234567890">
                </div>
                
                <div class="button-group">
                    <button class="btn btn-primary" onclick="webTools.convertTimestamp()">${this.t('convert') || 'Convert'}</button>
                    <button class="btn btn-secondary" onclick="webTools.getCurrentTimestamp()">${this.t('currentTimestamp') || 'Current Timestamp'}</button>
                </div>
                
                <div class="output-group">
                    <h4>${this.t('result') || 'Result'}:</h4>
                    <div class="result-display" id="timestampResult"></div>
                </div>
            </div>
        `;
    }

    initializeTool(toolType) {
        switch (toolType) {
            case 'color-picker':
                this.initializeColorPicker();
                break;
            case 'text-counter':
                this.initializeTextCounter();
                break;
            case 'password-generator':
                this.initializePasswordGenerator();
                break;
            case 'unit-converter':
                this.initializeUnitConverter();
                break;
        }
    }

    initializeColorPicker() {
        const colorInput = document.getElementById('colorInput');
        colorInput.addEventListener('input', (e) => {
            this.updateColorCodes(e.target.value);
        });
        
        // Initialize with default color
        this.updateColorCodes('#ff0000');
    }

    updateColorCodes(hex) {
        const colorPreview = document.getElementById('colorPreview');
        const hexValue = document.getElementById('hexValue');
        const rgbValue = document.getElementById('rgbValue');
        const hslValue = document.getElementById('hslValue');
        const rgbaValue = document.getElementById('rgbaValue');

        // Update preview
        colorPreview.style.backgroundColor = hex;

        // Convert hex to RGB
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        // Convert RGB to HSL
        const hsl = this.rgbToHsl(r, g, b);

        // Update values
        hexValue.childNodes[0].textContent = hex.toLowerCase();
        rgbValue.childNodes[0].textContent = `rgb(${r}, ${g}, ${b})`;
        hslValue.childNodes[0].textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        rgbaValue.childNodes[0].textContent = `rgba(${r}, ${g}, ${b}, 1)`;
    }

    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    initializeTextCounter() {
        const textInput = document.getElementById('textInput');
        textInput.addEventListener('input', () => {
            this.updateTextCount();
        });
    }

    updateTextCount() {
        const text = document.getElementById('textInput').value;
        
        const charCount = text.length;
        const charNoSpaceCount = text.replace(/\s/g, '').length;
        const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
        const lineCount = text.split('\n').length;
        const paragraphCount = text.trim() ? text.split(/\n\s*\n/).length : 0;

        document.getElementById('charCount').textContent = charCount;
        document.getElementById('charNoSpaceCount').textContent = charNoSpaceCount;
        document.getElementById('wordCount').textContent = wordCount;
        document.getElementById('lineCount').textContent = lineCount;
        document.getElementById('paragraphCount').textContent = paragraphCount;
    }

    initializePasswordGenerator() {
        const lengthSlider = document.getElementById('passwordLength');
        const lengthDisplay = document.getElementById('lengthDisplay');
        
        lengthSlider.addEventListener('input', (e) => {
            lengthDisplay.textContent = e.target.value;
        });
    }

    generatePassword() {
        const length = parseInt(document.getElementById('passwordLength').value);
        const includeUppercase = document.getElementById('includeUppercase').checked;
        const includeLowercase = document.getElementById('includeLowercase').checked;
        const includeNumbers = document.getElementById('includeNumbers').checked;
        const includeSymbols = document.getElementById('includeSymbols').checked;

        let charset = '';
        if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (includeNumbers) charset += '0123456789';
        if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        if (!charset) {
            alert(this.t('selectAtLeastOneOption') || 'Please select at least one option');
            return;
        }

        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        const output = document.getElementById('passwordOutput');
        const result = document.getElementById('passwordResult');
        result.childNodes[0].textContent = password;
        output.style.display = 'block';
    }

    generateQR() {
        const text = document.getElementById('qrInput').value.trim();
        if (!text) {
            alert(this.t('pleaseEnterText') || 'Please enter text or URL');
            return;
        }

        // Simple QR code generation using a placeholder
        // In a real implementation, you would use a QR code library
        const qrDiv = document.getElementById('qrcode');
        qrDiv.innerHTML = `
            <div style="width: 200px; height: 200px; background: #000; margin: 0 auto; position: relative; border: 2px solid #ccc;">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #fff; text-align: center; font-size: 12px; padding: 10px;">
                    QR Code<br/>${text.substring(0, 20)}${text.length > 20 ? '...' : ''}
                </div>
            </div>
            <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
                ${this.t('qrPlaceholder') || 'QR Code placeholder - In a real implementation, this would be a proper QR code'}
            </p>
        `;

        document.getElementById('qrOutput').style.display = 'block';
    }

    downloadQR() {
        alert(this.t('downloadNotAvailable') || 'Download functionality would be implemented with a proper QR code library');
    }

    encodeBase64() {
        const text = document.getElementById('base64Input').value;
        try {
            const encoded = btoa(unescape(encodeURIComponent(text)));
            document.getElementById('base64Result').textContent = encoded;
        } catch (error) {
            document.getElementById('base64Result').textContent = this.t('encodingError') || 'Encoding error';
        }
    }

    decodeBase64() {
        const text = document.getElementById('base64Input').value;
        try {
            const decoded = decodeURIComponent(escape(atob(text)));
            document.getElementById('base64Result').textContent = decoded;
        } catch (error) {
            document.getElementById('base64Result').textContent = this.t('decodingError') || 'Decoding error - invalid Base64';
        }
    }

    encodeUrl() {
        const url = document.getElementById('urlInput').value;
        const encoded = encodeURIComponent(url);
        document.getElementById('urlResult').textContent = encoded;
    }

    decodeUrl() {
        const url = document.getElementById('urlInput').value;
        try {
            const decoded = decodeURIComponent(url);
            document.getElementById('urlResult').textContent = decoded;
        } catch (error) {
            document.getElementById('urlResult').textContent = this.t('decodingError') || 'Decoding error';
        }
    }

    formatJSON() {
        const text = document.getElementById('jsonInput').value;
        try {
            const parsed = JSON.parse(text);
            const formatted = JSON.stringify(parsed, null, 2);
            document.getElementById('jsonResult').textContent = formatted;
        } catch (error) {
            document.getElementById('jsonResult').textContent = this.t('invalidJson') || 'Invalid JSON: ' + error.message;
        }
    }

    minifyJSON() {
        const text = document.getElementById('jsonInput').value;
        try {
            const parsed = JSON.parse(text);
            const minified = JSON.stringify(parsed);
            document.getElementById('jsonResult').textContent = minified;
        } catch (error) {
            document.getElementById('jsonResult').textContent = this.t('invalidJson') || 'Invalid JSON: ' + error.message;
        }
    }

    validateJSON() {
        const text = document.getElementById('jsonInput').value;
        try {
            JSON.parse(text);
            document.getElementById('jsonResult').textContent = this.t('validJson') || 'Valid JSON ✓';
        } catch (error) {
            document.getElementById('jsonResult').textContent = this.t('invalidJson') || 'Invalid JSON: ' + error.message;
        }
    }

    initializeUnitConverter() {
        this.updateUnitOptions();
    }

    updateUnitOptions() {
        const unitType = document.getElementById('unitType').value;
        const fromUnit = document.getElementById('fromUnit');
        const toUnit = document.getElementById('toUnit');

        const units = {
            length: {
                'mm': 'Millimeters',
                'cm': 'Centimeters', 
                'm': 'Meters',
                'km': 'Kilometers',
                'in': 'Inches',
                'ft': 'Feet',
                'yd': 'Yards',
                'mi': 'Miles'
            },
            weight: {
                'g': 'Grams',
                'kg': 'Kilograms',
                'oz': 'Ounces',
                'lb': 'Pounds',
                't': 'Tonnes'
            },
            temperature: {
                'c': 'Celsius',
                'f': 'Fahrenheit',
                'k': 'Kelvin'
            }
        };

        const options = units[unitType];
        fromUnit.innerHTML = '';
        toUnit.innerHTML = '';

        Object.entries(options).forEach(([key, value]) => {
            fromUnit.appendChild(new Option(value, key));
            toUnit.appendChild(new Option(value, key));
        });

        this.convertUnit();
    }

    convertUnit() {
        const value = parseFloat(document.getElementById('inputValue').value) || 0;
        const unitType = document.getElementById('unitType').value;
        const fromUnit = document.getElementById('fromUnit').value;
        const toUnit = document.getElementById('toUnit').value;

        let result;

        if (unitType === 'length') {
            result = this.convertLength(value, fromUnit, toUnit);
        } else if (unitType === 'weight') {
            result = this.convertWeight(value, fromUnit, toUnit);
        } else if (unitType === 'temperature') {
            result = this.convertTemperature(value, fromUnit, toUnit);
        }

        document.getElementById('unitResult').textContent = result;
    }

    convertLength(value, from, to) {
        const meters = {
            'mm': 0.001,
            'cm': 0.01,
            'm': 1,
            'km': 1000,
            'in': 0.0254,
            'ft': 0.3048,
            'yd': 0.9144,
            'mi': 1609.344
        };

        const inMeters = value * meters[from];
        return (inMeters / meters[to]).toFixed(6);
    }

    convertWeight(value, from, to) {
        const grams = {
            'g': 1,
            'kg': 1000,
            'oz': 28.3495,
            'lb': 453.592,
            't': 1000000
        };

        const inGrams = value * grams[from];
        return (inGrams / grams[to]).toFixed(6);
    }

    convertTemperature(value, from, to) {
        let celsius;

        // Convert to Celsius first
        switch (from) {
            case 'c': celsius = value; break;
            case 'f': celsius = (value - 32) * 5/9; break;
            case 'k': celsius = value - 273.15; break;
        }

        // Convert from Celsius to target
        switch (to) {
            case 'c': return celsius.toFixed(2);
            case 'f': return (celsius * 9/5 + 32).toFixed(2);
            case 'k': return (celsius + 273.15).toFixed(2);
        }
    }

    generateRandomNumbers() {
        const min = parseInt(document.getElementById('minValue').value);
        const max = parseInt(document.getElementById('maxValue').value);
        const count = parseInt(document.getElementById('countValue').value);

        if (min >= max) {
            alert(this.t('minMaxError') || 'Minimum value must be less than maximum value');
            return;
        }

        const numbers = [];
        for (let i = 0; i < count; i++) {
            numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }

        document.getElementById('randomResult').textContent = numbers.join(', ');
    }

    convertTimestamp() {
        const timestamp = parseInt(document.getElementById('timestampInput').value);
        if (isNaN(timestamp)) {
            document.getElementById('timestampResult').textContent = this.t('invalidTimestamp') || 'Invalid timestamp';
            return;
        }

        const date = new Date(timestamp * 1000);
        const result = `
UTC: ${date.toUTCString()}
Local: ${date.toString()}
ISO: ${date.toISOString()}
Date: ${date.toDateString()}
Time: ${date.toTimeString()}
        `;

        document.getElementById('timestampResult').textContent = result;
    }

    getCurrentTimestamp() {
        const now = Math.floor(Date.now() / 1000);
        document.getElementById('timestampInput').value = now;
        this.convertTimestamp();
    }

    copyToClipboard(element) {
        const text = element.childNodes[0].textContent;
        navigator.clipboard.writeText(text).then(() => {
            const feedback = element.querySelector('.copy-feedback');
            if (feedback) {
                feedback.classList.add('show');
                setTimeout(() => {
                    feedback.classList.remove('show');
                }, 2000);
            }
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            const feedback = element.querySelector('.copy-feedback');
            if (feedback) {
                feedback.classList.add('show');
                setTimeout(() => {
                    feedback.classList.remove('show');
                }, 2000);
            }
        });
    }
}

// Initialize the application
const webTools = new WebToolsCollection();