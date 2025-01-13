import "./App.css"
import Footer from "./components/Footer/Footer"
import Homepage from "./components/Homepage/Homepage"
import Navigation from "./components/Navigation/Navigation"

function App() {
    return (
        <div
            className="websiteContainer"
            style={{
                overflow: scroll ? "auto" : "hidden",
            }}
        >
            <Navigation />
            <Homepage />
            <Footer />
        </div>
    )
}

export default App
