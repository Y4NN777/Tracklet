import { LearningChat } from '@/components/learning-chat';

export default function LearningPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Learning Center
        </h1>
        <p className="text-muted-foreground mt-2">
          Learn about personal finance through interactive conversations with our AI assistant.
        </p>
      </div>

      <div className="h-[calc(100vh-200px)]">
        <LearningChat />
      </div>
    </div>
  );
}