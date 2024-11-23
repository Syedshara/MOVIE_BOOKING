package movie_booking_backend;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.*;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/getAllMovies")
public class GetAllMoviesServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final String JDBC_URL = "jdbc:postgresql://localhost:5433/movieticketdb";
    private static final String JDBC_USER = "postgres";
    private static final String JDBC_PASSWORD = "vishal888";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setContentType("application/json");

        List<MovieDetails> movies = new ArrayList<>();
        try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD)) {
            String query = """
                SELECT m.id, m.movie_name, m.poster_url, m.background_url, m.plot, m.genre, m.director, m.actors, m.language, m.country, m.release_date, m.duration, m.trailer_url, m.omdb_id,
                       CASE WHEN st.show_id IS NOT NULL THEN true ELSE false END AS is_screening
                FROM Movies m
                LEFT JOIN ShowTimes st ON m.id = st.movie_id AND st.show_date >= CURRENT_DATE
                GROUP BY m.id, st.show_id
            """;

            try (PreparedStatement stmt = conn.prepareStatement(query);
                 ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    MovieDetails movie = new MovieDetails();
                    movie.setId(rs.getInt("id"));
                    movie.setMovieName(rs.getString("movie_name"));
                    movie.setPosterUrl(rs.getString("poster_url"));
                    movie.setBackgroundUrl(rs.getString("background_url"));
                    movie.setPlot(rs.getString("plot"));
                    movie.setGenre(rs.getString("genre"));
                    movie.setDirector(rs.getString("director"));
                    movie.setActors(rs.getString("actors"));
                    movie.setLanguage(rs.getString("language"));
                    movie.setCountry(rs.getString("country"));
                    movie.setReleaseDate(rs.getTimestamp("release_date"));
                    movie.setDuration(rs.getInt("duration"));
                    movie.setTrailerUrl(rs.getString("trailer_url"));
                    movie.setOmdbId(rs.getString("omdb_id"));
                    movie.setScreening(rs.getBoolean("is_screening"));
                    movies.add(movie);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\":\"Database error occurred.\"}");
            return;
        }

        StringBuilder jsonResponse = new StringBuilder("[");
        for (MovieDetails movie : movies) {
            jsonResponse.append(movie.toJson()).append(",");
        }
        if (!movies.isEmpty()) {
            jsonResponse.setLength(jsonResponse.length() - 1); // Remove trailing comma
        }
        jsonResponse.append("]");

        response.getWriter().write(jsonResponse.toString());
    }

    private static class MovieDetails {
        private int id;
        private String movieName;
        private String posterUrl;
        private String backgroundUrl;
        private String plot;
        private String genre;
        private String director;
        private String actors;
        private String language;
        private String country;
        private Timestamp releaseDate;
        private int duration;
        private String trailerUrl;
        private String omdbId;
        private boolean isScreening;

        // Getters and setters

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getMovieName() {
            return movieName;
        }

        public void setMovieName(String movieName) {
            this.movieName = movieName;
        }

        public String getPosterUrl() {
            return posterUrl;
        }

        public void setPosterUrl(String posterUrl) {
            this.posterUrl = posterUrl;
        }

        public String getBackgroundUrl() {
            return backgroundUrl;
        }

        public void setBackgroundUrl(String backgroundUrl) {
            this.backgroundUrl = backgroundUrl;
        }

        public String getPlot() {
            return plot;
        }

        public void setPlot(String plot) {
            this.plot = plot;
        }

        public String getGenre() {
            return genre;
        }

        public void setGenre(String genre) {
            this.genre = genre;
        }

        public String getDirector() {
            return director;
        }

        public void setDirector(String director) {
            this.director = director;
        }

        public String getActors() {
            return actors;
        }

        public void setActors(String actors) {
            this.actors = actors;
        }

        public String getLanguage() {
            return language;
        }

        public void setLanguage(String language) {
            this.language = language;
        }

        public String getCountry() {
            return country;
        }

        public void setCountry(String country) {
            this.country = country;
        }

        public Timestamp getReleaseDate() {
            return releaseDate;
        }

        public void setReleaseDate(Timestamp releaseDate) {
            this.releaseDate = releaseDate;
        }

        public int getDuration() {
            return duration;
        }

        public void setDuration(int duration) {
            this.duration = duration;
        }

        public String getTrailerUrl() {
            return trailerUrl;
        }

        public void setTrailerUrl(String trailerUrl) {
            this.trailerUrl = trailerUrl;
        }

        public String getOmdbId() {
            return omdbId;
        }

        public void setOmdbId(String omdbId) {
            this.omdbId = omdbId;
        }

        public boolean isScreening() {
            return isScreening;
        }

        public void setScreening(boolean isScreening) {
            this.isScreening = isScreening;
        }

        public String toJson() {
            return new StringBuilder("{")
                    .append("\"id\":").append(id).append(",")
                    .append("\"movie_name\":\"").append(movieName).append("\",")
                    .append("\"poster_url\":\"").append(posterUrl).append("\",")
                    .append("\"background_url\":\"").append(backgroundUrl).append("\",")
                    .append("\"plot\":\"").append(plot).append("\",")
                    .append("\"genre\":\"").append(genre).append("\",")
                    .append("\"director\":\"").append(director).append("\",")
                    .append("\"actors\":\"").append(actors).append("\",")
                    .append("\"language\":\"").append(language).append("\",")
                    .append("\"country\":\"").append(country).append("\",")
                    .append("\"release_date\":\"").append(releaseDate).append("\",")
                    .append("\"duration\":").append(duration).append(",")
                    .append("\"trailer_url\":\"").append(trailerUrl).append("\",")
                    .append("\"omdb_id\":\"").append(omdbId).append("\",")
                    .append("\"is_screening\":").append(isScreening)
                    .append("}").toString();
        }
    }
}