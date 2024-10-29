import { Link } from "../components/Link";

export default function Route({ children }: { children?: string }) {
  return (
    <div>
      <h1>profiles</h1>
      <ul>
        <li>
          <Link to="/profiles/a">profile a</Link>
        </li>
        <li>
          <Link to="/profiles/b">profile b</Link>
        </li>
        <li>
          <Link to="/profiles/c">profile c</Link>
        </li>
        <li>
          <Link to="/home">home</Link>
        </li>
      </ul>
      <section>{children}</section>
    </div>
  );
}
