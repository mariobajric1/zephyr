import { useState } from "react";
import { Link } from "wouter";
import { Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

export function Search() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [explanation, setExplanation] = useState("");
  const [isExplanationComplete, setIsExplanationComplete] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setResults([]);
    setExplanation("");
    setIsExplanationComplete(false);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Failed to read response");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Convert the chunk to text
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n");

        // Process each line
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(5));

              if (data.type === 'results') {
                setResults(data.results);
              } else if (data.type === 'explanation') {
                setExplanation(prev => prev + data.content);
              } else if (data.type === 'done') {
                setIsExplanationComplete(true);
              } else if (data.type === 'error') {
                throw new Error(data.details || 'Search failed');
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to perform search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <a className="flex items-center gap-2">
                <Logo className="w-8 h-8" />
                <span className="font-semibold">Zephyr Search</span>
              </a>
            </Link>
          </div>
          <ThemeSwitcher />
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="flex gap-2 mb-8">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What would you like to search?"
              className="flex-1"
              disabled={isSearching}
            />
            <Button type="submit" disabled={isSearching}>
              <SearchIcon className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>

          {isSearching && !results.length && (
            <div className="text-center text-muted-foreground">
              Searching...
            </div>
          )}

          {(results.length > 0 || explanation) && (
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-2">Zephyr's Explanation</h2>
                  <p className="text-muted-foreground relative">
                    {explanation}
                    {!isExplanationComplete && (
                      <span className="inline-block ml-1 animate-pulse">▊</span>
                    )}
                  </p>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Search Results</h2>
                {results.map((result, i) => (
                  <Card key={i}>
                    <CardContent className="pt-6">
                      <a
                        href={result.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block hover:opacity-80"
                      >
                        <h3 className="text-primary font-medium mb-1">
                          {result.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {result.snippet}
                        </p>
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}