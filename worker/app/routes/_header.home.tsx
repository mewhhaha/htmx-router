import { Link } from "../components/Link";

export default function Home() {
  return (
    <div>
      <header>
        <h1>Home</h1>
        <nav>
          <Link to="/blog">Blog</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <main></main>
    </div>
  );
}
