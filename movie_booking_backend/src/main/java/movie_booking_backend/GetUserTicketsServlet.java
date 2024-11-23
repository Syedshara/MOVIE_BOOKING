package movie_booking_backend;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.*;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONObject;

@WebServlet("/getUserTickets")
public class GetUserTicketsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final String JDBC_URL = "jdbc:postgresql://localhost:5433/movieticketdb";
    private static final String JDBC_USER = "postgres";
    private static final String JDBC_PASSWORD = "vishal888";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setContentType("application/json");

        String email = request.getParameter("email");
        if (email == null || email.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\":\"Email parameter is missing\"}");
            return;
        }

        List<TicketDetails> tickets = new ArrayList<>();
        try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD)) {
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

            String query = """
                SELECT t.ticket_id, t.show_id, t.booking_time, t.status, t.seat_count, t.total_amount, t.payment_status, t.booking_source,
                       st.show_date, st.show_time, m.movie_name, th.theater_name, th.address,
                       bs.seat_id, s.seat_label, s.tier
                FROM Tickets t
                JOIN ShowTimes st ON t.show_id = st.show_id
                JOIN Movies m ON st.movie_id = m.id
                JOIN BookedSeats bs ON t.ticket_id = bs.ticket_id
                JOIN Seats s ON bs.seat_id = s.seat_id
                JOIN Theaters th ON bs.theater_id = th.theater_id
                WHERE t.user_id = ?
                ORDER BY t.booking_time DESC
            """;

            try (PreparedStatement stmt = conn.prepareStatement(query)) {
                stmt.setInt(1, userId);
                ResultSet rs = stmt.executeQuery();
                while (rs.next()) {
                    TicketDetails ticket = new TicketDetails();
                    ticket.setTicketId(rs.getInt("ticket_id"));
                    ticket.setShowId(rs.getInt("show_id"));
                    ticket.setBookingTime(rs.getTimestamp("booking_time"));
                    ticket.setStatus(rs.getString("status"));
                    ticket.setSeatCount(rs.getInt("seat_count"));
                    ticket.setTotalAmount(rs.getDouble("total_amount"));
                    ticket.setPaymentStatus(rs.getString("payment_status"));
                    ticket.setBookingSource(rs.getString("booking_source"));
                    ticket.setShowDate(rs.getDate("show_date"));
                    ticket.setShowTime(rs.getTime("show_time"));
                    ticket.setMovieName(rs.getString("movie_name"));
                    ticket.setTheaterName(rs.getString("theater_name"));
                    ticket.setAddress(rs.getString("address"));
                    ticket.addSeat(rs.getInt("seat_id"), rs.getString("seat_label"), rs.getString("tier"));
                    tickets.add(ticket);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\":\"Database error occurred\"}");
            return;
        }

        JSONArray jsonResponse = new JSONArray();
        for (TicketDetails ticket : tickets) {
            jsonResponse.put(ticket.toJson());
        }

        response.getWriter().write(jsonResponse.toString());
    }

    private static class TicketDetails {
        private int ticketId;
        private int showId;
        private Timestamp bookingTime;
        private String status;
        private int seatCount;
        private double totalAmount;
        private String paymentStatus;
        private String bookingSource;
        private Date showDate;
        private Time showTime;
        private String movieName;
        private String theaterName;
        private String address;
        private List<SeatDetails> seats = new ArrayList<>();

        // Getters and setters

        public void setTicketId(int ticketId) {
            this.ticketId = ticketId;
        }

        public void setShowId(int showId) {
            this.showId = showId;
        }

        public void setBookingTime(Timestamp bookingTime) {
            this.bookingTime = bookingTime;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public void setSeatCount(int seatCount) {
            this.seatCount = seatCount;
        }

        public void setTotalAmount(double totalAmount) {
            this.totalAmount = totalAmount;
        }

        public void setPaymentStatus(String paymentStatus) {
            this.paymentStatus = paymentStatus;
        }

        public void setBookingSource(String bookingSource) {
            this.bookingSource = bookingSource;
        }

        public void setShowDate(Date showDate) {
            this.showDate = showDate;
        }

        public void setShowTime(Time showTime) {
            this.showTime = showTime;
        }

        public void setMovieName(String movieName) {
            this.movieName = movieName;
        }

        public void setTheaterName(String theaterName) {
            this.theaterName = theaterName;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public void addSeat(int seatId, String seatLabel, String tier) {
            this.seats.add(new SeatDetails(seatId, seatLabel, tier));
        }

        public JSONObject toJson() {
            JSONObject json = new JSONObject();
            json.put("ticket_id", ticketId);
            json.put("show_id", showId);
            json.put("booking_time", bookingTime);
            json.put("status", status);
            json.put("seat_count", seatCount);
            json.put("total_amount", totalAmount);
            json.put("payment_status", paymentStatus);
            json.put("booking_source", bookingSource);
            json.put("show_date", showDate);
            json.put("show_time", showTime);
            json.put("movie_name", movieName);
            json.put("theater_name", theaterName);
            json.put("address", address);

            JSONArray seatsArray = new JSONArray();
            for (SeatDetails seat : seats) {
                seatsArray.put(seat.toJson());
            }
            json.put("seats", seatsArray);

            return json;
        }
    }

    private static class SeatDetails {
        private int seatId;
        private String seatLabel;
        private String tier;

        public SeatDetails(int seatId, String seatLabel, String tier) {
            this.seatId = seatId;
            this.seatLabel = seatLabel;
            this.tier = tier;
        }

        public JSONObject toJson() {
            JSONObject json = new JSONObject();
            json.put("seat_id", seatId);
            json.put("seat_label", seatLabel);
            json.put("tier", tier);
            return json;
        }
    }
}