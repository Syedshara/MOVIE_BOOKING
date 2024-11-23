package movie_booking_backend;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.*;
import java.sql.*;
import org.json.JSONArray;
import org.json.JSONObject;

@WebServlet("/bookSeats")
public class BookSeatsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final String JDBC_URL = "jdbc:postgresql://localhost:5433/movieticketdb";
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

    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
        response.setHeader("Access-Control-Max-Age", "3600");
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        response.setContentType("application/json");

        StringBuilder jsonInput = new StringBuilder();
        String line;
        try (BufferedReader reader = request.getReader()) {
            while ((line = reader.readLine()) != null) {
                jsonInput.append(line);
            }
        }

        JSONObject jsonRequest = new JSONObject(jsonInput.toString());
        String email = jsonRequest.getString("email");
        int showId = jsonRequest.getInt("showId");
        JSONArray selectedSeats = jsonRequest.getJSONArray("selectedSeats");
        double totalAmount = jsonRequest.getDouble("totalAmount");

        try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD)) {
            conn.setAutoCommit(false);

            // Fetch user ID using email
            String userIdSQL = "SELECT user_id FROM Users WHERE email = ?";
            int userId;
            try (PreparedStatement userIdStmt = conn.prepareStatement(userIdSQL)) {
                userIdStmt.setString(1, email);
                ResultSet rs = userIdStmt.executeQuery();
                if (rs.next()) {
                    userId = rs.getInt("user_id");
                } else {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"error\":\"User not found\"}");
                    return;
                }
            }

            // Fetch show details
            String showDetailsSQL = """
                SELECT st.show_date, st.show_time, sc.theater_id, sc.screen_id
                FROM ShowTimes st
                JOIN Screens sc ON st.screen_id = sc.screen_id
                WHERE st.show_id = ?
            """;
            String showDate = null;
            String showTime = null;
            int theaterId = 0;
            int screenId = 0;
            try (PreparedStatement showDetailsStmt = conn.prepareStatement(showDetailsSQL)) {
                showDetailsStmt.setInt(1, showId);
                ResultSet rs = showDetailsStmt.executeQuery();
                if (rs.next()) {
                    showDate = rs.getDate("show_date").toString();
                    showTime = rs.getTime("show_time").toString();
                    theaterId = rs.getInt("theater_id");
                    screenId = rs.getInt("screen_id");
                }
            }

            // Insert ticket
            String insertTicketSQL = """
                INSERT INTO Tickets (user_id, show_id, seat_count, total_amount, status, payment_status, show_date, show_time)
                VALUES (?, ?, ?, ?, 'upcoming', 'paid', ?, ?) RETURNING ticket_id
            """;
            int ticketId;
            try (PreparedStatement insertTicketStmt = conn.prepareStatement(insertTicketSQL)) {
                insertTicketStmt.setInt(1, userId);
                insertTicketStmt.setInt(2, showId);
                insertTicketStmt.setInt(3, selectedSeats.length());
                insertTicketStmt.setDouble(4, totalAmount);
                insertTicketStmt.setDate(5, Date.valueOf(showDate));
                insertTicketStmt.setTime(6, Time.valueOf(showTime));
                ResultSet rs = insertTicketStmt.executeQuery();
                if (rs.next()) {
                    ticketId = rs.getInt("ticket_id");
                } else {
                    conn.rollback();
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    response.getWriter().write("{\"error\":\"Failed to create ticket\"}");
                    return;
                }
            }

            // Insert booked seats
            String insertBookedSeatSQL = """
                INSERT INTO BookedSeats (ticket_id, seat_id, theater_id, screen_id, show_id, tier)
                VALUES (?, ?, ?, ?, ?, ?::seat_tier)
            """;
            try (PreparedStatement insertBookedSeatStmt = conn.prepareStatement(insertBookedSeatSQL)) {
                for (int i = 0; i < selectedSeats.length(); i++) {
                    JSONObject seat = selectedSeats.getJSONObject(i);
                    int seatId = seat.getInt("seatId");
                    String tier = seat.getString("tier");

                    insertBookedSeatStmt.setInt(1, ticketId);
                    insertBookedSeatStmt.setInt(2, seatId);
                    insertBookedSeatStmt.setInt(3, theaterId);
                    insertBookedSeatStmt.setInt(4, screenId);
                    insertBookedSeatStmt.setInt(5, showId);
                    insertBookedSeatStmt.setString(6, tier);
                    insertBookedSeatStmt.addBatch();
                }
                insertBookedSeatStmt.executeBatch();
            }

            conn.commit();

            // Prepare ticket details for response
            StringBuilder tickets = new StringBuilder();
            for (int i = 0; i < selectedSeats.length(); i++) {
                JSONObject seat = selectedSeats.getJSONObject(i);
                tickets.append(seat.getString("seat_label")).append(":").append(seat.getString("tier")).append(", ");
            }
            if (tickets.length() > 0) {
                tickets.setLength(tickets.length() - 2); // Remove trailing comma and space
            }

            // Return ticket details
            JSONObject jsonResponse = new JSONObject();
            jsonResponse.put("ticket_id", ticketId);
            jsonResponse.put("user_id", userId);
            jsonResponse.put("show_id", showId);
            jsonResponse.put("seat_count", selectedSeats.length());
            jsonResponse.put("total_amount", totalAmount);
            jsonResponse.put("status", "upcoming");
            jsonResponse.put("payment_status", "paid");
            jsonResponse.put("show_date", showDate);
            jsonResponse.put("show_time", showTime);
            jsonResponse.put("tickets", tickets.toString());

            response.getWriter().write(jsonResponse.toString());

        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\":\"Database error occurred\"}");
        }
    }
}