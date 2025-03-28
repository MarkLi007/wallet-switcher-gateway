
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileDiff, Diff } from "lucide-react";

interface DiffChunk {
  added?: boolean;
  removed?: boolean;
  value: string;
}

const DiffCompare: React.FC<{ paperId: string; versionCount: number }> = ({ 
  paperId,
  versionCount 
}) => {
  const [versionIndex, setVersionIndex] = useState("");
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [diffResult, setDiffResult] = useState<DiffChunk[] | null>(null);
  const [verA, setVerA] = useState("");
  const [verB, setVerB] = useState("");
  const [isComparing, setIsComparing] = useState(false);

  // Submit version text
  async function handleSubmitVersion(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const resp = await fetch("http://localhost:3002/api/version", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paperId,
          versionIndex,
          text
        })
      });
      
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || "Submission failed");
      }
      
      toast.success("Version text submitted successfully");
      setText("");
      setVersionIndex("");
    } catch (err) {
      toast.error("Error: " + (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Request diff comparison
  async function handleDiff(e: React.FormEvent) {
    e.preventDefault();
    
    if (!verA || !verB) {
      toast.error("Please select both versions to compare");
      return;
    }
    
    setIsComparing(true);
    try {
      const url = `http://localhost:3002/api/diff?paperId=${paperId}&verA=${verA}&verB=${verB}`;
      const resp = await fetch(url);
      
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || "Failed to get diff");
      }
      
      setDiffResult(data.diff);
      toast.success(`Comparison complete: version ${verA} vs ${verB}`);
    } catch (err) {
      toast.error("Error: " + (err as Error).message);
      setDiffResult(null);
    } finally {
      setIsComparing(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileDiff className="h-5 w-5" />
          Version Difference Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border rounded-md p-4 space-y-4">
          <h3 className="text-lg font-medium">Submit Text for a Version</h3>
          <form onSubmit={handleSubmitVersion} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="versionIndex">Version Index:</Label>
                <Input
                  id="versionIndex"
                  value={versionIndex}
                  onChange={(e) => setVersionIndex(e.target.value)}
                  placeholder="E.g., 0, 1, 2..."
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="textContent">Version Text Content:</Label>
              <Textarea
                id="textContent"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                placeholder="Enter the text content for this version"
                required
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Version Text"}
            </Button>
          </form>
        </div>

        <div className="border rounded-md p-4 space-y-4">
          <h3 className="text-lg font-medium">Compare Two Versions</h3>
          <form onSubmit={handleDiff} className="space-y-4">
            <p className="text-sm text-gray-500">
              Select two version indexes (0 to {versionCount - 1}) to compare
            </p>
            <div className="flex items-center gap-4">
              <div className="space-y-2 flex-1">
                <Label htmlFor="versionA">Version A:</Label>
                <Input
                  id="versionA"
                  value={verA}
                  onChange={(e) => setVerA(e.target.value)}
                  placeholder="E.g., 0"
                  required
                />
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="versionB">Version B:</Label>
                <Input
                  id="versionB"
                  value={verB}
                  onChange={(e) => setVerB(e.target.value)}
                  placeholder="E.g., 1"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="mt-6"
                disabled={isComparing}
              >
                {isComparing ? (
                  <>
                    <Diff className="mr-2 h-4 w-4 animate-spin" />
                    Comparing...
                  </>
                ) : (
                  <>
                    <Diff className="mr-2 h-4 w-4" />
                    Compare
                  </>
                )}
              </Button>
            </div>
          </form>
          
          {diffResult && (
            <div className="border p-4 rounded-md bg-slate-50 mt-4 overflow-auto">
              <h4 className="text-md font-medium mb-2">Comparison Result:</h4>
              <div className="whitespace-pre-wrap">
                {diffResult.map((chunk, i) => {
                  if (chunk.added) {
                    return (
                      <span key={i} className="bg-green-100 text-green-800">
                        {chunk.value}
                      </span>
                    );
                  } else if (chunk.removed) {
                    return (
                      <span key={i} className="bg-red-100 text-red-800 line-through">
                        {chunk.value}
                      </span>
                    );
                  } else {
                    return <span key={i}>{chunk.value}</span>;
                  }
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DiffCompare;
