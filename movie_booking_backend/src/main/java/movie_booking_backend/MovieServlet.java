package movie_booking_backend;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.*;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/getMovies")
public class MovieServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final String JDBC_URL = "jdbc:postgresql://localhost:5433/movieticketdb";
    private static final String JDBC_USER = "postgres";
    private static final String JDBC_PASSWORD = "vishal888";

    // vishal
    @Override
    public void init() throws ServletException {
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            throw new ServletException("PostgreSQL Driver not found", e);
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setContentType("application/json");

        String cityName = request.getParameter("city");
        if (cityName == null || cityName.isEmpty()) {
            cityName = "Chennai";
        }

        List<Movie> movies = new ArrayList<>();
        try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD)) {
            String movieQuery = """
                    SELECT DISTINCT
                        m.id AS movie_id,
                        m.movie_name,
                        m.poster_url,
                        m.background_url,
                        m.plot,
                        m.genre,
                        m.director,
                        m.actors,
                        m.language,
                        m.country,
                        m.release_date,
                        m.duration,
                        m.trailer_url
                    FROM Movies m
                    JOIN ShowTimes st ON m.id = st.movie_id
                    JOIN Screens s ON st.screen_id = s.screen_id
                    JOIN Theaters t ON s.theater_id = t.theater_id
                    JOIN Cities c ON t.city_id = c.city_id
                    WHERE c.city_name = ?
                    AND st.show_date >= CURRENT_DATE
                    ORDER BY m.movie_name ASC
                    """;

            try (PreparedStatement movieStmt = conn.prepareStatement(movieQuery)) {
                movieStmt.setString(1, cityName);
                try (ResultSet rs = movieStmt.executeQuery()) {
                    while (rs.next()) {
                        Movie movie = new Movie();
                        movie.setMovieId(rs.getInt("movie_id"));
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
                        movies.add(movie);
                    }
                }
            }

            StringBuilder jsonResponse = new StringBuilder("[");
            for (int i = 0; i < movies.size(); i++) {
                Movie movie = movies.get(i);
                jsonResponse.append("{")
                        .append("\"movie_id\":").append(movie.getMovieId()).append(",")
                        .append("\"movie_name\":\"").append(movie.getMovieName()).append("\",")
                        .append("\"poster_url\":\"").append(movie.getPosterUrl()).append("\",")
                        .append("\"background_url\":\"").append(movie.getBackgroundUrl()).append("\",")
                        .append("\"plot\":\"").append(movie.getPlot()).append("\",")
                        .append("\"genre\":\"").append(movie.getGenre()).append("\",")
                        .append("\"director\":\"").append(movie.getDirector()).append("\",")
                        .append("\"actors\":\"").append(movie.getActors()).append("\",")
                        .append("\"language\":\"").append(movie.getLanguage()).append("\",")
                        .append("\"country\":\"").append(movie.getCountry()).append("\",")
                        .append("\"release_date\":\"").append(movie.getReleaseDate()).append("\",")
                        .append("\"duration\":").append(movie.getDuration()).append(",")
                        .append("\"trailer_url\":\"").append(movie.getTrailerUrl()).append("\"")
                        .append("}");
                if (i < movies.size() - 1) {
                    jsonResponse.append(",");
                }
            }
            jsonResponse.append("]");

            response.getWriter().write(jsonResponse.toString());

        } catch (SQLException e) {
            e.printStackTrace();
            response.getWriter().write(
                    "{\"status\":\"error\",\"message\":\"Error retrieving movie data: " + e.getMessage() + "\"}");
        }
    }

    public static class Movie {
        private int movieId;
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

        public int getMovieId() {
            return movieId;
        }

        public void setMovieId(int movieId) {
            this.movieId = movieId;
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
    }
}