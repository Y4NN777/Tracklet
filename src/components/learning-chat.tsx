'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getLearningResponse, type LearningQuery, type LearningResponse } from '@/ai/flows/learning-chat';
import { formatMarkdown } from '@/lib/markdown-utils';
import { useCurrency } from '@/contexts/preferences-context';
import { useIntlayer } from 'next-intlayer';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  suggestions?: string[];
}

export function LearningChat() {
  const i = useIntlayer('learning-chat');
  const { currency, formatCurrency } = useCurrency();

  const learningThemes = [
    { id: 'budgeting', title: i.budgetingBasicsTitle, description: i.budgetingBasicsDescription },
    { id: 'saving', title: i.savingStrategiesTitle, description: i.savingStrategiesDescription },
    { id: 'housing', title: i.housingAndRentTitle, description: i.housingAndRentDescription },
    { id: 'investment', title: i.investmentBasicsTitle, description: i.investmentBasicsDescription },
    { id: 'debt', title: i.debtManagementTitle, description: i.debtManagementDescription },
    { id: 'goals', title: i.goalSettingTitle, description: i.goalSettingDescription },
    { id: 'planning', title: i.financialPlanningTitle, description: i.financialPlanningDescription },
  ];

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        text: i.welcome,
        sender: 'ai',
        timestamp: new Date(),
        suggestions: i.welcomeSuggestions,
      }
    ]);
  }, [i.locale]);

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
        language: i.locale as 'en' | 'fr',
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
        text: i.errorMessage,
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
    const message = `${i.tellMeAbout} ${theme.title}`;
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
          <CardTitle className="text-lg">{i.learningTopics}</CardTitle>
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
                    {theme.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {theme.description}
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
            <CardTitle className="text-lg">{i.learningAssistant}</CardTitle>
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
                        <div className="text-xs opacity-70">{i.suggestedTopics}</div>
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={`${suggestion}-${index}`}
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
                      <span className="text-sm">{i.thinking}</span>
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
                placeholder={i.placeholder}
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                {i.send}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}