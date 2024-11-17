package movie_booking_backend;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.*;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/getCities")
public class CityServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final String JDBC_URL = "jdbc:postgresql://localhost:5433/movieticketdb";
    private static final String JDBC_USER = "postgres";
    private static final String JDBC_PASSWORD = "vishal888";

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setContentType("application/json");

        String stateName = request.getParameter("state");
        if (stateName == null || stateName.isEmpty()) {
            stateName = "Tamil Nadu";
        }

        List<String> cities = new ArrayList<>();
        try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD)) {
            String query = "SELECT city_name FROM Cities WHERE state_name = ? ORDER BY city_name ASC";
            try (PreparedStatement stmt = conn.prepareStatement(query)) {
                stmt.setString(1, stateName);
                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        cities.add(rs.getString("city_name"));
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\":\"Database error occurred.\"}");
            return;
        }

        if (cities.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("{\"error\":\"No cities found for the given state.\"}");
            return;
        }

        String defaultCity = cities.get(0);
        StringBuilder jsonResponse = new StringBuilder("{");
        jsonResponse.append("\"default_state\":\"").append(stateName).append("\",");
        jsonResponse.append("\"default_city\":\"").append(defaultCity).append("\",");
        jsonResponse.append("\"cities\":[");
        for (int i = 0; i < cities.size(); i++) {
            jsonResponse.append("\"").append(cities.get(i)).append("\"");
            if (i < cities.size() - 1) {
                jsonResponse.append(",");
            }
        }
        jsonResponse.append("]}");

        response.getWriter().write(jsonResponse.toString());
    }
}