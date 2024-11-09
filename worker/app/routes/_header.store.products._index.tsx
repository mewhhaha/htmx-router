import { htmx } from "../../../htmx-router/src/responses";
import * as t from "./+types._header.store.products._index";
type Product = {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  rating_rate: number;
  rating_count: number;
};

export const loader = async ({ request }: t.LoaderArgs) => {
  const searchParams = new URL(request.url).searchParams;
  const search = searchParams.get("q") || "";

  const products = await getCachedProducts(search);

  return { search, products };
};

export const action = async ({
  request,
  context: [env, ctx],
}: t.ActionArgs) => {
  const formData = await request.formData();
  const q = formData.get("q")?.toString() || "";
  const { products } = await getProducts(env.DB, q);

  const searchParams = new URLSearchParams();
  if (q) {
    searchParams.set("q", q);
  }
  const params = q ? `?${searchParams.toString()}` : "";

  const to = `/store/products${params}`;

  const headers = new Headers();
  headers.set("hx-push-url", to);
  headers.set("hx-reswap", "morph:outerHTML");
  headers.set("hx-retarget", "#products");

  ctx.waitUntil(cacheProducts(q, products));

  if (products.length === 0) {
    return htmx(
      <ProductList>
        <li id="no-products">No products found</li>
      </ProductList>,
      { headers },
    );
  }

  return htmx(
    <ProductList>
      {products.map((product) => (
        <li id={`product-${product.id}`}>
          <ShowCase {...product} />
        </li>
      ))}
    </ProductList>,
    { headers },
  );
};

export default function Store({
  loaderData: { search, products },
}: t.ComponentProps) {
  return (
    <main class="mx-auto w-full max-w-3xl bg-red-300 p-12">
      <title>Store</title>
      <div>
        <form action="/store/products" hx-indicator="#products" method="POST">
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
                name="q"
                type="text"
                placeholder="Carrots, potatoes, etc..."
                value={search}
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
        </form>
      </div>
      <hr class="mt-4 mb-2" />
      {products ? (
        <ProductList>
          {products.map((product) => {
            return (
              <li id={`product-${product.id}`}>
                <ShowCase {...product} />
              </li>
            );
          })}
        </ProductList>
      ) : (
        <LoadingPlaceholder search={search} />
      )}
    </main>
  );
}

type LoadingPlaceholderProps = {
  search: string;
};

// For quick navigation we load the products using the action by running this form immediately on load
// it will be replaced by the action response
const LoadingPlaceholder = ({ search }: LoadingPlaceholderProps) => {
  return (
    <ProductList>
      <li>
        <ShowcasePlaceholder />
      </li>
      <li>
        <ShowcasePlaceholder />
      </li>
      <li>
        <ShowcasePlaceholder />
      </li>
      <li>
        <ShowcasePlaceholder />
      </li>
      <form
        hx-trigger="load"
        hx-post="/store/products"
        hx-indicator="#products"
      >
        <input name="q" type="hidden" value={search} />
        Loading...
      </form>
    </ProductList>
  );
};

type ProductListProps = JSX.IntrinsicElements["ul"];

const ProductList = (props: ProductListProps) => {
  return (
    <ul
      id="products"
      class="grid grid-cols-2 gap-4 [.htmx-request]:opacity-50"
      {...props}
    />
  );
};

type ShowCaseProps = Product;

const ShowCase = ({ id, title, description, image }: ShowCaseProps) => {
  return (
    <article class="bg-pink-900">
      <h3 class="font-fancy truncate px-2 text-lg font-bold">{title}</h3>

      <figure>
        <a href={`/store/products/${id}`}>
          <img
            src={image}
            alt={title}
            class="aspect-video w-full bg-white object-cover object-top transition-transform hover:rotate-1 hover:border-4 hover:border-blue-500"
          />
        </a>
        <figcaption class="truncate text-sm">{description}</figcaption>
      </figure>
    </article>
  );
};

const ShowcasePlaceholder = () => {
  return (
    <article class="bg-pink-900">
      <h3 class="font-fancy truncate px-2 text-lg font-bold">_</h3>
      <figure>
        <div class="aspect-video w-full bg-white object-cover" />
        <figcaption class="truncate text-sm">_</figcaption>
      </figure>
    </article>
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

const cacheKeyProducts = (search: string) => {
  const url = new URL(`https://toes.life/store/products?q=${search}`);
  return new Request(url);
};

const cacheProducts = async (search: string, products: Product[]) => {
  const cacheKey = cacheKeyProducts(search);
  const response = new Response(JSON.stringify(products), {
    headers: { "cache-control": "max-age=3600" },
  });
  await caches.default.put(cacheKey, response);
};

const getCachedProducts = async (search: string) => {
  const cacheKey = cacheKeyProducts(search);
  const response = await caches.default.match(cacheKey);
  if (!response) return undefined;
  return await response.json<Product[]>();
};

const getProducts = async (db: D1Database, search: string) => {
  const items = await db
    .prepare(
      "SELECT * FROM items WHERE title LIKE ?1 OR description LIKE ?1 OR category LIKE ?1",
    )
    .bind(`%${search}%`)
    .all<Product>();

  return { products: items.results };
};
