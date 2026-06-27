'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Lightbulb } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { LearningChat } from "@/components/learning-chat";
import { InsightsForm } from "@/components/insights-form";

export default function AssistantHub() {
  const i = useIntlayer('main-nav');

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">{i.assistant}</h1>
        <p className="text-muted-foreground text-lg">Financial education and AI-powered insights.</p>
      </div>

      <Tabs defaultValue="learning" className="w-full flex-1 flex flex-col mt-4">
        <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md">
          <TabsTrigger value="learning" className="flex items-center gap-2 py-3 text-base">
            <GraduationCap className="h-5 w-5" />
            Learning
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2 py-3 text-base">
            <Lightbulb className="h-5 w-5" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="learning" className="flex-1 mt-0 outline-none overflow-hidden">
           <LearningChat />
        </TabsContent>

        <TabsContent value="insights" className="mt-0 outline-none overflow-y-auto">
           <InsightsForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
