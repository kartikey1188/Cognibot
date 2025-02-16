import React from 'react';
import { MessageCircle, Send, BookOpen, Clock } from 'lucide-react';
import AssistantIcon from "@mui/icons-material/Assistant";
import { ndinuseNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();
  return (
    <div className="w-full max-w-6xl mx-auto px-4 pt-28">

      <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-16">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Transform your learning Journey
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Register for our courses now.
          </p>
          <p className="text-xl text-gray-600 mb-8">
            Learn Smarter with CogniBot!  <AssistantIcon></AssistantIcon><br />
            <span className='text-base font-bold'>Your personal ai Assistant</span>
          </p>
          <button onClick={()=>navigate('/login')} className="bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-600 transition-colors">
            Get Started
          </button>
        </div>

        {/* AI Chat Interface */}
        <div className="w-full md:w-80 bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium">AI Assistant</span>
          </div>
          
          <div className="space-y-4 mb-4">
            <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
              Hi! How can I help you learn today?
            </div>
            <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
              I can explain any topic clearly!
            </div>
          </div>

          <div className="flex items-center gap-2 border rounded-full p-2">
            <input 
              type="text" 
              placeholder="Ask anything..."
              className="flex-1 bg-transparent outline-none px-2"
            />
            <button className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">Personalized Learning</h3>
          <p className="text-gray-600">
            Adaptive AI that adjusts to your learning style
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
          <p className="text-gray-600">
            Get help anytime, anywhere
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;