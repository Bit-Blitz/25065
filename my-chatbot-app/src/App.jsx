import React from 'react';
import Chatbot from './Chatbot.jsx'; // Import the component you just created
import './App.css'; // Keep the default styles

function App() {
  return (
    <div className="App">
      {/* This is your main page content */}
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-4">My Website</h1>
        <p className="text-lg">This is the main content of the page. The chatbot will appear over this.</p>
      </div>

      {/* This line adds the chatbot to the page */}
      <Chatbot />
    </div>
  );
}

export default App;