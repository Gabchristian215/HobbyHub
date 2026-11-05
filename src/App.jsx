import { Link, Route, Routes } from "react-router-dom";
import Header from "./components/Header/header.jsx";
import "./App.css";

function Home() {
  return (
    <>
      <h1>Explore your hobbies</h1>
      <p>Find inspiration and connect with people who share your interests.</p>
    </>
  );
}

function Create() {
  return (
    <>
      <h1>Create</h1>
      <p>Start a new hobby post.</p>
      <Link to="/">Back Home</Link>
    </>
  );
}

function Post() {
  return (
    <>
      <h1>Post</h1>
      <p>Share what you have been working on with the HobbyHub community.</p>
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
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/post" element={<Post />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
