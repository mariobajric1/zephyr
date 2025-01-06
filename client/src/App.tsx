import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { Home } from "@/pages/home";
import { Chat } from "@/pages/chat";
import { Search } from "@/pages/search";
import { Manifesto } from "@/pages/manifesto";
import { WelcomeScreen } from "@/components/ui/welcome-screen";
import { AnimatePresence } from "framer-motion";

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Hide welcome screen after 2.5 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showWelcome && <WelcomeScreen />}
      </AnimatePresence>

      <Switch>
        <Route path="/" component={Home} />
        <Route path="/chat" component={Chat} />
        <Route path="/search" component={Search} />
        <Route path="/manifesto" component={Manifesto} />
        <Route>
          <Home />
        </Route>
      </Switch>
    </>
  );
}

export default App;