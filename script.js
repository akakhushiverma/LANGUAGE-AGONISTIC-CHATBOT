document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggler = document.getElementById('chatbot-toggler');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotChatbox = document.getElementById('chatbot-chatbox');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const languageSelectionButtons = document.querySelector('.language-selection-buttons');
    const activeLanguageSelector = document.getElementById('active-language');

    let currentLanguage = 'en'; // Default language

    // Placeholder for avatar and flag images
    // In a real app, these would be in your /assets folder or served
    // For now, make sure you have dummy 'college_logo.png', 'owl_avatar.png', 'flag_usa.png', 'flag_india.png'
    // in the same directory as index.html for the code to run without broken images.

    // Toggle Chatbot Visibility
    chatbotToggler.addEventListener('click', () => {
        chatbotContainer.classList.toggle('show-chatbot');
    });

    // Function to scroll chat to bottom
    const scrollToBottom = () => {
        chatbotChatbox.scrollTop = chatbotChatbox.scrollHeight;
    };

    // Add message to chatbox
    const addMessage = (text, sender, lang = currentLanguage) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', `${sender}-message`);

        const p = document.createElement('p');

        if (sender === 'bot') {
            p.innerHTML = text;   // ✅ allows clickable links for bot messages
        } else {
            p.textContent = text; // ✅ safe for user messages
        }

        messageDiv.appendChild(p);

        chatbotChatbox.appendChild(messageDiv);
        scrollToBottom();
    };

    // const addMessage = (text, sender, lang = currentLanguage) => {
    //     const messageDiv = document.createElement('div');
    //     messageDiv.classList.add('chat-message', `${sender}-message`);

    //     const p = document.createElement('p');
    //     p.textContent = text;
    //     messageDiv.appendChild(p);

    //     // Add a small flag icon for user messages if language is not English
    //     // if (sender === 'user' && lang !== 'en') {
    //     //     const flag = document.createElement('img');
    //     //     flag.classList.add('small-lang-flag');
    //     //     // You'd need more flag images and logic to map lang codes to flags
    //     //     // For now, a generic one for non-English user messages
    //     //     if (lang === 'hi') flag.src = 'flag_india.png'; // Assuming flag_india.png for Hindi
    //     //     else if (lang === 'ta') flag.src = 'flag_india.png'; // Using generic for other Indian languages
    //     //     else if (lang === 'te') flag.src = 'flag_india.png';
    //     //     else if (lang === 'kn') flag.src = 'flag_india.png';
    //     //     messageDiv.appendChild(flag);
    //     // } else if (sender === 'bot') {
    //     //      // For bot, if a response is tailored for a specific regional language
    //     //      // we could add a subtle indicator
    //     // }

    //     chatbotChatbox.appendChild(messageDiv);
    //     scrollToBottom();
    // };

    // Simulate bot response (replace with actual API call)
    const getBotResponse = async (userMessage, lang) => {
        // In a real application, you'd send userMessage and lang to your backend
        // const response = await fetch('/api/chatbot', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ message: userMessage, language: lang })
        // });
        // const data = await response.json();
        // addMessage(data.botResponse, 'bot');

        // --- Mock Bot Response ---
        setTimeout(() => {
            let botResponse = "I'm sorry, I don't understand that yet.";
            if (userMessage.toLowerCase().includes("fees")) {
                if (lang === 'hi') botResponse = "फीस की अंतिम तिथि 15 अक्टूबर है।";
                else if (lang === 'ta') botResponse = "கட்டணத்திற்கான கடைசி தேதி அக்டோபர் 15 ஆகும்.";
                else if (lang === 'te') botResponse = "ఫీజు చెల్లింపు చివరి తేదీ అక్టోబర్ 15.";
                else if (lang === 'kn') botResponse = "ಶುಲ್ಕ ಪಾವತಿಗೆ ಅಕ್ಟೋಬರ್ 15 ಕೊನೆಯ ದಿನಾಂಕ.";
                else botResponse = "The last date for fee payment is October 15.";
            } else if (userMessage.toLowerCase().includes("scholarship")) {
                if (lang === 'hi') botResponse = "छात्रवृत्ति के लिए आवेदन पत्र कॉलेज की वेबसाइट पर उपलब्ध हैं।";
                else if (lang === 'ta') botResponse = "கல்வி உதவித்தொகை விண்ணப்பப் படிவங்கள் கல்லூரி இணையதளத்தில் கிடைக்கின்றன.";
                else if (lang === 'te') botResponse = "స్కాలర్‌షిప్ దరఖాస్తు ఫారాలు కాలేజీ వెబ్‌సైట్‌లో అందుబాటులో ఉన్నాయి.";
                else if (lang === 'kn') botResponse = "ಶಿಷ್ಯವೇತನದ ಅರ್ಜಿ ನಮೂನೆಗಳು ಕಾಲೇಜಿನ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಲಭ್ಯವಿವೆ.";
                else botResponse = "Scholarship application forms are available on the college website.";
                addMessage(botResponse, 'bot');
                addMessage('<a href="UPScholarship2025-2026.pdf" target="_blank">Scholarship Office Guidelines PDF</a>', 'bot'); // Example of link
                return;
            } else if (userMessage.toLowerCase().includes("timings") || userMessage.toLowerCase().includes("hours")) {
                if (lang === 'hi') botResponse = "कॉलेज का समय सुबह 9 बजे से शाम 5 बजे तक है।";
                else if (lang === 'ta') botResponse = "கல்லூரி நேரம் காலை 9 மணி முதல் மாலை 5 மணி வரை.";
                else if (lang === 'te') botResponse = "కళాశాల సమయాలు ఉదయం 9 గంటల నుండి సాయంత్రం 5 గంటల వరకు.";
                else if (lang === 'kn') botResponse = "ಕಾಲೇಜಿನ ಸಮಯ ಬೆಳಿಗ್ಗೆ 9 ರಿಂದ ಸಂಜೆ 5 ರವರೆಗೆ.";
                else botResponse = "College timings are from 9 AM to 5 PM.";
            }

            addMessage(botResponse, 'bot');
        }, 800);
    };

    // Handle sending messages
    const handleChat = () => {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        addMessage(userMessage, 'user', currentLanguage);
        chatInput.value = ''; // Clear input

        getBotResponse(userMessage, currentLanguage);
    };

    sendBtn.addEventListener('click', handleChat);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default form submission if input is in a form
            handleChat();
        }
    });

    // Language selection buttons
    languageSelectionButtons.addEventListener('click', (e) => {
        if (e.target.classList.contains('lang-btn') && !e.target.classList.contains('show-more-langs')) {
            // Remove active from previous
            document.querySelector('.lang-btn.active')?.classList.remove('active');
            // Add active to new
            e.target.classList.add('active');
            currentLanguage = e.target.dataset.lang;
            activeLanguageSelector.value = currentLanguage; // Sync dropdown
            addMessage(`Language switched to ${e.target.textContent}. How can I help?`, 'bot');
            // You might want to clear previous chat or re-send welcome in new language
        } else if (e.target.classList.contains('show-more-langs')) {
            // Implement modal or expand more language options here
            alert("More languages option clicked! Implement full list here.");
        }
    });

    // Language selector dropdown
    activeLanguageSelector.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        // Update active class on buttons if visible
        document.querySelector('.lang-btn.active')?.classList.remove('active');
        const correspondingBtn = document.querySelector(`.lang-btn[data-lang="${currentLanguage}"]`);
        if (correspondingBtn) {
            correspondingBtn.classList.add('active');
        }
        addMessage(`Language switched to ${activeLanguageSelector.options[activeLanguageSelector.selectedIndex].text}. How can I help?`, 'bot');
    });

    // Voice input (placeholder)
    const micBtn = document.getElementById('mic-btn');
    micBtn.addEventListener('click', () => {
        alert("Voice input activated! (Requires Web Speech API integration)");
        // Implement Web Speech API here for speech-to-text
    });

    // Initial scroll to bottom
    scrollToBottom();
});