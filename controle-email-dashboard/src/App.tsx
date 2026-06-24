import Home from "./features/pages/Home"
import {BrowserRouter,Router,Route} from "react-router-dom"

function App() {
  return (
    <BrowserRouter>
      {/* <Router basename=""> */}
        {/* <Route path="/" element={<Home />} /> */}
        <Home />
      {/* </Router> */}
    </BrowserRouter>
  )
}

export default App
