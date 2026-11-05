import { Link, Route, Routes } from "react-router-dom";
import "./App.css";

function Home() {
  return (
    <>
      <h1>hello world</h1>
      <Link to="/about">Go to About</Link>
    </>
  );
}

function About() {
  return (
    <>
      <h1>About HobbyHub</h1>
      <Link to="/">Back Home</Link>
    </>
  );
}

function NotFound() {
  return (
    <>
      <h1>Page not found</h1>
      <Link to="/">Back Home</Link>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
