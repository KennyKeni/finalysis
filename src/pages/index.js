import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleFileUpload = async (e) => {
    try {
      setLoading(true);
      const file = e.target.files[0];
      if (!file) return;

      if (file.type !== 'application/pdf') {
        setUploadStatus('Upload failed: Only PDF files are allowed');
        return;
      }

      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch('/api/ingest', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, {
          type: 'system',
          content: 'PDF uploaded successfully! You can now ask questions about it.'
        }]);
      }
      setUploadStatus(data.success ? 'File uploaded successfully!' : 'Upload failed');
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('Upload failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async (e) => {
    e.preventDefault(); // Prevent form submission
    if (!query.trim()) return;

    try {
      setLoading(true);
      // Add user message immediately
      setMessages(prev => [...prev, { type: 'user', content: query }]);
      
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      
      const data = await response.json();
      // Add AI response
      setMessages(prev => [...prev, { type: 'ai', content: data.answer }]);
      setQuery(''); // Clear input after sending
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { type: 'error', content: error.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white p-4 shadow-lg">
        <h1 className="text-xl font-bold mb-4 text-black">Financial Assistant</h1>
        
        {/* File Upload Section */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold mb-2 text-black">Upload PDF</h2>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="mb-2 text-sm"
          />
          {uploadStatus && (
            <div className={`text-sm ${uploadStatus.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
              {uploadStatus}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : message.type === 'system'
                    ? 'bg-gray-200 text-gray-700'
                    : 'bg-white text-black shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <form onSubmit={handleAsk} className="p-4 bg-white border-t">
          <div className="flex space-x-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about the financial document..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button 
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-400 hover:bg-blue-600 transition-colors"
            >
              {loading ? 'Thinking...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
