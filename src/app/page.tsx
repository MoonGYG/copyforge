"use client";

import { useState } from "react";
import { Sparkles, FileText, Megaphone, ShoppingBag, Mail, Share2, Copy, Check, Loader2, Flame } from "lucide-react";

const COPY_TYPES = [
  { id: "landing", label: "Landing Page", icon: FileText, description: "High-converting hero sections" },
  { id: "ads", label: "Ad Copy", icon: Megaphone, description: "Social & search ads" },
  { id: "product", label: "Product", icon: ShoppingBag, description: "E-commerce descriptions" },
  { id: "email", label: "Email", icon: Mail, description: "Marketing emails" },
  { id: "social", label: "Social", icon: Share2, description: "Social media posts" },
];

const TONES = ["Professional", "Casual", "Bold", "Luxury", "Playful", "Urgent"];

export default function Home() {
  const [copyType, setCopyType] = useState("landing");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("Professional");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<Array<{ type: string; product: string; output: string }>>([]);

  const handleGenerate = async () => {
    if (!productName || !description) return;
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, description, audience, tone, copyType }),
      });
      const data = await res.json();
      if (data.error) {
        setOutput(`Error: ${data.error}`);
      } else {
        setOutput(data.content);
        setHistory((prev) => [{ type: copyType, product: productName, output: data.content }, ...prev].slice(0, 10));
      }
    } catch {
      setOutput("Network error. Please try again.");
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen px-4 py-8 md:px-8">
      {/* Header */}
      <header className="max-w-5xl mx-auto mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Flame className="w-10 h-10" style={{ color: "var(--accent-warm)" }} />
          <h1 className="text-4xl md:text-5xl font-extrabold gradient-text">CopyForge</h1>
        </div>
        <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
          AI-Powered Copywriting — Forge words that convert
        </p>
        <div className="flex items-center justify-center gap-2 mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
          <Sparkles className="w-4 h-4 spark-icon" />
          <span>Forged with MiMo v2.5 Pro</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Input Form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Copy Type Selector */}
          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Choose Copy Type
            </h2>
            <div className="flex flex-wrap gap-2">
              {COPY_TYPES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setCopyType(t.id)}
                    className={`copy-type-tab flex items-center gap-2 ${copyType === t.id ? "active" : ""}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Fields */}
          <div className="glass-card p-5 space-y-4">
            <div>
              <label className="text-sm font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>
                Product / Service Name *
              </label>
              <input
                className="input-field"
                placeholder="e.g. CloudSync Pro"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>
                Description *
              </label>
              <textarea
                className="input-field"
                placeholder="Describe what it does, key features, benefits, unique selling points..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>
                  Target Audience
                </label>
                <input
                  className="input-field"
                  placeholder="e.g. Small business owners"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>
                  Tone
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {TONES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`copy-type-tab text-xs ${tone === t ? "active" : ""}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              className="glow-button w-full flex items-center justify-center gap-2 text-base"
              onClick={handleGenerate}
              disabled={loading || !productName || !description}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Forging Copy...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Output */}
          {output && (
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold" style={{ color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Generated Copy
                </h2>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: copied ? "rgba(34,197,94,0.2)" : "rgba(245,158,11,0.15)",
                    color: copied ? "#22c55e" : "var(--accent-gold)",
                    border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "var(--border-warm)"}`,
                  }}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="output-block">{output}</div>
            </div>
          )}
        </div>

        {/* Right Panel: History */}
        <div className="space-y-5">
          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Recent Generations
            </h2>
            {history.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Your generated copy will appear here.
              </p>
            ) : (
              <div className="space-y-3">
                {history.map((h, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.02]"
                    style={{
                      background: "rgba(45,24,16,0.6)",
                      border: "1px solid var(--border-warm)",
                    }}
                    onClick={() => { setOutput(h.output); setCopyType(h.type); setProductName(h.product); }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md" style={{ background: "rgba(245,158,11,0.15)", color: "var(--accent-gold)" }}>
                        {h.type}
                      </span>
                      <span className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                        {h.product}
                      </span>
                    </div>
                    <p className="text-xs line-clamp-2" style={{ color: "var(--text-muted)" }}>
                      {h.output.slice(0, 100)}...
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats Card */}
          <div className="glass-card p-5 text-center">
            <div className="text-3xl font-extrabold gradient-text">{history.length}</div>
            <div className="text-sm" style={{ color: "var(--text-muted)" }}>Copies Generated</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto mt-12 text-center text-sm" style={{ color: "var(--text-muted)" }}>
        <p>CopyForge — Forged with MiMo v2.5 Pro</p>
      </footer>
    </main>
  );
}
