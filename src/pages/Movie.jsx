import { useState, useEffect } from "react"
import { useParams, useLocation, Link } from "react-router-dom"

const API_KEY = import.meta.env.VITE_OMDB_API_KEY

export default function Movie() {
  const { movie: slug } = useParams()
  const location = useLocation()

  const [film, setFilm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true)
      setError(null)
      try {
        let data

        if (location.state?.imdbID) {
          const response = await fetch(
            `https://www.omdbapi.com/?i=${location.state.imdbID}&plot=full&apikey=${API_KEY}`
          )
          data = await response.json()
        } else {
          const title = decodeURIComponent(slug).replace(/-/g, " ")
          const response = await fetch(
            `https://www.omdbapi.com/?t=${title}&plot=full&apikey=${API_KEY}`
          )
          data = await response.json()
        }

        if (data.Response === "True") {
          setFilm(data)
        } else {
          setError("Film ikke funnet.")
        }
      } catch (err) {
        setError("Noe gikk galt.")
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()
  }, [slug, location.state])

  if (loading) return <main><p>Laster...</p></main>
  if (error) return (
    <main>
      <p>{error}</p>
      <Link to="/">← Tilbake</Link>
    </main>
  )

  return (
    <main>
      <nav>
        <Link to="/">← Tilbake til forsiden</Link>
      </nav>

      <article>
        <h1>{film.Title}</h1>

        {film.Poster !== "N/A" && (
          <figure>
            <img src={film.Poster} alt={`Filmplakat for ${film.Title}`} />
          </figure>
        )}

        <section>
          <p><strong>År:</strong> {film.Year}</p>
          <p><strong>Sjanger:</strong> {film.Genre}</p>
          <p><strong>Regi:</strong> {film.Director}</p>
          <p><strong>Skuespillere:</strong> {film.Actors}</p>
          <p><strong>Varighet:</strong> {film.Runtime}</p>
          {film.imdbRating !== "N/A" && (
            <p><strong>IMDb-vurdering:</strong> {film.imdbRating}/10</p>
          )}
        </section>

        {film.Plot !== "N/A" && (
          <section>
            <h2>Handling</h2>
            <p>{film.Plot}</p>
          </section>
        )}
      </article>
    </main>
  )
}
