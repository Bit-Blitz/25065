import React, { useState, useEffect, useRef } from 'react';

// --- SVG Icon Components ---
// Using inline SVGs to keep everything in one file and avoid external dependencies.

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path d="M20 12v-2a6 6 0 10-12 0v2H4v10h16V12h-4zm-7 1.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm3 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM12 2c1.93 0 3.68.79 4.95 2.05l-1.41 1.41C14.63 4.56 13.38 4 12 4s-2.63.56-3.54 1.46L7.05 4.05C8.32 2.79 10.07 2 12 2z"/>
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

const SummarizeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"/>
        <path d="M16 8h-4"/><path d="M16 12h-4"/><path d="M8 8h.01"/><path d="M8 12h.01"/>
    </svg>
);

const SparkleIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L9.5 7.5L4 10l5.5 2.5L12 18l2.5-5.5L20 10l-5.5-2.5L12 2zM5 22l1.5-3.5L10 17l-3.5-1.5L5 12l-1.5 3.5L0 17l3.5 1.5L5 22z"/>
     </svg>
);


// --- Main Chatbot Component ---
const Chatbot = () => {
    // --- State Management ---
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestedQuestions, setSuggestedQuestions] = useState([]);
    const messagesEndRef = useRef(null);

    // --- Rainwater Harvesting Knowledge Base ---
    const rainwaterHarvestingKnowledge = {
        "what is rainwater harvesting": "Rainwater harvesting is the simple process of collecting and storing rainwater, rather than allowing it to run off. This collected water can be used for various purposes like irrigation, watering gardens, livestock, and with proper purification, even as drinking water.",
        "benefits": "The benefits are numerous! It reduces water bills, decreases demand on groundwater, helps prevent soil erosion and urban flooding, and provides a sustainable water source, especially in areas with scarce water resources. It's a great way to be more self-sufficient and environmentally friendly.",
        "methods": "Common methods include Rooftop Rainwater Harvesting, where you collect rain from your roof into tanks, and Surface Runoff Harvesting, which involves collecting rainwater from ground surfaces in ponds or reservoirs. For homes, rooftop systems are the most popular.",
        "rooftop system": "A rooftop system involves gutters and downspouts to channel rainwater from the roof into a storage tank. Often, a 'first flush' diverter is used to discard the first few minutes of rain, which cleans the roof of debris. The stored water can then be used directly or filtered for cleaner applications.",
        "how to start": "To start with a simple system, you can connect a rain barrel to one of your home's downspouts. For a more comprehensive setup, you would install a larger cistern or tank and a system of pipes and filters. It's a scalable project that can range from a simple DIY to a professionally installed system.",
    };

    // --- Effects ---
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                { 
                    text: "Hello! I'm here to help. You can ask me about rainwater harvesting or any other general questions you have.", 
                    sender: 'bot',
                    showSuggestionButton: true
                }
            ]);
        }
    }, [isOpen, messages.length]);


    // --- Core Functions ---
    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;
        
        setSuggestedQuestions([]);
        const userMessage = { text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            await getBotResponse(inputValue);
        } catch (error) {
            console.error("Error getting bot response:", error);
            const errorMessage = { text: "Sorry, I'm having trouble connecting. Please try again later.", sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSendSuggestedQuestion = async (question) => {
        setSuggestedQuestions([]);
        const userMessage = { text: question, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            await getBotResponse(question);
        } catch (error) {
            console.error("Error getting bot response:", error);
            setMessages(prev => [...prev, { text: "Sorry, something went wrong.", sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const getBotResponse = async (userInput) => {
        const lowerCaseInput = userInput.toLowerCase();
        let botReply = '';

        for (const keyword in rainwaterHarvestingKnowledge) {
            if (lowerCaseInput.includes(keyword)) {
                botReply = rainwaterHarvestingKnowledge[keyword];
                break;
            }
        }
        
        if (!botReply) {
             botReply = await fetchFromGemini(userInput);
        }

        const botMessage = { text: botReply, sender: 'bot' };
        setMessages(prev => [...prev, botMessage]);
    };

    const fetchFromGemini = async (query, retries = 3, delay = 1000) => {
        const apiKey = "PASTE_YOUR_API_KEY_HERE"; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const systemPrompt = "You are a friendly and helpful chatbot. You have specialized knowledge about rainwater harvesting techniques, benefits, and implementation. While you can answer general questions on any topic, your primary expertise is in rainwater harvesting. When asked about it, provide detailed and informative answers. For all other questions, be a helpful generalist assistant.";
        const payload = { contents: [{ parts: [{ text: query }] }], systemInstruction: { parts: [{ text: systemPrompt }] } };

        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) {
                 if (response.status === 429 && retries > 0) {
                    await new Promise(res => setTimeout(res, delay));
                    return fetchFromGemini(query, retries - 1, delay * 2);
                 }
                throw new Error(`API request failed with status ${response.status}`);
            }
            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
            return text || "I'm sorry, I couldn't generate a response. Could you try rephrasing?";
        } catch (error) {
             console.error("Gemini API call failed:", error);
             if (retries > 0) {
                 await new Promise(res => setTimeout(res, delay));
                 return fetchFromGemini(query, retries - 1, delay * 2);
             }
             return "I'm currently unable to process your request. Please try again later.";
        }
    };
    
    // --- Gemini-Powered Features ---
    const handleSummarize = async () => {
        setIsLoading(true);
        const conversationHistory = messages.map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`).join('\n');
        const prompt = `Please provide a brief, concise summary of the following conversation:\n\n${conversationHistory}`;

        try {
            const summary = await fetchFromGemini(prompt);
            const summaryMessage = { text: `✨ **Conversation Summary** ✨\n\n${summary}`, sender: 'bot' };
            setMessages(prev => [...prev, summaryMessage]);
        } catch (error) {
            console.error("Error summarizing conversation:", error);
            setMessages(prev => [...prev, { text: "Sorry, I couldn't summarize the conversation.", sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSuggestQuestions = async () => {
        setIsLoading(true);
        setMessages(prev => prev.map(msg => ({ ...msg, showSuggestionButton: false })));

        const apiKey = "PASTE_YOUR_API_KEY_HERE";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const prompt = "Based on the topic of rainwater harvesting, suggest three short and engaging questions a user might ask. Return the response as a valid JSON array of strings. For example: [\"Question 1\", \"Question 2\", \"Question 3\"]";
        const payload = { contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } };
        
        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
            
            const result = await response.json();
            const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
            if (jsonText) {
                const parsedQuestions = JSON.parse(jsonText);
                setSuggestedQuestions(parsedQuestions);
            } else { throw new Error("Could not parse suggested questions."); }
        } catch (error) {
            console.error("Error fetching suggested questions:", error);
            setMessages(prev => [...prev, { text: "Sorry, I couldn't come up with suggestions right now.", sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Render ---
    return (
        <>
            {/* Chat Window */}
            <div className={`w-80 h-[28rem] sm:w-96 sm:h-[32rem] bg-white rounded-lg shadow-2xl flex flex-col transition-all duration-300 ease-in-out fixed bottom-28 right-4 z-40 font-sans origin-bottom-right ${isOpen ? 'transform scale-100 opacity-100' : 'transform scale-95 opacity-0 pointer-events-none'}`}>
                {/* Header */}
                <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Chat Assistant</h3>
                    <div className="flex items-center space-x-2">
                        {messages.length > 3 && (
                            <button onClick={handleSummarize} className="hover:bg-blue-700 p-1 rounded-full" title="✨ Summarize Conversation">
                                <SummarizeIcon />
                            </button>
                        )}
                        <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded-full"><CloseIcon /></button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex my-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                {msg.showSuggestionButton && (
                                    <button onClick={handleSuggestQuestions} className="mt-2 w-full text-left p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-semibold flex items-center justify-center space-x-2">
                                        <SparkleIcon />
                                        <span>✨ Suggest Topics</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start my-2">
                            <div className="bg-gray-200 text-gray-800 rounded-2xl rounded-bl-none p-2">
                                <div className="flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Suggested Questions */}
                {suggestedQuestions.length > 0 && (
                    <div className="p-3 border-t bg-white">
                        <div className="flex flex-wrap gap-2">
                            {suggestedQuestions.map((q, i) => (
                                <button key={i} onClick={() => handleSendSuggestedQuestion(q)} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 text-sm">{q}</button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <div className="p-4 border-t bg-white rounded-b-lg">
                    <div className="flex items-center space-x-2">
                        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Ask me anything..." className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <button onClick={handleSendMessage} className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:bg-blue-300" disabled={isLoading}><SendIcon /></button>
                    </div>
                </div>
            </div>

            {/* Toggle Button */}
            <button onClick={() => setIsOpen(!isOpen)} className={`fixed bottom-4 right-4 z-50 bg-white text-blue-600 w-20 h-20 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-all duration-500 ease-in-out ${isOpen ? 'rotate-[360deg]' : 'rotate-0'}`} aria-label="Toggle Chat">
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </button>
        </>
    );
};

export default Chatbot;

