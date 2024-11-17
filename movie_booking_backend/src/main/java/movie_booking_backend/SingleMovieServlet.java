package movie_booking_backend;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.*;
import java.sql.*;

@WebServlet("/getMovie/*")
public class SingleMovieServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final String JDBC_URL = "jdbc:postgresql://localhost:5433/movieticketdb";
    private static final String JDBC_USER = "postgres";
    private static final String JDBC_PASSWORD = "vishal888";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setContentType("application/json");

        String pathInfo = request.getPathInfo();
        if (pathInfo == null || pathInfo.length() <= 1) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\":\"Movie ID is required.\"}");
            return;
        }

        String movieIdStr = pathInfo.substring(1); // Extract ID from /getMovie/{id}
        int movieId;

        try {
            movieId = Integer.parseInt(movieIdStr);
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\":\"Invalid Movie ID.\"}");
            return;
        }

        try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD)) {
            String query = """
                    SELECT id, movie_name, poster_url, background_url, plot, genre, director,
                           actors, language, country, release_date, duration, trailer_url
                    FROM Movies
                    WHERE id = ?
                    """;

            try (PreparedStatement stmt = conn.prepareStatement(query)) {
                stmt.setInt(1, movieId);
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        String jsonResponse = String.format("""
                                {
                                    "movie_id": %d,
                                    "movie_name": "%s",
                                    "poster_url": "%s",
                                    "background_url": "%s",
                                    "plot": "%s",
                                    "genre": "%s",
                                    "director": "%s",
                                    "actors": "%s",
                                    "language": "%s",
                                    "country": "%s",
                                    "release_date": "%s",
                                    "duration": %d,
                                    "trailer_url": "%s"
                                }
                                """,
                                rs.getInt("id"),
                                rs.getString("movie_name"),
                                rs.getString("poster_url"),
                                rs.getString("background_url"),
                                rs.getString("plot"),
                                rs.getString("genre"),
                                rs.getString("director"),
                                rs.getString("actors"),
                                rs.getString("language"),
                                rs.getString("country"),
                                rs.getTimestamp("release_date").toString(),
                                rs.getInt("duration"),
                                rs.getString("trailer_url"));

                        response.getWriter().write(jsonResponse);
                    } else {
                        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                        response.getWriter().write("{\"error\":\"Movie not found.\"}");
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\":\"Database error occurred.\"}");
        }
    }
}
