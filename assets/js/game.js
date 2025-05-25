class TowerOfHanoi {
    constructor() {
        this.pegs = [[], [], []];
        this.numDisks = parseInt(this.getCookie('towerOfHanoiDisks')) || 3;
        this.moves = 0;
        this.gameStarted = false;
        this.gameFinished = false;
        this.startTime = null;
        this.elapsedTime = 0;
        this.timer = null;
        this.selectedPeg = null;
        this.moveHistory = [];
        this.currentLanguage = this.getCookie('towerOfHanoiLanguage') || 'en';
        this.availableLanguages = [];
        this.translations = {};
        this.draggedDisk = null;
        this.draggedFromPeg = null;
        
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

    deleteCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    async init() {
        await this.loadAvailableLanguages();
        await this.loadTranslations(this.currentLanguage);
        await this.loadFooter();
        this.setupEventListeners();
        this.setupLanguageSelector();
        this.updateTexts();
        this.loadSavedSettings();
        this.resetGame();
    }

    async loadFooter() {
        try {
            const response = await fetch('footer.html');
            if (response.ok) {
                const footerHTML = await response.text();
                document.getElementById('footer-container').innerHTML = footerHTML;
            }
        } catch (error) {
            console.warn('Footer could not be loaded:', error);
        }
    }

    async loadAvailableLanguages() {
        try {
            const languages = ['en', 'tr', 'es', 'de', 'it', 'ru'];
            
            for (const lang of languages) {
                try {
                    const response = await fetch(`languages/${lang}.json`);
                    if (response.ok) {
                        this.availableLanguages.push({
                            code: lang,
                            name: this.getLanguageName(lang)
                        });
                    }
                } catch (error) {
                    console.warn(`Language file ${lang}.json not found`);
                }
            }

            try {
                const additionalLangs = ['fr', 'pt', 'zh', 'ja', 'ko'];
                for (const lang of additionalLangs) {
                    try {
                        const response = await fetch(`languages/${lang}.json`);
                        if (response.ok) {
                            const langName = this.getLanguageName(lang);
                            this.availableLanguages.push({
                                code: lang,
                                name: langName
                            });
                        }
                    } catch (error) {
                    }
                }
            } catch (error) {
                console.warn('Error detecting additional languages');
            }

        } catch (error) {
            console.error('Error loading available languages:', error);
            this.availableLanguages = [{ code: 'en', name: 'English' }];
        }
    }

    getLanguageName(code) {
        const languageNames = {
            'en': 'English',
            'tr': 'Türkçe',
            'es': 'Español',
            'de': 'Deutsch',
            'it': 'Italiano',
            'ru': 'Русский',
            'fr': 'Français',
            'pt': 'Português',
            'zh': '中文',
            'ja': '日本語',
            'ko': '한국어'
        };
        return languageNames[code] || code.toUpperCase();
    }

    async loadTranslations(language) {
        try {
            const response = await fetch(`languages/${language}.json`);
            if (!response.ok) {
                throw new Error(`Language file not found: ${language}`);
            }
            this.translations = await response.json();
        } catch (error) {
            console.error('Error loading translations:', error);
            if (language !== 'en') {
                await this.loadTranslations('en');
            }
        }
    }

    setupLanguageSelector() {
        const languageSelect = document.getElementById('languageSelect');
        languageSelect.innerHTML = '';
        
        this.availableLanguages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.code;
            option.textContent = lang.name;
            if (lang.code === this.currentLanguage) {
                option.selected = true;
            }
            languageSelect.appendChild(option);
        });
    }

    updateTexts() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (this.translations[key]) {
                if (element.tagName === 'OPTION') {
                    element.textContent = this.translations[key];
                } else {
                    element.textContent = this.translations[key];
                }
            }
        });

        document.title = this.translations.title || 'Tower of Hanoi';
        document.documentElement.lang = this.currentLanguage;
    }

    setupEventListeners() {
        document.getElementById('languageSelect').addEventListener('change', async (e) => {
            this.currentLanguage = e.target.value;
            this.setCookie('towerOfHanoiLanguage', this.currentLanguage);
            await this.loadTranslations(this.currentLanguage);
            this.updateTexts();
            this.updateStatusMessage(this.translations.clickPegFrom);
        });

        document.getElementById('difficultySelect').addEventListener('change', (e) => {
            this.numDisks = parseInt(e.target.value);
            this.setCookie('towerOfHanoiDisks', this.numDisks);
            document.getElementById('diskCount').textContent = this.numDisks;
            this.resetGame();
        });

        document.getElementById('newGameBtn').addEventListener('click', () => this.startNewGame());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('hintBtn').addEventListener('click', () => this.showHint());
        document.getElementById('undoBtn').addEventListener('click', () => this.undoMove());
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.hideWinModal();
            this.startNewGame();
        });

        document.querySelectorAll('.peg').forEach((peg, index) => {
            peg.addEventListener('click', () => this.handlePegClick(index));
            
            peg.addEventListener('dragover', (e) => this.handleDragOver(e));
            peg.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            peg.addEventListener('drop', (e) => this.handleDrop(e, index));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' || e.key === 'R') this.resetGame();
            if (e.key === 'n' || e.key === 'N') this.startNewGame();
            if (e.key === 'h' || e.key === 'H') this.showHint();
            if (e.key === 'u' || e.key === 'U') this.undoMove();
            if (e.key >= '1' && e.key <= '3') {
                this.handlePegClick(parseInt(e.key) - 1);
            }
        });
    }

    loadSavedSettings() {
        const savedDisks = this.getCookie('towerOfHanoiDisks');
        if (savedDisks) {
            this.numDisks = parseInt(savedDisks);
            document.getElementById('difficultySelect').value = this.numDisks;
            document.getElementById('diskCount').textContent = this.numDisks;
        }
    }

    startNewGame() {
        this.resetGame();
        this.gameStarted = true;
        this.startTime = Date.now();
        this.startTimer();
        this.updateStatusMessage(this.translations.clickPegFrom);
    }

    resetGame() {
        this.stopTimer();
        this.gameStarted = false;
        this.gameFinished = false;
        this.moves = 0;
        this.elapsedTime = 0;
        this.selectedPeg = null;
        this.moveHistory = [];
        
        this.pegs = [[], [], []];
        for (let i = this.numDisks; i >= 1; i--) {
            this.pegs[0].push(i);
        }
        
        this.updateDisplay();
        this.updateStatusMessage(this.translations.clickPegFrom);
        this.updateButtons();
        
        document.getElementById('timeCount').textContent = '00:00';
    }

    handlePegClick(pegIndex) {
        if (this.gameFinished) return;

        if (!this.gameStarted) {
            this.startNewGame();
        }

        if (this.selectedPeg === null) {
            if (this.pegs[pegIndex].length === 0) {
                this.updateStatusMessage(this.translations.noDiskToMove, 'error');
                return;
            }
            this.selectedPeg = pegIndex;
            this.highlightPeg(pegIndex);
            this.updateStatusMessage(this.translations.clickPegTo);
        } else {
            if (pegIndex === this.selectedPeg) {
                this.deselectPeg();
                this.updateStatusMessage(this.translations.clickPegFrom);
                return;
            }

            if (this.canMove(this.selectedPeg, pegIndex)) {
                this.makeMove(this.selectedPeg, pegIndex);
                this.deselectPeg();
                this.updateStatusMessage(this.translations.clickPegFrom);
            } else {
                this.updateStatusMessage(this.translations.invalidMove, 'error');
                setTimeout(() => {
                    this.updateStatusMessage(this.translations.clickPegTo);
                }, 2000);
            }
        }
    }

    canMove(fromPeg, toPeg) {
        if (this.pegs[fromPeg].length === 0) return false;
        if (this.pegs[toPeg].length === 0) return true;
        
        const topDiskFrom = this.pegs[fromPeg][this.pegs[fromPeg].length - 1];
        const topDiskTo = this.pegs[toPeg][this.pegs[toPeg].length - 1];
        
        return topDiskFrom < topDiskTo;
    }

    makeMove(fromPeg, toPeg) {
        const disk = this.pegs[fromPeg].pop();
        this.pegs[toPeg].push(disk);
        
        this.moveHistory.push({ from: fromPeg, to: toPeg });
        
        this.moves++;
        this.updateDisplay();
        this.updateButtons();
        
        if (this.checkWin()) {
            this.gameWon();
        }
    }

    undoMove() {
        if (this.moveHistory.length === 0 || this.gameFinished) return;
        
        const lastMove = this.moveHistory.pop();
        const disk = this.pegs[lastMove.to].pop();
        this.pegs[lastMove.from].push(disk);
        
        this.moves = Math.max(0, this.moves - 1);
        this.deselectPeg();
        this.updateDisplay();
        this.updateButtons();
        this.updateStatusMessage(this.translations.clickPegFrom);
    }

    showHint() {
        if (this.gameFinished || this.pegs[0].length === 0) return;
        
        const nextMove = this.getOptimalMove();
        
        if (nextMove) {
            const fromPeg = nextMove.from + 1;
            const toPeg = nextMove.to + 1;
            this.updateStatusMessage(`${this.translations.hint}: ${this.translations.peg} ${fromPeg} → ${this.translations.peg} ${toPeg}`, 'info');
            
            this.highlightHintPegs(nextMove.from, nextMove.to);
            
            setTimeout(() => {
                this.clearHintHighlights();
                this.updateStatusMessage(this.translations.clickPegFrom);
            }, 3000);
        }
    }

    getOptimalMove() {
        const source = 0;
        const destination = 2;
        const auxiliary = 1;
        
        return this.findOptimalMove(source, destination, auxiliary);
    }
    
    findOptimalMove(source, destination, auxiliary) {
        const targetState = this.getTargetState();
        
        if (this.isGameWon()) {
            return null;
        }
        
        for (let diskSize = this.numDisks; diskSize >= 1; diskSize--) {
            const currentPeg = this.findDiskPeg(diskSize);
            const targetPeg = targetState[diskSize - 1];
            
            if (currentPeg !== targetPeg) {
                if (this.canMoveDisk(diskSize, currentPeg, targetPeg)) {
                    return { from: currentPeg, to: targetPeg };
                } else {
                    const blockingDisk = this.findBlockingDisk(diskSize, currentPeg, targetPeg);
                    if (blockingDisk) {
                        return this.getMoveForDisk(blockingDisk);
                    }
                }
            }
        }
        
        return this.getBasicOptimalMove();
    }
    
    getTargetState() {
        const targetState = {};
        for (let i = 1; i <= this.numDisks; i++) {
            targetState[i - 1] = 2;
        }
        return targetState;
    }
    
    findDiskPeg(diskSize) {
        for (let pegIndex = 0; pegIndex < 3; pegIndex++) {
            if (this.pegs[pegIndex].includes(diskSize)) {
                return pegIndex;
            }
        }
        return -1;
    }
    
    canMoveDisk(diskSize, fromPeg, toPeg) {
        if (this.pegs[fromPeg].length === 0 || 
            this.pegs[fromPeg][this.pegs[fromPeg].length - 1] !== diskSize) {
            return false;
        }
        
        if (this.pegs[toPeg].length === 0) {
            return true;
        }
        
        const topDiskOnTarget = this.pegs[toPeg][this.pegs[toPeg].length - 1];
        return diskSize < topDiskOnTarget;
    }
    
    findBlockingDisk(diskSize, fromPeg, toPeg) {
        if (this.pegs[fromPeg].length > 0) {
            const topDisk = this.pegs[fromPeg][this.pegs[fromPeg].length - 1];
            if (topDisk !== diskSize && topDisk < diskSize) {
                return topDisk;
            }
        }
        
        if (this.pegs[toPeg].length > 0) {
            const topDisk = this.pegs[toPeg][this.pegs[toPeg].length - 1];
            if (topDisk < diskSize) {
                return topDisk;
            }
        }
        
        return null;
    }
    
    getMoveForDisk(diskSize) {
        const currentPeg = this.findDiskPeg(diskSize);
        
        for (let targetPeg = 0; targetPeg < 3; targetPeg++) {
            if (targetPeg !== currentPeg && this.canMoveDisk(diskSize, currentPeg, targetPeg)) {
                return { from: currentPeg, to: targetPeg };
            }
        }
        
        return null;
    }
    
    getBasicOptimalMove() {
        let smallestDisk = null;
        let smallestPeg = -1;
        
        for (let pegIndex = 0; pegIndex < 3; pegIndex++) {
            if (this.pegs[pegIndex].length > 0) {
                const topDisk = this.pegs[pegIndex][this.pegs[pegIndex].length - 1];
                if (smallestDisk === null || topDisk < smallestDisk) {
                    smallestDisk = topDisk;
                    smallestPeg = pegIndex;
                }
            }
        }
        
        if (smallestDisk === null) return null;
        
        if (smallestDisk === 1) {
            const isOdd = this.numDisks % 2 === 1;
            if (isOdd) {
                const sequence = [2, 1, 0];
                const nextPeg = sequence[smallestPeg];
                return { from: smallestPeg, to: nextPeg };
            } else {
                const sequence = [1, 2, 0];
                const nextPeg = sequence[smallestPeg];
                return { from: smallestPeg, to: nextPeg };
            }
        } else {
            for (let targetPeg = 0; targetPeg < 3; targetPeg++) {
                if (targetPeg !== smallestPeg) {
                    if (this.canMove(smallestPeg, targetPeg)) {
                        return { from: smallestPeg, to: targetPeg };
                    }
                }
            }
        }
        
        return null;
    }
    
    isGameWon() {
        return this.pegs[2].length === this.numDisks;
    }

    highlightHintPegs(fromPeg, toPeg) {
        document.querySelectorAll('.peg').forEach(peg => peg.classList.remove('hint-from', 'hint-to'));
        document.querySelectorAll('.peg')[fromPeg].classList.add('hint-from');
        document.querySelectorAll('.peg')[toPeg].classList.add('hint-to');
    }

    clearHintHighlights() {
        document.querySelectorAll('.peg').forEach(peg => peg.classList.remove('hint-from', 'hint-to'));
    }

    highlightPeg(pegIndex) {
        document.querySelectorAll('.peg').forEach(peg => peg.classList.remove('selected'));
        document.querySelectorAll('.peg')[pegIndex].classList.add('selected');
    }

    deselectPeg() {
        this.selectedPeg = null;
        document.querySelectorAll('.peg').forEach(peg => peg.classList.remove('selected'));
    }

    checkWin() {
        return this.pegs[2].length === this.numDisks;
    }

    gameWon() {
        this.stopTimer();
        this.gameFinished = true;
        this.deselectPeg();
        
        const timeString = this.formatTime(this.elapsedTime);
        const winMessage = this.translations.winMessage
            .replace('{moves}', this.moves)
            .replace('{time}', timeString);
        
        setTimeout(() => {
            this.showWinModal(winMessage);
        }, 1000);
    }

    showWinModal(message) {
        document.getElementById('winText').textContent = message;
        document.getElementById('winModal').classList.add('show');
    }

    hideWinModal() {
        document.getElementById('winModal').classList.remove('show');
    }

    updateDisplay() {
        document.querySelectorAll('.peg').forEach(peg => {
            const disks = peg.querySelectorAll('.disk');
            disks.forEach(disk => disk.remove());
        });

        this.pegs.forEach((peg, pegIndex) => {
            const pegElement = document.querySelectorAll('.peg')[pegIndex];
            peg.forEach((disk, diskIndex) => {
                const diskElement = document.createElement('div');
                diskElement.className = `disk disk-${disk}`;
                diskElement.style.bottom = `${diskIndex * 25}px`;
                diskElement.textContent = disk;
                diskElement.draggable = true;
                diskElement.dataset.disk = disk;
                diskElement.dataset.peg = pegIndex;
                
                diskElement.addEventListener('dragstart', (e) => this.handleDragStart(e, disk, pegIndex));
                diskElement.addEventListener('dragend', (e) => this.handleDragEnd(e));
                
                if (diskIndex === peg.length - 1) {
                    diskElement.style.cursor = 'grab';
                } else {
                    diskElement.draggable = false;
                    diskElement.style.cursor = 'not-allowed';
                }
                
                pegElement.appendChild(diskElement);
            });
        });

        document.getElementById('moveCount').textContent = this.moves;
        document.getElementById('diskCount').textContent = this.numDisks;
    }

    // Drag and Drop functionality
    handleDragStart(e, disk, pegIndex) {
        if (this.gameFinished) {
            e.preventDefault();
            return;
        }

        if (!this.gameStarted) {
            this.startNewGame();
        }

        const topDisk = this.pegs[pegIndex][this.pegs[pegIndex].length - 1];
        if (disk !== topDisk) {
            e.preventDefault();
            return;
        }

        this.draggedDisk = disk;
        this.draggedFromPeg = pegIndex;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
        
        e.target.style.opacity = '0.5';
        e.target.classList.add('dragging');
        this.updateStatusMessage(this.translations.clickPegTo);
    }

    handleDragEnd(e) {
        e.target.style.opacity = '1';
        e.target.classList.remove('dragging');
        
        document.querySelectorAll('.peg').forEach(peg => {
            peg.classList.remove('drag-over');
        });
        
        this.draggedDisk = null;
        this.draggedFromPeg = null;
    }

    handleDragOver(e) {
        if (this.draggedDisk !== null) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            e.currentTarget.classList.add('drag-over');
        }
    }

    handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }

    handleDrop(e, toPegIndex) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        
        if (this.draggedDisk === null || this.draggedFromPeg === null) {
            return;
        }

        if (this.draggedFromPeg === toPegIndex) {
            this.updateStatusMessage(this.translations.clickPegFrom);
            return;
        }

        if (this.canMove(this.draggedFromPeg, toPegIndex)) {
            this.makeMove(this.draggedFromPeg, toPegIndex);
            this.updateStatusMessage(this.translations.clickPegFrom);
        } else {
            this.updateStatusMessage(this.translations.invalidMove, 'error');
            setTimeout(() => {
                this.updateStatusMessage(this.translations.clickPegFrom);
            }, 2000);
        }
    }

    updateStatusMessage(message, type = '') {
        const statusElement = document.getElementById('statusMessage');
        statusElement.textContent = message;
        statusElement.className = `status-message ${type}`;
    }

    updateButtons() {
        document.getElementById('undoBtn').disabled = this.moveHistory.length === 0 || this.gameFinished;
        document.getElementById('hintBtn').disabled = this.gameFinished;
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            document.getElementById('timeCount').textContent = this.formatTime(this.elapsedTime);
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TowerOfHanoi();
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        document.getElementById('winModal').classList.remove('show');
    }
});