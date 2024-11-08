import * as t from "./+types._header.store";
type Product = {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  rating_rate: number;
  rating_count: number;
};

export const loader = async ({ request, context: [env] }: t.LoaderArgs) => {
  const searchParams = new URL(request.url).searchParams;
  const search = searchParams.get("q") || "";

  const items = await env.DB.prepare(
    "SELECT * FROM items WHERE title LIKE ?1 OR description LIKE ?1 OR category LIKE ?1",
  )
    .bind(`%${search}%`)
    .all<Product>();
  return { search, products: items.results };
};

export default function Store({
  loaderData: { search, products },
}: t.ComponentProps) {
  return (
    <main class="mx-auto w-full max-w-3xl bg-red-300 p-12">
      <title>Store</title>
      <div>
        <form action="/store" method="GET">
          <SearchBar value={search} name="q" />
        </form>
      </div>
      <hr class="mt-4 mb-2" />
      <ul class="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <li>
            <ShowCase {...product} />
          </li>
        ))}
      </ul>
    </main>
  );
}

type ShowCaseProps = Product;

const ShowCase = ({ title, description, category, image }: ShowCaseProps) => {
  return (
    <article class="bg-pink-900">
      <h3 class="font-fancy truncate px-2 text-lg font-bold">{title}</h3>
      <figure>
        <img
          src={image}
          alt={title}
          class="aspect-video w-full bg-white object-cover"
        />
        <figcaption class="truncate text-sm">{description}</figcaption>
      </figure>
      <a href={`/store?q=${category}`} class="truncate text-sm">
        {category}
      </a>
    </article>
  );
};

type SearchBarProps = {
  value: string;
  name: string;
};

const SearchBar = ({ value, name }: SearchBarProps) => {
  return (
    <div>
      <label
        for="search"
        class="font-fancy block w-min bg-white px-2 text-sm font-bold whitespace-nowrap text-black underline"
      >
        Search for items
      </label>
      <div class="group relative isolate flex w-96 bg-white text-black">
        <input
          id="search"
          name={name}
          type="text"
          placeholder="Carrots, potatoes, etc..."
          value={value}
          class="peer min-w-0 grow border-none bg-white px-4 py-2 text-black outline-blue-500 group-focus-within:outline-dashed focus:outline-solid"
        />
        <button
          class={`
              absolute top-1 right-1 z-10 size-8 cursor-pointer rounded-full border-4 border-pink-300
              bg-white/70 shadow-xl
              hover:bg-gray-200/70 focus:bg-white focus:outline-blue-500
              `}
        >
          <span class="sr-only">Search</span>
          <SearchIcon class="m-auto size-6" />
        </button>
      </div>
    </div>
  );
};

type SearchIconProps = JSX.IntrinsicElements["svg"];

const SearchIcon = (props: SearchIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      {...props}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  );
};
