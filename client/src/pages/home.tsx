import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ChatPanel } from "@/components/agent/ChatPanel";
import { CodePanel } from "@/components/agent/CodePanel";
import { PreviewPanel } from "@/components/agent/PreviewPanel";
import { mockPlanner, mockGenerator, mockExplainer, GenerationResult, INITIAL_CODE } from "@/lib/agent-mock";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    try {
      // 1. Plan
      const plan = await mockPlanner(prompt, result?.plan);
      
      // 2. Generate Code
      const code = mockGenerator(plan);
      
      // 3. Explain
      const explanation = mockExplainer(plan);

      setResult({
        plan,
        code,
        explanation,
        timestamp: Date.now()
      });
    } catch (e) {
      console.error("Generation failed", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="h-screen w-full bg-background overflow-hidden flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        
        {/* LEFT: Agent / Chat */}
        <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
          <ChatPanel 
            onGenerate={handleGenerate} 
            onReset={handleReset}
            explanation={result?.explanation || ""}
            isGenerating={isGenerating}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />

        {/* RIGHT: Workspace */}
        <ResizablePanel defaultSize={75}>
          <ResizablePanelGroup direction="horizontal">
            
            {/* Code View */}
            <ResizablePanel defaultSize={40} minSize={20}>
              <CodePanel code={result?.code || INITIAL_CODE} />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Live Preview */}
            <ResizablePanel defaultSize={60} minSize={30}>
              <PreviewPanel plan={result?.plan || null} />
            </ResizablePanel>

          </ResizablePanelGroup>
        </ResizablePanel>

      </ResizablePanelGroup>
    </div>
  );
}
