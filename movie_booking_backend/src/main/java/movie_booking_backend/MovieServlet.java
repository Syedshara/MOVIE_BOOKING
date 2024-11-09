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
    private static final String JDBC_URL = "jdbc:postgresql://localhost:5433/moviebookingdb";
    private static final String JDBC_USER = "postgres";
    private static final String JDBC_PASSWORD = "vishal888";

    @Override
    public void init() throws ServletException {
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            throw new ServletException("PostgreSQL Driver not found", e);
        }
    }

    // Method to get the current or upcoming movies based on the selected city
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setContentType("application/json");

        // Get the city name from the query parameter (defaults to Chennai)
        String cityName = request.getParameter("city");
        if (cityName == null || cityName.isEmpty()) {
            cityName = "Chennai"; // Default city
        }

        List<Movie> movies = new ArrayList<>();
        try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD)) {
            // Query to get the theaters in the selected city
            String cityQuery = "SELECT t.theater_id FROM Theaters t "
                                + "JOIN Cities c ON t.city_id = c.city_id "
                                + "WHERE c.city_name = ?";
            try (PreparedStatement cityStmt = conn.prepareStatement(cityQuery)) {
                cityStmt.setString(1, cityName);
                try (ResultSet cityRs = cityStmt.executeQuery()) {
                    List<Integer> theaterIds = new ArrayList<>();
                    while (cityRs.next()) {
                        theaterIds.add(cityRs.getInt("theater_id"));
                    }

                    // If no theaters found for the city
                    if (theaterIds.isEmpty()) {
                        response.getWriter().write("{\"status\":\"error\",\"message\":\"No theaters found in the selected city\"}");
                        return;
                    }

                    // Query to get the unique movies currently running or upcoming in those theaters
                    String movieQuery = "SELECT DISTINCT m.movie_id, m.movie_name, m.poster_url, m.background_url, "
                            + "m.about_movie, m.release_date, m.duration "
                            + "FROM Movies m "
                            + "JOIN ShowTimes st ON m.movie_id = st.movie_id "
                            + "JOIN Screens s ON st.screen_id = s.screen_id "
                            + "JOIN Theaters t ON s.theater_id = t.theater_id "
                            + "WHERE t.theater_id IN (" + String.join(",", theaterIds.stream().map(String::valueOf).toArray(String[]::new)) + ") "
                            + "AND st.show_date >= CURRENT_DATE "
                            + "ORDER BY m.movie_name ASC";  // Ordering by movie name for better presentation

                    try (PreparedStatement movieStmt = conn.prepareStatement(movieQuery)) {
                        try (ResultSet movieRs = movieStmt.executeQuery()) {
                            while (movieRs.next()) {
                                Movie movie = new Movie();
                                movie.setMovieId(movieRs.getInt("movie_id"));
                                movie.setMovieName(movieRs.getString("movie_name"));
                                movie.setPosterUrl(movieRs.getString("poster_url"));
                                movie.setBackgroundUrl(movieRs.getString("background_url"));
                                movie.setAboutMovie(movieRs.getString("about_movie"));
                                movie.setReleaseDate(movieRs.getDate("release_date"));
                                movie.setDuration(movieRs.getInt("duration"));
                                movies.add(movie);
                            }
                        }
                    }
                }
            }

            // Convert the list of movies to JSON and send as response
            StringBuilder jsonResponse = new StringBuilder("[");

            for (int i = 0; i < movies.size(); i++) {
                Movie movie = movies.get(i);
                jsonResponse.append("{")
                        .append("\"movie_id\":").append(movie.getMovieId()).append(",")
                        .append("\"movie_name\":\"").append(movie.getMovieName()).append("\",")
                        .append("\"poster_url\":\"").append(movie.getPosterUrl()).append("\",")
                        .append("\"background_url\":\"").append(movie.getBackgroundUrl()).append("\",")
                        .append("\"about_movie\":\"").append(movie.getAboutMovie()).append("\",")
                        .append("\"release_date\":\"").append(movie.getReleaseDate()).append("\",")
                        .append("\"duration\":").append(movie.getDuration())
                        .append("}");

                if (i < movies.size() - 1) {
                    jsonResponse.append(",");
                }
            }
            jsonResponse.append("]");

            response.getWriter().write(jsonResponse.toString());

        } catch (SQLException e) {
            e.printStackTrace();
            response.getWriter().write("{\"status\":\"error\",\"message\":\"Error retrieving movie data: " + e.getMessage() + "\"}");
        }
    }

    // Movie class to represent movie data
    public static class Movie {
        private int movieId;
        private String movieName;
        private String posterUrl;
        private String backgroundUrl;
        private String aboutMovie;
        private Date releaseDate;
        private int duration;

        // Getters and Setters
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

        public String getAboutMovie() {
            return aboutMovie;
        }

        public void setAboutMovie(String aboutMovie) {
            this.aboutMovie = aboutMovie;
        }

        public Date getReleaseDate() {
            return releaseDate;
        }

        public void setReleaseDate(Date releaseDate) {
            this.releaseDate = releaseDate;
        }

        public int getDuration() {
            return duration;
        }

        public void setDuration(int duration) {
            this.duration = duration;
        }
    }
}
