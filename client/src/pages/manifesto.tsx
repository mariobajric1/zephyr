import { FadeIn } from "@/components/animations/FadeIn";
import { ScaleIn } from "@/components/animations/ScaleIn";
import { Logo } from "@/components/ui/logo";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { Footer } from "@/components/ui/footer";
import { APP_NAME } from "@/lib/constants";

export function Manifesto() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="container mx-auto p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-2xl font-bold">{APP_NAME}</span>
          </div>
          <ThemeSwitcher />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-16">
          <FadeIn delay={0.2}>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-center mb-8">
              Your best friend on the internet, {APP_NAME}
            </h1>
            <h2 className="text-2xl sm:text-3xl text-center text-muted-foreground mb-16">
              The elite AI tool suite for everyone
            </h2>
          </FadeIn>

          <div className="space-y-12">
            <FadeIn delay={0.4}>
              <section className="space-y-4">
                <h3 className="text-2xl font-semibold">Our Vision</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {APP_NAME} represents the future of AI-powered creativity and productivity. 
                  We believe that advanced AI tools should be accessible to everyone, 
                  not just tech experts or large corporations. Our mission is to democratize 
                  AI technology through intuitive, powerful, and beautiful interfaces.
                </p>
              </section>
            </FadeIn>

            <FadeIn delay={0.6}>
              <section className="space-y-4">
                <h3 className="text-2xl font-semibold">The Future of {APP_NAME}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We're building a comprehensive suite of AI tools that will revolutionize 
                  how you interact with technology. From intelligent design assistance to 
                  advanced content creation, {APP_NAME} will be your companion in navigating 
                  the digital world. Our roadmap includes enhanced creative tools, 
                  collaborative features, and groundbreaking AI innovations that will set 
                  new standards in human-AI interaction.
                </p>
              </section>
            </FadeIn>

            <FadeIn delay={0.8}>
              <section className="space-y-4">
                <h3 className="text-2xl font-semibold">Join Our Journey</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {APP_NAME} is more than just a tool - it's a movement towards a future 
                  where AI enhances human creativity and productivity. We're committed to 
                  continuous innovation, ethical AI development, and building a community 
                  of forward-thinking creators and professionals who share our vision.
                </p>
              </section>
            </FadeIn>

            <FadeIn delay={1.0}>
              <section className="space-y-4">
                <h3 className="text-2xl font-semibold">Support the Vision</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  By supporting {APP_NAME}, you're not just backing a project - you're investing 
                  in the future of AI accessibility. Your support enables us to continue developing 
                  cutting-edge features, maintaining our infrastructure, and keeping our tools 
                  accessible to everyone. Together, we can build a more intelligent and 
                  inclusive digital future.
                </p>
              </section>
            </FadeIn>
          </div>

          <ScaleIn delay={1}>
            <div className="text-center">
              <div className="inline-block p-6 bg-primary/5 rounded-2xl">
                <Logo withLink={false} className="w-24 h-24 mx-auto" />
                <p className="mt-4 text-lg font-medium">
                  The future of AI is here, and it's for everyone.
                </p>
              </div>
            </div>
          </ScaleIn>
        </div>
      </main>

      <FadeIn direction="up" delay={1.2}>
        <Footer />
      </FadeIn>
    </div>
  );
}