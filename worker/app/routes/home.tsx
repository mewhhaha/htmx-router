import { Link } from "../components/Link";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the home page!</p>
      <Link to="/profiles" hx-target={`[data-children="/"]`}>
        Profiles
      </Link>
    </div>
  );
}
