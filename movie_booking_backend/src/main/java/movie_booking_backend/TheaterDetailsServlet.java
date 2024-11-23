package movie_booking_backend;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.*;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/getTheaterDetails")
public class TheaterDetailsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final String JDBC_URL = "jdbc:postgresql://localhost:5433/movieticketdb";
    private static final String JDBC_USER = "postgres";
    private static final String JDBC_PASSWORD = "vishal888";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setContentType("application/json");

        String movieIdStr = request.getParameter("movieId");
        if (movieIdStr == null || movieIdStr.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\":\"Movie ID is required.\"}");
            return;
        }

        int movieId;
        try {
            movieId = Integer.parseInt(movieIdStr);
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\":\"Invalid Movie ID.\"}");
            return;
        }

        Map<Integer, TheaterDetails> theaterMap = new HashMap<>();
        try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD)) {
            String query = """
                    SELECT t.theater_id, t.theater_name, t.address, s.screen_id, s.screen_name, st.show_id, st.show_time
                    FROM Theaters t
                    JOIN Screens s ON t.theater_id = s.theater_id
                    JOIN ShowTimes st ON s.screen_id = st.screen_id
                    WHERE st.movie_id = ?
                    """;

            try (PreparedStatement stmt = conn.prepareStatement(query)) {
                stmt.setInt(1, movieId);
                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        int theaterId = rs.getInt("theater_id");
                        TheaterDetails theaterDetails = theaterMap.getOrDefault(theaterId, new TheaterDetails());
                        if (!theaterMap.containsKey(theaterId)) {
                            theaterDetails.setTheaterId(theaterId);
                            theaterDetails.setTheaterName(rs.getString("theater_name"));
                            theaterDetails.setAddress(rs.getString("address"));
                            theaterMap.put(theaterId, theaterDetails);
                        }

                        ScreenDetails screenDetails = new ScreenDetails();
                        screenDetails.setScreenId(rs.getInt("screen_id"));
                        screenDetails.setScreenName(rs.getString("screen_name"));
                        screenDetails.addShow(rs.getInt("show_id"), rs.getTime("show_time").toString());
                        theaterDetails.addScreen(screenDetails);
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\":\"Database error occurred.\"}");
            return;
        }

        if (theaterMap.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("{\"error\":\"No theaters found for the given movie.\"}");
            return;
        }

        StringBuilder jsonResponse = new StringBuilder("[");
        for (TheaterDetails theaterDetails : theaterMap.values()) {
            jsonResponse.append(theaterDetails.toJson()).append(",");
        }
        jsonResponse.setLength(jsonResponse.length() - 1); // Remove trailing comma
        jsonResponse.append("]");

        response.getWriter().write(jsonResponse.toString());
    }

    private static class TheaterDetails {
        private int theaterId;
        private String theaterName;
        private String address;
        private List<ScreenDetails> screens = new ArrayList<>();

        public int getTheaterId() {
            return theaterId;
        }

        public void setTheaterId(int theaterId) {
            this.theaterId = theaterId;
        }

        public String getTheaterName() {
            return theaterName;
        }

        public void setTheaterName(String theaterName) {
            this.theaterName = theaterName;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public void addScreen(ScreenDetails screen) {
            for (ScreenDetails existingScreen : screens) {
                if (existingScreen.getScreenId() == screen.getScreenId()) {
                    existingScreen.addShows(screen.getShows());
                    return;
                }
            }
            screens.add(screen);
        }

        public String toJson() {
            StringBuilder json = new StringBuilder("{")
                    .append("\"theater_id\":").append(theaterId).append(",")
                    .append("\"theater_name\":\"").append(theaterName).append("\",")
                    .append("\"address\":\"").append(address).append("\",")
                    .append("\"screens\":[");
            for (ScreenDetails screen : screens) {
                json.append(screen.toJson()).append(",");
            }
            json.setLength(json.length() - 1); // Remove trailing comma
            json.append("]}");
            return json.toString();
        }
    }

    private static class ScreenDetails {
        private int screenId;
        private String screenName;
        private List<ShowDetails> shows = new ArrayList<>();

        public int getScreenId() {
            return screenId;
        }

        public void setScreenId(int screenId) {
            this.screenId = screenId;
        }

        public String getScreenName() {
            return screenName;
        }

        public void setScreenName(String screenName) {
            this.screenName = screenName;
        }

        public List<ShowDetails> getShows() {
            return shows;
        }

        public void addShow(int showId, String showTime) {
            this.shows.add(new ShowDetails(showId, showTime));
        }

        public void addShows(List<ShowDetails> shows) {
            this.shows.addAll(shows);
        }

        public String toJson() {
            StringBuilder json = new StringBuilder("{")
                    .append("\"screen_id\":").append(screenId).append(",")
                    .append("\"screen_name\":\"").append(screenName).append("\",")
                    .append("\"shows\":[");
            for (ShowDetails show : shows) {
                json.append(show.toJson()).append(",");
            }
            json.setLength(json.length() - 1); // Remove trailing comma
            json.append("]}");
            return json.toString();
        }
    }

    private static class ShowDetails {
        private int showId;
        private String showTime;

        public ShowDetails(int showId, String showTime) {
            this.showId = showId;
            this.showTime = showTime;
        }

        public String toJson() {
            return new StringBuilder("{")
                    .append("\"show_id\":").append(showId).append(",")
                    .append("\"show_time\":\"").append(showTime).append("\"")
                    .append("}").toString();
        }
    }
}