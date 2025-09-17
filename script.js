class TechkkimEnhanced {
            constructor() {
                this.genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY");
                this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
                
                this.initializeChatbot();
                this.initializeVoiceSearch();
                this.initializeARMode();
                this.initializeLiveFeatures();
                this.initializeAccessibility();
                this.initializePWA();
                this.initializeNotifications();
            }

            // AI Chatbot Implementation
            initializeChatbot() {
                // Create chatbot widget
                const chatWidget = document.createElement('div');
                chatWidget.className = 'chatbot-widget';
                chatWidget.innerHTML = '🤖';
                chatWidget.setAttribute('aria-label', 'Open AI Assistant');
                chatWidget.title = 'Chat with AI Monastery Guide';
                document.body.appendChild(chatWidget);

                // Create chat interface
                const chatInterface = document.createElement('div');
                chatInterface.className = 'chat-interface';
                chatInterface.innerHTML = `
                    <div class="chat-header">
                        <span>🤖 Techkkim AI Guide</span>
                        <button class="chat-close" style="float: right; background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer;">×</button>
                    </div>
                    <div class="chat-messages" id="chat-messages">
                        <div class="bot-message" style="background: #f0f0f0; padding: 10px; margin: 5px 0; border-radius: 10px;">
                            🙏 Namaste! I'm your AI monastery guide. Ask me about any monastery, festival, or Buddhist practices in Sikkim! I can help with:<br>
                            • Monastery information & history<br>
                            • Virtual tour recommendations<br>
                            • Festival dates & ceremonies<br>
                            • Travel planning & routes<br>
                            • Buddhist practices & meditation 🏔️
                        </div>
                    </div>
                    <div class="chat-input-area">
                        <input type="text" class="chat-input" placeholder="Ask about monasteries..." id="chat-input">
                        <button class="chat-send" id="chat-send">➤</button>
                    </div>
                `;
                document.body.appendChild(chatInterface);

                // Event listeners
                chatWidget.addEventListener('click', () => {
                    chatInterface.style.display = chatInterface.style.display === 'flex' ? 'none' : 'flex';
                });

                document.querySelector('.chat-close').addEventListener('click', () => {
                    chatInterface.style.display = 'none';
                });

                document.getElementById('chat-send').addEventListener('click', () => {
                    this.sendChatMessage();
                });

                document.getElementById('chat-input').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.sendChatMessage();
                });
            }

            // Replace the existing sendChatMessage method with this updated version
            async sendChatMessage() {
                const input = document.getElementById('chat-input');
                const messages = document.getElementById('chat-messages');
                const message = input.value.trim();
                
                if (!message) return;

                // Add user message
                const userMsg = document.createElement('div');
                userMsg.style.cssText = 'background: #800000; color: white; padding: 10px; margin: 5px 0; border-radius: 10px; text-align: right;';
                userMsg.textContent = message;
                messages.appendChild(userMsg);

                // Show typing indicator
                const typingIndicator = document.createElement('div');
                typingIndicator.style.cssText = 'background: #f0f0f0; padding: 10px; margin: 5px 0; border-radius: 10px; font-style: italic; color: #666;';
                typingIndicator.textContent = '🤖 AI Guide is typing...';
                messages.appendChild(typingIndicator);

                try {
                    // Generate response using Gemini
                    const prompt = `You are a knowledgeable AI guide for Sikkim monasteries. 
                                  Provide detailed, accurate information about ${message}. 
                                  Focus on monasteries, Buddhist practices, cultural events, and visitor information. 
                                  Keep responses concise and informative.`;

                    const result = await this.model.generateContent(prompt);
                    const response = await result.response;
                    const botResponse = response.text();

                    // Remove typing indicator and add bot response
                    messages.removeChild(typingIndicator);
                    const botMsg = document.createElement('div');
                    botMsg.style.cssText = 'background: #f0f0f0; padding: 10px; margin: 5px 0; border-radius: 10px;';
                    botMsg.innerHTML = this.formatBotResponse(botResponse);
                    messages.appendChild(botMsg);

                } catch (error) {
                    // Handle errors gracefully
                    console.error('Gemini API Error:', error);
                    messages.removeChild(typingIndicator);
                    const errorMsg = document.createElement('div');
                    errorMsg.style.cssText = 'background: #ffebee; color: #c62828; padding: 10px; margin: 5px 0; border-radius: 10px;';
                    errorMsg.innerHTML = '❌ Sorry, I encountered an error. Please try asking something else.';
                    messages.appendChild(errorMsg);
                }

                input.value = '';
                messages.scrollTop = messages.scrollHeight;
            }

            // Add this helper method to format bot responses
            formatBotResponse(text) {
                // Add emoji and formatting to make response more engaging
                text = text.replace(/monastery/gi, '🏛️ monastery');
                text = text.replace(/buddha/gi, '🙏 Buddha');
                text = text.replace(/meditation/gi, '🧘‍♀️ meditation');
                text = text.replace(/festival/gi, '🎊 festival');
                
                // Add line breaks for better readability
                text = text.replace(/\. /g, '.<br>');
                
                return text;
            }

            // ...rest of your existing code...

            // Voice Search Implementation
            initializeVoiceSearch() {
                if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                    console.log('Speech recognition not supported');
                    return;
                }

                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'en-US';

                // Add voice buttons to search containers
                const searchContainers = document.querySelectorAll('.search-container');
                searchContainers.forEach(container => {
                    const voiceButton = container.querySelector('.voice-button') || document.createElement('button');
                    if (!container.querySelector('.voice-button')) {
                        voiceButton.className = 'voice-button';
                        voiceButton.innerHTML = '🎤';
                        voiceButton.setAttribute('aria-label', 'Voice Search');
                        voiceButton.title = 'Click to search with voice';
                        container.insertBefore(voiceButton, container.lastElementChild);
                    }

                    voiceButton.addEventListener('click', () => {
                        voiceButton.classList.add('active');
                        voiceButton.innerHTML = '🎙️';
                        recognition.start();
                        this.showNotification('🎤 Listening... Speak your query now!', 'info');
                    });
                });

                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    const searchInput = document.querySelector('.search-input');
                    if (searchInput) {
                        searchInput.value = transcript;
                        this.performSearch(transcript);
                    }
                    
                    // Reset voice button
                    document.querySelectorAll('.voice-button').forEach(btn => {
                        btn.classList.remove('active');
                        btn.innerHTML = '🎤';
                    });
                };

                recognition.onerror = (event) => {
                    this.showNotification(`Voice search error: ${event.error}. Please try again.`, 'error');
                    document.querySelectorAll('.voice-button').forEach(btn => {
                        btn.classList.remove('active');
                        btn.innerHTML = '🎤';
                    });
                };
            }

            performSearch(query) {
                const searchResults = {
                    'rumtek monastery': '🎯 Found: Rumtek Monastery - Virtual tour, live ceremonies, and AI-guided exploration available',
                    'meditation': '🎯 Found: Virtual meditation sessions, breathing exercises, and guided practices with monks',
                    'festival': '🎯 Found: Cultural calendar with Losar, Saga Dawa, and Pang Lhabsol - live streaming available',
                    'prayer wheel': '🎯 Found: Interactive prayer wheel simulation, traditional practices, and spiritual significance',
                    'history': '🎯 Found: Digital archives with manuscripts, murals, and 300+ years of monastery documentation',
                    'ar mode': '🎯 Found: Augmented Reality features - camera identification, 3D models, and interactive overlays',
                    'live stream': '🎯 Found: Live monastery ceremonies, morning prayers, and real-time cultural events'
                };

                const lowerQuery = query.toLowerCase();
                let result = null;
                
                for (const [key, response] of Object.entries(searchResults)) {
                    if (lowerQuery.includes(key) || key.includes(lowerQuery)) {
                        result = response;
                        break;
                    }
                }
                
                if (!result) {
                    result = `🔍 Searching for "${query}" across monasteries, archives, live streams, and cultural content... Found 12 related results!`;
                }
                
                this.showNotification(result, 'search');
                
                // Simulate search results display
                setTimeout(() => {
                    this.showNotification('💡 Try asking our AI chatbot for more detailed information!', 'info');
                }, 3000);
            }

            // AR Mode Implementation
            initializeARMode() {
                const arButton = document.createElement('button');
                arButton.className = 'ar-mode-btn';
                arButton.innerHTML = '📱 AR Mode';
                arButton.setAttribute('aria-label', 'Activate Augmented Reality Mode');
                arButton.title = 'Experience monasteries in Augmented Reality';
                document.body.appendChild(arButton);

                arButton.addEventListener('click', () => {
                    this.activateARMode();
                });
            }

            activateARMode() {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    this.showNotification('🚫 AR mode requires camera access. Please use a compatible device.', 'error');
                    return;
                }

                // Create AR interface
                const arInterface = document.createElement('div');
                arInterface.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0,0,0,0.95);
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: white;
                `;
                arInterface.innerHTML = `
                    <h2 style="color: #FFC107; margin-bottom: 1rem; text-align: center;">📱 AR Monastery Explorer</h2>
                    <p style="text-align: center; margin-bottom: 2rem; max-width: 400px;">Point your camera at monastery images or QR codes for enhanced 3D information, historical details, and interactive overlays</p>
                    <video id="ar-camera" autoplay playsinline style="width: 80%; max-width: 400px; border-radius: 10px; border: 2px solid #FFC107;"></video>
                    <div style="margin-top: 20px; text-align: center;">
                        <button id="ar-close" style="background: #800000; color: white; padding: 10px 20px; border: none; border-radius: 5px; margin: 0 10px; cursor: pointer;">❌ Close AR</button>
                        <button id="ar-capture" style="background: #FFC107; color: #800000; padding: 10px 20px; border: none; border-radius: 5px; margin: 0 10px; cursor: pointer;">🔍 Identify Monastery</button>
                        <button id="ar-3d" style="background: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; margin: 0 10px; cursor: pointer;">🏛️ View 3D Model</button>
                    </div>
                    <div style="margin-top: 10px; text-align: center; font-size: 0.8rem; opacity: 0.8;">
                        💡 Tip: Hold steady for 2 seconds to auto-identify monasteries
                    </div>
                `;
                document.body.appendChild(arInterface);

                // Start camera
                navigator.mediaDevices.getUserMedia({ 
                    video: { 
                        facingMode: 'environment',
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    } 
                })
                .then(stream => {
                    document.getElementById('ar-camera').srcObject = stream;
                    this.showNotification('📹 AR Camera activated! Point at monastery images to identify them.', 'success');
                })
                .catch(err => {
                    this.showNotification('❌ Could not access camera. Please check permissions and try again.', 'error');
                    document.body.removeChild(arInterface);
                });

                // AR interface event listeners
                document.getElementById('ar-close').addEventListener('click', () => {
                    const video = document.getElementById('ar-camera');
                    if (video.srcObject) {
                        video.srcObject.getTracks().forEach(track => track.stop());
                    }
                    document.body.removeChild(arInterface);
                });

                document.getElementById('ar-capture').addEventListener('click', () => {
                    this.identifyMonastery();
                });

                document.getElementById('ar-3d').addEventListener('click', () => {
                    this.show3DModel();
                });
            }

            identifyMonastery() {
                // Show analyzing animation
                this.showNotification('🔄 AI analyzing monastery in camera view...', 'info');
                
                setTimeout(() => {
                    const monasteries = [
                        {
                            name: 'Rumtek Monastery',
                            details: 'The Dharma Chakra Centre - Built in 1966, seat of the Karmapa',
                            features: '🏛️ Traditional architecture | 🎨 Golden statues | 📿 Sacred relics'
                        },
                        {
                            name: 'Pemayangtse Monastery', 
                            details: 'Perfect Sublime Lotus - Founded in 1705, Nyingma school',
                            features: '⛩️ Ancient murals | 🏔️ Kanchenjunga views | 📚 Rare manuscripts'
                        },
                        {
                            name: 'Tashiding Monastery',
                            details: 'The Devoted Central Glory - Established in 1642',
                            features: '🌸 Sacred gardens | 🔔 Prayer wheels | ⛰️ Hilltop location'
                        },
                        {
                            name: 'Enchey Monastery',
                            details: 'The Solitary Temple - Built in 1909',
                            features: '🌳 Peaceful gardens | 🎭 Cham dances | 🏛️ Modern architecture'
                        }
                    ];
                    
                    const identified = monasteries[Math.floor(Math.random() * monasteries.length)];
                    
                    const resultHtml = `
                        <strong>✅ ${identified.name} Identified!</strong><br>
                        ${identified.details}<br><br>
                        <em>Key Features:</em><br>
                        ${identified.features}<br><br>
                        🎥 Tap chatbot for virtual tour | 📚 View in archives
                    `;
                    
                    this.showNotification(resultHtml, 'success', 8000);
                }, 2000);
            }

            show3DModel() {
                this.showNotification('🏛️ Loading 3D monastery model... This feature showcases holographic monastery architecture in your space!', 'info');
                
                setTimeout(() => {
                    this.showNotification('✨ 3D Model ready! In full version: Rotate, zoom, and walk around virtual monasteries in your real environment.', 'success');
                }, 3000);
            }

            // Live Features Implementation
            initializeLiveFeatures() {
                // The live section is already in the HTML
                // Add dynamic live status updates
                this.updateLiveStatus();
                setInterval(() => this.updateLiveStatus(), 30000); // Update every 30 seconds
            }

            updateLiveStatus() {
                const liveCards = document.querySelectorAll('.live-stream-card');
                const currentHour = new Date().getHours();
                
                // Simulate different live content based on time
                liveCards.forEach((card, index) => {
                    const isLive = (currentHour >= 6 && currentHour <= 8) && index === 0; // Morning prayers
                    const liveIndicator = card.querySelector('.live-indicator');
                    
                    if (isLive && !liveIndicator) {
                        const indicator = document.createElement('span');
                        indicator.className = 'live-indicator';
                        indicator.innerHTML = '🔴 LIVE';
                        card.insertBefore(indicator, card.firstChild);
                        card.classList.add('live');
                    }
                });
            }

            // Accessibility Features
            initializeAccessibility() {
                const accessibilityControls = document.createElement('div');
                accessibilityControls.className = 'accessibility-controls';
                accessibilityControls.innerHTML = `
                    <button class="accessibility-btn text-size-up" onclick="window.techkkim.adjustTextSize(1.2)" title="Increase text size">A+</button>
                    <button class="accessibility-btn text-size-down" onclick="window.techkkim.adjustTextSize(0.8)" title="Decrease text size">A-</button>
                    <button class="accessibility-btn high-contrast" onclick="window.techkkim.toggleHighContrast()" title="Toggle high contrast">◐</button>
                `;
                document.body.appendChild(accessibilityControls);
            }

            adjustTextSize(factor) {
                const currentSize = parseFloat(getComputedStyle(document.body).fontSize);
                const newSize = currentSize * factor;
                document.body.style.fontSize = Math.min(Math.max(newSize, 12), 24) + 'px';
                this.showNotification(`📝 Text size ${factor > 1 ? 'increased' : 'decreased'}`, 'info');
            }

            toggleHighContrast() {
                document.body.classList.toggle('high-contrast-mode');
                
                if (!document.getElementById('high-contrast-css')) {
                    const style = document.createElement('style');
                    style.id = 'high-contrast-css';
                    style.textContent = `
                        .high-contrast-mode {
                            filter: contrast(150%) brightness(150%);
                        }
                        .high-contrast-mode .btn-gradient {
                            background: #000 !important;
                            color: #fff !important;
                            border: 2px solid #fff !important;
                        }
                        .high-contrast-mode .feature-box {
                            border: 2px solid #000 !important;
                            background: #fff !important;
                        }
                    `;
                    document.head.appendChild(style);
                }
                
                this.showNotification('🎨 High contrast mode toggled', 'info');
            }

            // PWA Implementation
            initializePWA() {
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.register('/sw.js')
                        .then(registration => {
                            console.log('SW registered: ', registration);
                            this.showNotification('📱 App ready for offline use!', 'success');
                        })
                        .catch(registrationError => {
                            console.log('SW registration failed: ', registrationError);
                        });
                }

                // Add install prompt
                let deferredPrompt;
                window.addEventListener('beforeinstallprompt', (e) => {
                    e.preventDefault();
                    deferredPrompt = e;
                    
                    const installButton = document.createElement('button');
                    installButton.textContent = '📱 Install App';
                    installButton.className = 'install-app-btn';
                    installButton.title = 'Install Techkkim as an app';
                    
                    installButton.addEventListener('click', () => {
                        deferredPrompt.prompt();
                        deferredPrompt.userChoice.then((choiceResult) => {
                            if (choiceResult.outcome === 'accepted') {
                                this.showNotification('🎉 Thank you! Techkkim app installed successfully.', 'success');
                            }
                            deferredPrompt = null;
                            document.body.removeChild(installButton);
                        });
                    });
                    
                    document.body.appendChild(installButton);
                });
            }

            // Notification system
            initializeNotifications() {
                // Welcome notification
                setTimeout(() => {
                    this.showNotification('🙏 Welcome to Enhanced Techkkim! Try our AI chatbot, AR mode, and live monastery experiences!', 'info', 6000);
                }, 3000);
            }

            // Enhanced notification system
            showNotification(message, type = 'info', duration = 4000) {
                const notification = document.createElement('div');
                const colors = {
                    'error': '#ff4444',
                    'success': '#44ff44', 
                    'info': '#FFC107',
                    'search': '#2196F3'
                };
                
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: ${colors[type] || '#FFC107'};
                    color: ${type === 'success' ? '#000' : '#fff'};
                    padding: 15px 20px;
                    border-radius: 10px;
                    z-index: 10001;
                    max-width: 350px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    font-size: 14px;
                    line-height: 1.4;
                    animation: slideIn 0.3s ease-out;
                `;
                
                // Add slide-in animation
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes slideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                `;
                document.head.appendChild(style);
                
                notification.innerHTML = message;
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        notification.style.animation = 'slideIn 0.3s ease-out reverse';
                        setTimeout(() => document.body.removeChild(notification), 300);
                    }
                }, duration);
            }

            // Global utility functions
            joinLiveStream(monastery) {
                this.showNotification(`🔴 Connecting to live stream from ${monastery} monastery... 127 viewers watching!`, 'info');
                setTimeout(() => {
                    this.showNotification(`✅ Connected! You're now watching live from ${monastery}. Use chat to interact with other viewers.`, 'success');
                }, 2000);
            }

            startMeditation() {
                const meditationInterface = document.createElement('div');
                meditationInterface.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: linear-gradient(135deg, rgba(128,0,0,0.1), rgba(255,193,7,0.05));
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #800000;
                `;
                
                let timeLeft = 1200; // 20 minutes
                meditationInterface.innerHTML = `
                    <h2 style="font-size: 2.5rem; margin-bottom: 2rem; text-align: center;">🧘‍♀️ Guided Meditation with Monk</h2>
                    <div style="width: 200px; height: 200px; border: 4px solid #800000; border-radius: 50%; margin: 20px auto; background: radial-gradient(circle, rgba(255,193,7,0.2) 0%, transparent 70%); animation: breathe 4s ease-in-out infinite;"></div>
                    <div style="font-size: 3rem; font-weight: bold; margin: 2rem; font-family: Georgia, serif;" id="meditation-timer">${Math.floor(timeLeft/60)}:${(timeLeft%60).toString().padStart(2,'0')}</div>
                    <p style="text-align: center; margin: 1rem; color: #666; max-width: 500px; font-size: 1.1rem;">
                        🌸 Follow the breathing circle and let your mind find peace. Breathe in for 4 counts, hold for 4, breathe out for 4. 
                        <br><br>🎧 <em>"Focus on your breath, let thoughts pass like clouds in the sky..."</em>
                    </p>
                    <div style="margin-top: 2rem;">
                        <button onclick="this.parentElement.remove()" style="background: #800000; color: white; padding: 15px 30px; border: none; border-radius: 10px; cursor: pointer; font-size: 1rem; margin: 0 10px;">🚪 End Session</button>
                        <button onclick="window.techkkim.pauseMeditation(this)" style="background: #FFC107; color: #800000; padding: 15px 30px; border: none; border-radius: 10px; cursor: pointer; font-size: 1rem; margin: 0 10px;">⏸️ Pause</button>
                    </div>
                `;
                
                document.body.appendChild(meditationInterface);
                this.showNotification('🧘‍♀️ Meditation session started. Find a comfortable position and breathe deeply.', 'success');
                
                const timer = setInterval(() => {
                    timeLeft--;
                    const timerElement = document.getElementById('meditation-timer');
                    if (timerElement) {
                        timerElement.textContent = `${Math.floor(timeLeft/60)}:${(timeLeft%60).toString().padStart(2,'0')}`;
                    }
                    
                    if (timeLeft <= 0) {
                        clearInterval(timer);
                        this.showNotification('🌟 Meditation session completed! Take a moment to appreciate this peaceful feeling. 🙏', 'success');
                        if (document.body.contains(meditationInterface)) {
                            document.body.removeChild(meditationInterface);
                        }
                    }
                }, 1000);
            }

            playStory() {
                const stories = [
                    {
                        title: "The Golden Stupa of Pemayangtse",
                        content: "Legend tells of a golden stupa that appeared overnight, blessed by Guru Rinpoche himself..."
                    },
                    {
                        title: "The 16th Karmapa and Rumtek",
                        content: "When the 16th Karmapa fled Tibet, he chose this sacred ground to rebuild his seat of learning..."
                    },
                    {
                        title: "The Sacred Waters of Tashiding", 
                        content: "It is said that drinking from the sacred spring during Bumchu festival washes away sins..."
                    },
                    {
                        title: "The Protective Spirits of Enchey",
                        content: "Elder monks speak of guardian spirits that protect the monastery from natural disasters..."
                    }
                ];
                
                const randomStory = stories[Math.floor(Math.random() * stories.length)];
                this.showNotification(`🎭 Now playing: <strong>${randomStory.title}</strong><br><br><em>${randomStory.content}</em><br><br>🎧 Full audio story playing... Listen as elder monks share ancient wisdom.`, 'info', 8000);
            }
        }

        // Global functions for buttons
        function openChatbot() {
            const chatInterface = document.querySelector('.chat-interface');
            if (chatInterface) {
                chatInterface.style.display = 'flex';
            }
        }

        function activateAR() {
            if (window.techkkim) {
                window.techkkim.activateARMode();
            }
        }

        function startVirtualTour() {
            if (window.techkkim) {
                window.techkkim.showNotification('🎥 Starting AI-enhanced virtual tour with personalized recommendations and voice control!', 'info');
                // Scroll to tours section
                document.getElementById('tours').scrollIntoView({ behavior: 'smooth' });
            }
        }

        function joinLiveStream(monastery = 'Rumtek') {
            if (window.techkkim) {
                window.techkkim.joinLiveStream(monastery);
            }
        }

        function startMeditation() {
            if (window.techkkim) {
                window.techkkim.startMeditation();
            }
        }

        function playStory() {
            if (window.techkkim) {
                window.techkkim.playStory();
            }
        }

        function searchArchives() {
            const query = document.getElementById('archive-search')?.value || 'monastery archives';
            if (window.techkkim) {
                window.techkkim.performSearch(query);
            }
        }

        // Initialize enhanced features when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize the enhanced Techkkim system
            window.techkkim = new TechkkimEnhanced();
            
            // Original menu toggle functionality
            const menuToggle = document.getElementById('menu-toggle');
            const mobileMenu = document.getElementById('mobile-menu');
            if (menuToggle && mobileMenu) {
                menuToggle.addEventListener('click', () => {
                    mobileMenu.classList.toggle('show');
                });
            }

            // Enhanced hover effects for cards
            const cards = document.querySelectorAll('.feature-box, .live-stream-card');
            cards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-8px) scale(1.02)';
                });
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(0) scale(1)';
                });
            });

            // Add smooth scrolling for all navigation links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });

            // Language translations
            const translations = {
                en: {
                    home: "Home",
                    features: "Key Features",
                    views: "360° Views",
                    map: "Interactive Map",
                    reach: "Reach a Monastery",
                    calendar: "Calendar",
                    contact: "Contact"
                },
                ne: {
                    home: "गृह",
                    features: "मुख्य विशेषताहरू",
                    views: "360° दृश्यहरू",
                    map: "अन्तरक्रियात्मक नक्सा",
                    reach: "गुम्बा पुग्नुहोस्",
                    calendar: "पात्रो",
                    contact: "सम्पर्क"
                },
                bhutia: {
                    home: "གཙོ་ཤོག",
                    features: "གཙོ་བོའི་ཁྱད་ཆོས",
                    views: "360° ལྟ་སྣང",
                    map: "སྤེལ་མའི་ས་ཁྲ",
                    reach: "དགོན་པར་འགྲོ",
                    calendar: "ལོ་ཐོ",
                    contact: "འབྲེལ་བ"
                }
            };

            // Language switching function
            function switchLanguage(lang) {
                const elements = {
                    'nav a[href="#home"]': translations[lang].home,
                    'nav a[href="#features"]': translations[lang].features,
                    'nav a[href="#tours"]': translations[lang].views,
                    'nav a[href="#map"]': translations[lang].map,
                    'nav a[href="#gmap"]': translations[lang].reach,
                    'nav a[href="#calendar"]': translations[lang].calendar,
                    'nav a[href="#contact"]': translations[lang].contact
                };

                for (let [selector, text] of Object.entries(elements)) {
                    document.querySelectorAll(selector).forEach(el => el.textContent = text);
                }

                // Store language preference
                localStorage.setItem('preferredLanguage', lang);
                document.documentElement.lang = lang;
            }

            // Language selector event listener
            document.getElementById('langSelect').addEventListener('change', (e) => {
                switchLanguage(e.target.value);
            });

            // Set initial language from localStorage or default to English
            const savedLang = localStorage.getItem('preferredLanguage') || 'en';
            document.getElementById('langSelect').value = savedLang;
            switchLanguage(savedLang);
        });