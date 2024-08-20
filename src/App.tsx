import { ModeToggle } from "./components/ui/mode-toggle"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Home } from "./pages/home"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ModeToggle/>
      <div className="App">
        <Home />
      </div>
    </ThemeProvider>
  )
}

export default App
