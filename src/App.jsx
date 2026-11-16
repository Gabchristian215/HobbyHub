import { Link, Route, Routes } from "react-router-dom";
import Header from "./components/Header/header.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import EditPost from "./pages/EditPost.jsx";
import Home from "./pages/Home.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import "./App.css";

function NotFound() {
  return (
    <section className="page page--narrow">
      <h1 className="page__title">Page not found</h1>
      <Link to="/">Back Home</Link>
    </section>
  );
}

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/post/:id/edit" element={<EditPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
