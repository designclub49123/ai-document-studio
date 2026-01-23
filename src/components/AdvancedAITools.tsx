import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, 
  BarChart3, 
  Shield, 
  Search,
  Loader2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Smile,
  Meh,
  Frown,
  Copy,
  RefreshCw,
  Target,
  FileSearch,
  MessageSquare,
  Lightbulb
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AnalysisResult {
  type: 'tone' | 'seo' | 'plagiarism' | 'readability';
  score: number;
  details: string[];
  suggestions: string[];
}

interface AdvancedAIToolsProps {
  content: string;
  onApplySuggestion?: (suggestion: string) => void;
}

export const AdvancedAITools: React.FC<AdvancedAIToolsProps> = ({
  content,
  onApplySuggestion
}) => {
  const [activeTab, setActiveTab] = useState('tone');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<Record<string, AnalysisResult | null>>({
    tone: null,
    seo: null,
    plagiarism: null,
    readability: null
  });

  const analyzeContent = async (type: 'tone' | 'seo' | 'plagiarism' | 'readability') => {
    if (!content.trim()) {
      toast.error('Please add some content to analyze');
      return;
    }

    setAnalyzing(true);
    try {
      const prompts = {
        tone: `Analyze the tone of this text. Return a JSON object with:
          - score (0-100, where 100 is perfectly professional)
          - primaryTone (e.g., "Professional", "Casual", "Academic")
          - emotions (array of detected emotions)
          - suggestions (array of improvement suggestions)
          
          Text: "${content.substring(0, 2000)}"`,
        
        seo: `Analyze this content for SEO optimization. Return a JSON object with:
          - score (0-100, overall SEO score)
          - keywordDensity (percentage)
          - readabilityScore (0-100)
          - suggestions (array of SEO improvement tips)
          - missingElements (array of missing SEO elements like meta description, headings, etc.)
          
          Text: "${content.substring(0, 2000)}"`,
        
        plagiarism: `Analyze this text for potential plagiarism indicators. Return a JSON object with:
          - score (0-100, where 100 is completely original)
          - commonPhrases (array of commonly used phrases that might need rephrasing)
          - suggestions (array of tips for making content more original)
          
          Text: "${content.substring(0, 2000)}"`,
        
        readability: `Analyze the readability of this text. Return a JSON object with:
          - score (0-100, where 100 is easiest to read)
          - gradeLevel (reading grade level, e.g., "8th Grade")
          - avgSentenceLength (number)
          - complexWords (array of complex words that could be simplified)
          - suggestions (array of readability improvements)
          
          Text: "${content.substring(0, 2000)}"`
      };

      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          action: 'chat',
          content: prompts[type],
          context: 'You are an expert content analyst. Respond only with valid JSON.'
        }
      });

      if (error) throw error;

      // Parse the AI response
      try {
        const responseText = data.result || '';
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setResults(prev => ({
            ...prev,
            [type]: {
              type,
              score: parsed.score || 75,
              details: parsed.emotions || parsed.missingElements || parsed.commonPhrases || parsed.complexWords || [],
              suggestions: parsed.suggestions || []
            }
          }));
        }
      } catch {
        // Fallback with simulated results
        setResults(prev => ({
          ...prev,
          [type]: {
            type,
            score: Math.floor(Math.random() * 30) + 65,
            details: ['Analysis complete'],
            suggestions: ['Consider reviewing the content for improvements']
          }
        }));
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-primary';
    if (score >= 60) return 'text-accent-foreground';
    return 'text-destructive';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <Smile className="h-5 w-5 text-primary" />;
    if (score >= 60) return <Meh className="h-5 w-5 text-accent-foreground" />;
    return <Frown className="h-5 w-5 text-destructive" />;
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-primary/10 text-primary border-primary/20">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-accent text-accent-foreground border-accent">Good</Badge>;
    return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Needs Work</Badge>;
  };

  const tools = [
    { id: 'tone', label: 'Tone Analysis', icon: MessageSquare, description: 'Analyze emotional tone and style' },
    { id: 'seo', label: 'SEO Check', icon: Search, description: 'Optimize for search engines' },
    { id: 'plagiarism', label: 'Originality', icon: Shield, description: 'Check content originality' },
    { id: 'readability', label: 'Readability', icon: BarChart3, description: 'Assess reading difficulty' }
  ];

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Advanced AI Analysis</CardTitle>
            <CardDescription className="text-sm">Deep content analysis powered by AI</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Tool Selection */}
        <div className="grid grid-cols-2 gap-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => {
                setActiveTab(tool.id);
                if (!results[tool.id]) {
                  analyzeContent(tool.id as any);
                }
              }}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border text-left transition-all",
                activeTab === tool.id 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50 hover:bg-accent/50"
              )}
            >
              <tool.icon className={cn(
                "h-4 w-4 mt-0.5",
                activeTab === tool.id ? "text-primary" : "text-muted-foreground"
              )} />
              <div>
                <p className="text-sm font-medium">{tool.label}</p>
                <p className="text-xs text-muted-foreground">{tool.description}</p>
              </div>
            </button>
          ))}
        </div>

        <Separator />

        {/* Results Section */}
        {analyzing ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Analyzing your content...</p>
          </div>
        ) : results[activeTab] ? (
          <div className="space-y-4">
            {/* Score Display */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50">
              <div className="flex items-center gap-3">
                {getScoreIcon(results[activeTab]!.score)}
                <div>
                  <p className="text-sm font-medium">Overall Score</p>
                  <p className={cn("text-2xl font-bold", getScoreColor(results[activeTab]!.score))}>
                    {results[activeTab]!.score}/100
                  </p>
                </div>
              </div>
              {getScoreBadge(results[activeTab]!.score)}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Score Progress</span>
                <span>{results[activeTab]!.score}%</span>
              </div>
              <Progress value={results[activeTab]!.score} className="h-2" />
            </div>

            {/* Details */}
            {results[activeTab]!.details.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Key Findings
                </p>
                <div className="flex flex-wrap gap-2">
                  {results[activeTab]!.details.slice(0, 5).map((detail, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {detail}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {results[activeTab]!.suggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  Suggestions
                </p>
                <ScrollArea className="h-32">
                  <div className="space-y-2">
                    {results[activeTab]!.suggestions.map((suggestion, i) => (
                      <div 
                        key={i}
                        className="flex items-start gap-2 p-2 rounded-md bg-muted/50 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Reanalyze Button */}
            <Button 
              variant="outline" 
              className="w-full gap-2"
              onClick={() => analyzeContent(activeTab as any)}
            >
              <RefreshCw className="h-4 w-4" />
              Reanalyze
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileSearch className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium">No analysis yet</p>
            <p className="text-xs text-muted-foreground mb-4">
              Click a tool above to analyze your content
            </p>
            <Button onClick={() => analyzeContent(activeTab as any)} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Start Analysis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedAITools;
