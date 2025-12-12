import React, { useState, useMemo } from 'react';
import SimpleMarkdown from '../components/SimpleMarkdown';
import { THEORY_TOPICS } from '../constants';
import { Topic, Difficulty, TopicCategory } from '../types';
import { ChevronRight, BrainCircuit, Menu, Folder, FileText, Search, X } from 'lucide-react';
import { generateQuizForTopic } from '../services/geminiService';

export default function Theory() {
  const [selectedTopic, setSelectedTopic] = useState<Topic>(THEORY_TOPICS[0]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Quiz State
  const [quiz, setQuiz] = useState<any[] | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  // Expanded Categories
  const categories: TopicCategory[] = [
    'Network Fundamentals', 
    'Physical Layer & Cabling',
    'L2 Switching & Bridging', 
    'L3 Routing & Architecture', 
    'Network Security', 
    'IP Services', 
    'Wireless & Mobility',
    'WAN Technologies',
    'Automation & SDN'
  ];

  const filteredTopics = useMemo(() => {
      if (!searchQuery.trim()) return THEORY_TOPICS;
      return THEORY_TOPICS.filter(t => 
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  }, [searchQuery]);

  const categorizedTopics = useMemo(() => {
    const groups: Partial<Record<TopicCategory, Topic[]>> = {};
    categories.forEach(cat => groups[cat] = []);
    
    filteredTopics.forEach(t => {
      if (groups[t.category]) {
        groups[t.category]?.push(t);
      }
    });
    return groups;
  }, [filteredTopics]);

  const handleStartQuiz = async () => {
      setQuizLoading(true);
      setQuiz(null);
      const generatedQuiz = await generateQuizForTopic(selectedTopic.title);
      setQuiz(generatedQuiz);
      setQuizLoading(false);
      setQuizAnswers({});
      setShowResults(false);
  };

  const calculateScore = () => {
      if (!quiz) return 0;
      let correct = 0;
      quiz.forEach((q, idx) => {
          if (quizAnswers[idx] === q.correctAnswer) correct++;
      });
      return correct;
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] animate-fade-in -m-4 md:-m-8">
      {/* Topics Sidebar */}
      <div className={`
        lg:w-80 bg-slate-50 border-r border-slate-200 overflow-y-auto flex-shrink-0 transition-all duration-300 flex flex-col
        ${isSidebarOpen ? 'w-full absolute inset-0 z-20 lg:relative lg:w-80' : 'hidden lg:block'}
      `}>
          <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-10 space-y-3">
              <div className="flex justify-between items-center">
                  <h2 className="font-bold text-slate-700 flex items-center">
                      <Folder className="mr-2 h-4 w-4" /> 
                      Knowledge Base
                  </h2>
                  <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 bg-slate-100 rounded hover:bg-slate-200">
                      <ChevronRight size={16} />
                  </button>
              </div>
              <div className="relative">
                  <Search className="absolute left-2 top-2.5 text-slate-400 h-4 w-4" />
                  <input 
                      type="text" 
                      placeholder="Search 50+ topics..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-8 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600">
                          <X size={14} />
                      </button>
                  )}
              </div>
          </div>
          
          <div className="p-4 space-y-6 flex-1 overflow-y-auto">
              {categories.map(category => {
                  const topics = categorizedTopics[category];
                  if (!topics || topics.length === 0) return null;

                  return (
                    <div key={category}>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-2">{category}</h3>
                        <div className="space-y-1">
                            {topics.map(topic => (
                                <button
                                    key={topic.id}
                                    onClick={() => {
                                        setSelectedTopic(topic);
                                        setQuiz(null);
                                        if (window.innerWidth < 1024) setSidebarOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
                                        selectedTopic.id === topic.id 
                                            ? 'bg-white text-blue-700 font-medium shadow-sm border border-slate-200' 
                                            : 'text-slate-600 hover:bg-slate-200/50'
                                    }`}
                                >
                                    <div className="flex items-center overflow-hidden">
                                        <FileText size={14} className={`mr-2 flex-shrink-0 ${selectedTopic.id === topic.id ? 'text-blue-500' : 'text-slate-400'}`} />
                                        <span className="truncate">{topic.title}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                  );
              })}
              
              {filteredTopics.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-sm">
                      No topics found for "{searchQuery}".
                  </div>
              )}
          </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
        {/* Mobile Toggle */}
        {!isSidebarOpen && (
            <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden absolute top-4 left-4 z-20 p-2 bg-white shadow-md rounded-lg border border-slate-200"
            >
                <Menu size={20} />
            </button>
        )}

        <div className="flex-1 overflow-y-auto p-4 lg:p-12 scroll-smooth">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center space-x-3 mb-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedTopic.difficulty === Difficulty.Beginner ? 'bg-green-100 text-green-700' : 
                        selectedTopic.difficulty === Difficulty.Intermediate ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {selectedTopic.difficulty}
                    </span>
                    <span className="text-slate-400 text-sm">{selectedTopic.category}</span>
                </div>
                
                <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-8 border-b pb-8 border-slate-100 leading-tight">{selectedTopic.title}</h1>
                
                <article className="prose prose-slate prose-lg max-w-none mb-16">
                    <SimpleMarkdown>{selectedTopic.content}</SimpleMarkdown>
                </article>

                {/* Integrated Quiz Section */}
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-8 md:p-12 text-white shadow-2xl mb-12">
                    <div className="flex items-center space-x-3 mb-6">
                        <BrainCircuit className="text-indigo-400 h-8 w-8" />
                        <h3 className="text-2xl font-bold">Knowledge Check</h3>
                    </div>

                    {!quiz && !quizLoading && (
                         <div className="text-center py-6">
                            <p className="text-indigo-200 mb-8 text-lg">Validate your understanding of {selectedTopic.title} with an AI-generated quiz.</p>
                            <button 
                                onClick={handleStartQuiz}
                                className="px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/50 text-lg"
                            >
                                Generate AI Quiz
                            </button>
                         </div>
                    )}

                    {quizLoading && (
                         <div className="text-center py-12">
                             <div className="animate-spin w-12 h-12 border-4 border-indigo-400 border-t-white rounded-full mx-auto mb-6"></div>
                             <p className="text-indigo-200 text-lg">Consulting the knowledge base...</p>
                         </div>
                    )}

                    {quiz && (
                        <div className="space-y-8 animate-fade-in">
                            {quiz.map((q, idx) => (
                                <div key={idx} className="bg-white/10 p-6 md:p-8 rounded-xl backdrop-blur-sm">
                                    <p className="font-semibold text-lg md:text-xl mb-6">{idx + 1}. {q.question}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {q.options.map((opt: string, oIdx: number) => (
                                            <button
                                                key={oIdx}
                                                disabled={showResults}
                                                onClick={() => setQuizAnswers(prev => ({...prev, [idx]: opt}))}
                                                className={`text-left p-4 rounded-lg border transition-all ${
                                                    showResults 
                                                        ? opt === q.correctAnswer 
                                                            ? 'bg-green-500/20 border-green-500 text-green-200'
                                                            : quizAnswers[idx] === opt 
                                                                ? 'bg-red-500/20 border-red-500 text-red-200' 
                                                                : 'bg-transparent border-white/10 text-slate-400'
                                                        : quizAnswers[idx] === opt 
                                                            ? 'bg-indigo-600 border-indigo-400 text-white' 
                                                            : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-200'
                                                }`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                    {showResults && (
                                        <div className="mt-6 p-4 bg-black/30 rounded-lg text-sm text-indigo-200 leading-relaxed">
                                            <span className="font-bold text-white block mb-1">Explanation: </span>
                                            {q.explanation}
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            <div className="flex justify-end pt-6">
                                {!showResults ? (
                                    <button 
                                        onClick={() => setShowResults(true)}
                                        className="px-8 py-3 bg-white text-slate-900 rounded-lg font-bold hover:bg-slate-100 transition-colors shadow-lg"
                                    >
                                        Check Answers
                                    </button>
                                ) : (
                                    <div className="flex items-center space-x-6">
                                        <p className="font-bold text-2xl">Score: {calculateScore()} / {quiz.length}</p>
                                        <button 
                                            onClick={handleStartQuiz}
                                            className="px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors font-semibold"
                                        >
                                            New Quiz
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    );
}