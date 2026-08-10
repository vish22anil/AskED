import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search as SearchIcon, Filter, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuestions } from "@/hooks/useQuestions";
import { useInView } from "react-intersection-observer";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useQuestions({ search: query, sort });
  
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten infinite scroll data
  const questions = data?.pages.flatMap(page => page.questions) || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(searchTerm);
  };
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Search AskED</h1>
        <p className="text-muted-foreground">Find answers, discussions, and verified solutions.</p>
        
        <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto mt-6">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="e.g., How does photosynthesis work?" 
              className="pl-10 h-12 text-base rounded-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit" size="icon" className="h-12 w-12 rounded-full shrink-0">
            <ArrowRight className="h-5 w-5" />
          </Button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <Badge variant="secondary" className="px-3 py-1 cursor-pointer hover:bg-secondary/80">#javascript</Badge>
        <Badge variant="secondary" className="px-3 py-1 cursor-pointer hover:bg-secondary/80">#calculus</Badge>
        <Badge variant="secondary" className="px-3 py-1 cursor-pointer hover:bg-secondary/80">#physics</Badge>
        <Badge variant="secondary" className="px-3 py-1 cursor-pointer hover:bg-secondary/80">#history</Badge>
      </div>

      <div className="flex items-center justify-between mt-12 mb-4">
        <h2 className="text-xl font-semibold tracking-tight">Top Results</h2>
        <div className="flex gap-2">
          <select 
            className="text-sm border rounded-md px-2 py-1 bg-background"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="most_viewed">Most Viewed</option>
            <option value="unanswered">Unanswered</option>
          </select>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
        ) : questions?.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">No questions found. Try a different search.</div>
        ) : (
          questions?.map((q: any) => (
            <Link to={`/question/${q.id}`} key={q.id} className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                      {q.title}
                    </h3>
                    {q.answers?.some((a: any) => a.isAccepted) && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">Verified</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2" dangerouslySetInnerHTML={{ __html: q.description }} />
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-1">{q._count?.votes || 0} Upvotes</span>
                    <span className="flex items-center gap-1">{q._count?.answers || 0} Answers</span>
                    <span>Asked {new Date(q.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
        
        {/* Infinite Scroll trigger */}
        <div ref={ref} className="h-10 flex items-center justify-center">
          {isFetchingNextPage && <Loader2 className="h-5 w-5 animate-spin" />}
        </div>
      </div>
    </div>
  );
}
