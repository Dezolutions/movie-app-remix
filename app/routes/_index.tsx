import { json, type LoaderArgs, type V2_MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Movie } from "~/types";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Movie App" },
    { name: "description", content: "Welcome to Movie App!" },
  ];
};

export async function loader({}:LoaderArgs) {
  const url = await fetch('https://api.themoviedb.org/3/trending/movie/day?language=en-US', {
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYzU0NjY5ZTYwMzNmMTJhZmE0MTRlMTc5NjIzOTUyZiIsInN1YiI6IjYwNTljN2QzMjJkZjJlMDAzYzc2MDFhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.DY3yj3G9e0vUTjX7QIXpabG6nmK8F9bMGQxxaj--J6Q'
    }
  });

  return json(await url.json());

}

export default function Index(): React.ReactElement {

  const {results} = useLoaderData();

  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="mb-10 md:mb-16">
          <h2 className="text-center mb-4 text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
            Top Trending Movies
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
          {results.map((movie:Movie) => {
            return (
              <Link to={`movie/${movie.id}/comments`} key={movie.id}>
                <div className="group flex flex-col overflow-hidden rounded-lg border bg-white">
                  <div className="relative block h-48 overflow-hidden md:h-64 bg-gray-100">
                    <img
                      className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-110 duration-200 " 
                      src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} 
                      alt="" 
                    />
                  </div>
  
                  <div className="p-4 sm:p-6 flex flex-1 flex-col">
                    <h2 className="group-hover:text-indigo-500 mb-2 text-center text-lg font-semibold text-gray-800">
                      {movie.title}
                    </h2>
                    <p className="text-gray-500 line-clamp-3">{movie.overview}</p>
                  </div>

                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  );
}
