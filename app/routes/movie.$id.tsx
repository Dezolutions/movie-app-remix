import { LoaderArgs, json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useParams } from "@remix-run/react"
import { MovieDetails } from "~/types";

export async function loader({params}:LoaderArgs) {
  const data = await fetch(`https://api.themoviedb.org/3/movie/${params.id}?language=en-US`,{
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYzU0NjY5ZTYwMzNmMTJhZmE0MTRlMTc5NjIzOTUyZiIsInN1YiI6IjYwNTljN2QzMjJkZjJlMDAzYzc2MDFhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.DY3yj3G9e0vUTjX7QIXpabG6nmK8F9bMGQxxaj--J6Q'
    }
  })

  return json(await data.json());
}

export default function MovieId(): React.ReactElement {

  const movieDetails = useLoaderData<MovieDetails>();

  return (
    <div className="py-7">
      <img 
        src={`https://image.tmdb.org/t/p/original/${movieDetails.backdrop_path}`} 
        alt="" 
        className="h-[40vh] object-cover w-full rounded-lg"  
      />
      <h1 className="text-4xl font-bold text-center pt-5 underline">
        <Link to={movieDetails.homepage} target="_blank" className="hover:text-teal-500 transition duration-100">
          {movieDetails.title}
        </Link>
      </h1>
    
      <div className="flex flex-col md:flex-row gap-x-10 mt-10">
        <div className="w-full md:w-1/2 mb-8 md:mb-0 font-medium">
          <p className="text-3xl font-black uppercase">About</p>
          <p className="text-gray-600 text-xl mt-1 font-normal">
            {movieDetails.overview}
          </p>

          <div className="flex flex-col sm:flex-row md:flex-col justify-between mt-4">
            <p className="text-gray-600 text-base font-normal">
              <span className="text-gray-800 font-bold">Release Date:</span>
              &nbsp;{movieDetails.release_date}
            </p>
  
            <p className="text-gray-600 text-base font-normal">
              <span className="text-gray-800 font-bold">Original Language:</span> 
              &nbsp;<span className="uppercase">{movieDetails.original_language}</span>
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <Outlet/>
        </div>
      </div>
    </div>
  )
}