import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import ThemeToggle from '@/components/ui/ThemeToggle';
import StockTicker from '@/components/public/StockTicker';
import { ArrowRight, Check, Code, Palette, Type } from 'lucide-react';
import {
  CandlestickChart,
  TrendArrow,
  LightBulb,
  GraphBars,
  PieChart,
  Calculator,
  Briefcase,
  Target,
  Rocket,
  Documents,
} from '@/components/public/doodles';

/**
 * Design System Test Page
 * Showcases all colors, typography, components, and animations
 */
export default function DesignTestPage() {
  return (
    <div className="min-h-screen">
      {/* Header with Theme Toggle */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <Container>
          <div className="flex items-center justify-between py-4">
            <h1 className="font-display text-2xl font-semibold">
              Design System
            </h1>
            <ThemeToggle />
          </div>
        </Container>
      </div>

      {/* Stock Ticker Demo */}
      <div className="mt-6">
        <StockTicker
          items={[
            'AAPL +2.3%',
            'TSLA -1.2%',
            'ADITYA +∞%',
            'GOOGL +1.8%',
            'MSFT +0.9%',
            'NFLX -0.5%',
            'META +3.1%',
            'NVDA +4.7%',
          ]}
          speed={25}
        />
      </div>

      {/* Color Palette */}
      <Section>
        <Container>
          <div className="flex items-center gap-3 mb-8">
            <Palette className="w-6 h-6 text-primary" />
            <h2 className="font-display text-3xl font-semibold">
              Color Palette
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Primary Colors */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Primary Colors</h3>
              <div className="space-y-3">
                <ColorSwatch
                  name="Background"
                  variable="--background"
                  className="bg-background border border-border"
                />
                <ColorSwatch
                  name="Foreground"
                  variable="--foreground"
                  className="bg-foreground text-background"
                />
                <ColorSwatch
                  name="Card"
                  variable="--card"
                  className="bg-card border border-border"
                />
                <ColorSwatch
                  name="Muted"
                  variable="--muted"
                  className="bg-muted"
                />
              </div>
            </div>

            {/* Accent Colors */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Accent Colors</h3>
              <div className="space-y-3">
                <ColorSwatch
                  name="Primary"
                  variable="--primary"
                  className="bg-primary text-white"
                />
                <ColorSwatch
                  name="Primary Hover"
                  variable="--primary/90"
                  className="bg-primary/90 text-white"
                />
                <ColorSwatch
                  name="Secondary"
                  variable="--secondary"
                  className="bg-secondary text-white"
                />
                <ColorSwatch
                  name="Destructive"
                  variable="--destructive"
                  className="bg-destructive text-white"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Typography */}
      <Section className="bg-muted/30">
        <Container>
          <div className="flex items-center gap-3 mb-8">
            <Type className="w-6 h-6 text-primary" />
            <h2 className="font-display text-3xl font-semibold">Typography</h2>
          </div>

          <div className="space-y-8">
            {/* Headings */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Display Font - Fraunces
              </h3>
              <div className="space-y-4">
                <h1 className="font-display text-6xl font-semibold">
                  Heading 1 - 6xl
                </h1>
                <h2 className="font-display text-5xl font-semibold">
                  Heading 2 - 5xl
                </h2>
                <h3 className="font-display text-4xl font-semibold">
                  Heading 3 - 4xl
                </h3>
                <h4 className="font-display text-3xl font-semibold">
                  Heading 4 - 3xl
                </h4>
              </div>
            </div>

            {/* Body Text */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Body Font - Inter</h3>
              <div className="space-y-4 max-w-3xl">
                <p className="text-xl">
                  Large body text (xl) - The quick brown fox jumps over the lazy
                  dog. This is how paragraphs will look in hero sections.
                </p>
                <p className="text-base">
                  Regular body text (base) - This is the standard paragraph text
                  used throughout the portfolio. It provides excellent
                  readability and works well for longer content sections.
                </p>
                <p className="text-sm text-muted-foreground">
                  Small text (sm) - Used for captions, metadata, and supporting
                  information.
                </p>
              </div>
            </div>

            {/* Monospace */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Mono Font - JetBrains Mono
              </h3>
              <code className="font-mono text-base bg-card px-3 py-2 rounded border border-border block w-fit">
                const designSystem = "complete";
              </code>
            </div>
          </div>
        </Container>
      </Section>

      {/* Buttons & Interactive Elements */}
      <Section>
        <Container>
          <div className="flex items-center gap-3 mb-8">
            <Code className="w-6 h-6 text-primary" />
            <h2 className="font-display text-3xl font-semibold">
              Interactive Elements
            </h2>
          </div>

          <div className="space-y-8">
            {/* Buttons */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2">
                  Primary Button
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium">
                  Secondary Button
                </button>
                <button className="px-6 py-3 border-2 border-border bg-transparent rounded-lg hover:bg-muted transition-colors font-medium">
                  Outline Button
                </button>
                <button className="px-6 py-3 text-primary hover:bg-primary/10 rounded-lg transition-colors font-medium">
                  Ghost Button
                </button>
              </div>
            </div>

            {/* Cards */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Cards</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow">
                  <Check className="w-8 h-8 text-primary mb-3" />
                  <h4 className="font-display text-xl font-semibold mb-2">
                    Card Title
                  </h4>
                  <p className="text-muted-foreground">
                    This is a standard card component with hover effects and
                    proper spacing.
                  </p>
                </div>
                <div className="p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow">
                  <Check className="w-8 h-8 text-secondary mb-3" />
                  <h4 className="font-display text-xl font-semibold mb-2">
                    Card Title
                  </h4>
                  <p className="text-muted-foreground">
                    Cards can use different accent colors for variety and
                    hierarchy.
                  </p>
                </div>
                <div className="p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow">
                  <Check className="w-8 h-8 text-primary mb-3" />
                  <h4 className="font-display text-xl font-semibold mb-2">
                    Card Title
                  </h4>
                  <p className="text-muted-foreground">
                    The hover effect adds depth and makes cards feel
                    interactive.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Elements */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Form Elements</h3>
              <div className="max-w-md space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Input Field
                  </label>
                  <input
                    type="text"
                    placeholder="Enter text..."
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Textarea
                  </label>
                  <textarea
                    placeholder="Enter longer text..."
                    rows={4}
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Animations */}
      <Section className="bg-muted/30">
        <Container>
          <h2 className="font-display text-3xl font-semibold mb-8">
            Animations
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-4 animate-[fade-in_0.5s_ease-out]" />
              <p className="font-medium">Fade In</p>
              <code className="text-sm text-muted-foreground">fade-in</code>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary rounded-full mx-auto mb-4 animate-[fade-in-up_0.6s_ease-out]" />
              <p className="font-medium">Fade In Up</p>
              <code className="text-sm text-muted-foreground">fade-in-up</code>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-4 animate-[float_6s_ease-in-out_infinite]" />
              <p className="font-medium">Float</p>
              <code className="text-sm text-muted-foreground">float</code>
            </div>
          </div>
        </Container>
      </Section>

      {/* Doodles */}
      <Section className="bg-muted/30">
        <Container>
          <h2 className="font-display text-3xl font-semibold mb-8">
            Hand-Drawn Doodles
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="flex flex-col items-center gap-3">
              <CandlestickChart className="w-20 h-20 text-primary" />
              <p className="text-sm text-muted-foreground">Candlestick</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <TrendArrow className="w-20 h-20 text-primary" />
              <p className="text-sm text-muted-foreground">Trend Arrow</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <LightBulb className="w-20 h-20 text-secondary" />
              <p className="text-sm text-muted-foreground">Light Bulb</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <GraphBars className="w-20 h-20 text-primary" />
              <p className="text-sm text-muted-foreground">Bar Chart</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <PieChart className="w-20 h-20 text-secondary" />
              <p className="text-sm text-muted-foreground">Pie Chart</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Calculator className="w-20 h-20 text-primary" />
              <p className="text-sm text-muted-foreground">Calculator</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Briefcase className="w-20 h-20 text-secondary" />
              <p className="text-sm text-muted-foreground">Briefcase</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Target className="w-20 h-20 text-primary" />
              <p className="text-sm text-muted-foreground">Target</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Rocket className="w-20 h-20 text-secondary" />
              <p className="text-sm text-muted-foreground">Rocket</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Documents className="w-20 h-20 text-primary" />
              <p className="text-sm text-muted-foreground">Documents</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Spacing & Layout */}
      <Section>
        <Container>
          <h2 className="font-display text-3xl font-semibold mb-8">
            Container Variants
          </h2>

          <div className="space-y-8">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-8">
              <Container variant="narrow">
                <p className="text-center">
                  <span className="font-semibold">Narrow Container</span> -
                  max-w-4xl (896px) - Ideal for blog posts and long-form
                  content
                </p>
              </Container>
            </div>

            <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-8">
              <Container variant="default">
                <p className="text-center">
                  <span className="font-semibold">Default Container</span> -
                  max-w-7xl (1280px) - Standard width for most content
                </p>
              </Container>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-8">
              <Container variant="wide">
                <p className="text-center">
                  <span className="font-semibold">Wide Container</span> -
                  max-w-screen-2xl (1536px) - For wide layouts and galleries
                </p>
              </Container>
            </div>
          </div>
        </Container>
      </Section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <Container>
          <p className="text-center text-muted-foreground">
            Design System Test Page - Aditya Jagtap Portfolio
          </p>
        </Container>
      </footer>
    </div>
  );
}

// Helper component for color swatches
function ColorSwatch({
  name,
  variable,
  className,
}: {
  name: string;
  variable: string;
  className: string;
}) {
  return (
    <div className={`${className} p-4 rounded-lg`}>
      <p className="font-semibold">{name}</p>
      <code className="text-sm opacity-80">{variable}</code>
    </div>
  );
}
