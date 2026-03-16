import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const API_KEY = import.meta.env.VITE_OMDB_API_KEY

export default function Home() {
  const [search, setSearch] = useState("")
  const [movies, setMovies] = useState([])
  const [defaultMovies, setDefaultMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchDefaultMovies = async () => {
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?s=james+bond&type=movie&apikey=${API_KEY}`
        )
        const data = await response.json()
        if (data.Response === "True") {
          setDefaultMovies(data.Search)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchDefaultMovies()
  }, [])

  useEffect(() => {
    if (search.length < 3) {
      setMovies([])
      setError(null)
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?s=${search}&type=movie&apikey=${API_KEY}`
        )
        const data = await response.json()
        if (data.Response === "True") {
          setMovies(data.Search)
        } else {
          setMovies([])
          setError("Ingen filmer funnet.")
        }
      } catch (err) {
        setError("Noe gikk galt. Prøv igjen.")
      } finally {
        setLoading(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [search])

  const handleChange = (e) => {
    setSearch(e.target.value)
  }

  const handleMovieClick = (movie) => {
    const slug = encodeURIComponent(
      movie.Title.toLowerCase().replace(/\s+/g, "-")
    )
    navigate(`/${slug}`, { state: { imdbID: movie.imdbID } })
  }

  const visibleMovies = search.length >= 3 ? movies : defaultMovies
  const listTitle = search.length >= 3 ? `Resultater for "${search}"` : "James Bond-filmer"

  return (
    <main>
      <h1>Filmsøk</h1>

      <section>
        <label htmlFor="movie-search">Søk etter film</label>
        <input
          id="movie-search"
          type="search"
          placeholder="Skriv en filmtittel..."
          value={search}
          onChange={handleChange}
        />
        {search.length > 0 && search.length < 3 && (
          <p>Skriv {3 - search.length} tegn til for å søke...</p>
        )}
      </section>

      {loading && <p>Laster filmer...</p>}
      {error && <p>{error}</p>}

      <section>
        <h2>{listTitle}</h2>
        <ul>
          {visibleMovies.map((movie) => (
            <li key={movie.imdbID} onClick={() => handleMovieClick(movie)}>
              {movie.Poster !== "N/A" ? (
                <img
                  src={movie.Poster}
                  alt={`Filmplakat for ${movie.Title}`}
                  width={100}
                />
              ) : (
                <span>Ingen plakat</span>
              )}
              <h3>{movie.Title}</h3>
              <p>{movie.Year}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
