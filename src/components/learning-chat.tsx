'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getLearningResponse, type LearningQuery, type LearningResponse } from '@/ai/flows/learning-chat';
import { formatMarkdown } from '@/lib/markdown-utils';
import { useCurrency } from '@/contexts/preferences-context';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  suggestions?: string[];
}

const learningThemes = [
  {
    id: 'budgeting',
    title: { en: 'Budgeting Basics', fr: 'Bases de la Budgétisation' },
    description: {
      en: 'Learn fundamental budgeting concepts and techniques',
      fr: 'Apprenez les concepts fondamentaux de budgétisation'
    }
  },
  {
    id: 'saving',
    title: { en: 'Saving Strategies', fr: 'Stratégies d\'Épargne' },
    description: {
      en: 'Discover effective saving methods and habits',
      fr: 'Découvrez des méthodes d\'épargne efficaces'
    }
  },
  {
    id: 'housing',
    title: { en: 'Housing & Rent', fr: 'Logement & Loyer' },
    description: {
      en: 'Understand housing costs and financing options',
      fr: 'Comprenez les coûts de logement et options de financement'
    }
  },
  {
    id: 'investment',
    title: { en: 'Investment Basics', fr: 'Bases de l\'Investissement' },
    description: {
      en: 'Learn about investment types and strategies',
      fr: 'Apprenez les types d\'investissement et stratégies'
    }
  },
  {
    id: 'debt',
    title: { en: 'Debt Management', fr: 'Gestion de la Dette' },
    description: {
      en: 'Master debt repayment and credit management',
      fr: 'Maîtrisez le remboursement de dettes et gestion du crédit'
    }
  },
  {
    id: 'goals',
    title: { en: 'Goal Setting', fr: 'Fixation d\'Objectifs' },
    description: {
      en: 'Set and achieve your financial goals',
      fr: 'Définissez et atteignez vos objectifs financiers'
    }
  },
  {
    id: 'planning',
    title: { en: 'Financial Planning', fr: 'Planification Financière' },
    description: {
      en: 'Comprehensive financial planning and wealth building',
      fr: 'Planification financière complète et constitution de patrimoine'
    }
  }
];

export function LearningChat() {
  const { currency, formatCurrency } = useCurrency();
  const getWelcomeMessage = (lang: 'en' | 'fr') => {
    if (lang === 'fr') {
      return {
        text: 'Bonjour! Je suis votre assistant d\'apprentissage Tracklet. Je peux vous aider à apprendre la finance personnelle. Que voulez-vous explorer aujourd\'hui?',
        suggestions: ['Bases de la Budgétisation', 'Stratégies d\'Épargne', 'Bases de l\'Investissement']
      };
    }
    return {
      text: 'Hello! I\'m your Tracklet Learning Assistant. I can help you learn about personal finance. What would you like to explore today?',
      suggestions: ['Budgeting Basics', 'Saving Strategies', 'Investment Basics']
    };
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: getWelcomeMessage('en').text,
      sender: 'ai',
      timestamp: new Date(),
      suggestions: getWelcomeMessage('en').suggestions
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'fr'>('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update welcome message when language changes
  useEffect(() => {
    setMessages(prev => prev.map(msg =>
      msg.id === 'welcome'
        ? { ...msg, text: getWelcomeMessage(language).text, suggestions: getWelcomeMessage(language).suggestions }
        : msg
    ));
  }, [language]);

  const sendMessage = async (messageText: string, theme?: string) => {
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const query: LearningQuery = {
        message: messageText,
        theme: theme || selectedTheme || undefined,
        language: language,
        currency: currency
      };

      const response: LearningResponse = await getLearningResponse(query);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: 'ai',
        timestamp: new Date(),
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, aiMessage]);
      setSelectedTheme(response.theme || null);
    } catch (error) {
//      console.error('Learning chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleThemeClick = (theme: typeof learningThemes[0]) => {
    setSelectedTheme(theme.id);
    const themeTitle = typeof theme.title === 'object' ? theme.title[language] : theme.title;
    const message = language === 'fr'
      ? `Parlez-moi de ${themeTitle}`
      : `Tell me about ${themeTitle}`;
    sendMessage(message, theme.id);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Theme Selection */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">Learning Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {learningThemes.map((theme) => (
              <Button
                key={theme.id}
                variant="outline"
                className="h-auto min-h-[80px] p-4 text-left justify-start whitespace-normal"
                onClick={() => handleThemeClick(theme)}
                disabled={isLoading}
              >
                <div className="w-full">
                  <div className="font-medium text-sm leading-tight">
                    {typeof theme.title === 'object' ? theme.title[language] : theme.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {typeof theme.description === 'object' ? theme.description[language] : theme.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Learning Assistant</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Language:</span>
              <div className="flex rounded-md border">
                <Button
                  variant={language === 'en' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setLanguage('en')}
                  className="rounded-r-none"
                >
                  EN
                </Button>
                <Button
                  variant={language === 'fr' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setLanguage('fr')}
                  className="rounded-l-none"
                >
                  FR
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div
                      className="prose prose-sm max-w-none prose-headings:mb-2 prose-p:mb-2 prose-ul:mb-2 prose-ol:mb-2"
                      dangerouslySetInnerHTML={{ __html: formatMarkdown(message.text) }}
                    />
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs opacity-70">Suggested topics:</div>
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-7"
                              onClick={() => handleSuggestionClick(suggestion)}
                              disabled={isLoading}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  language === 'fr'
                    ? "Posez-moi une question sur la finance personnelle..."
                    : "Ask me anything about personal finance..."
                }
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                Send
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}