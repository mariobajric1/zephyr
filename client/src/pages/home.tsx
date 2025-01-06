import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { AnimatedSphere } from "@/components/ui/sphere";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { Footer } from "@/components/ui/footer";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScaleIn } from "@/components/animations/ScaleIn";

export function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="container mx-auto p-6">
        <FadeIn direction="down" duration={0.6}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ScaleIn delay={0.3}>
                <Logo />
              </ScaleIn>
              <FadeIn direction="right" delay={0.4}>
                <span className="text-2xl font-bold">{APP_NAME}</span>
              </FadeIn>
            </div>
            <ScaleIn delay={0.5}>
              <ThemeSwitcher />
            </ScaleIn>
          </div>
        </FadeIn>
      </header>

      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="flex flex-col items-center text-center gap-8">
          <FadeIn delay={0.2}>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
              Welcome to {APP_NAME}
            </h1>
          </FadeIn>

          <FadeIn delay={0.4}>
            <p className="text-lg text-muted-foreground max-w-[600px]">
              {APP_DESCRIPTION}
            </p>
          </FadeIn>

          <FadeIn delay={0.6}>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/manifesto">About Zephyr</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/chat">Chat with Zephyr</Link>
              </Button>
              <Button asChild size="lg">
                <Link href="/search">Search with Zephyr</Link>
              </Button>
              <div className="relative">
                <Button disabled size="lg" className="opacity-60">
                  Build with Zephyr
                </Button>
                <div className="absolute -top-2 left-0 right-0 flex justify-center">
                  <span className="px-2 py-0.5 text-xs bg-background text-muted-foreground rounded-full shadow-sm">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>
          </FadeIn>

          <div className="mt-12">
            <ScaleIn delay={0.8}>
              <AnimatedSphere />
            </ScaleIn>
          </div>
        </div>
      </main>

      <FadeIn direction="up" delay={1}>
        <Footer />
      </FadeIn>
    </div>
  );
}