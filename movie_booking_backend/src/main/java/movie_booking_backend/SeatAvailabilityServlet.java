package movie_booking_backend;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.*;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/getSeatAvailability")
public class SeatAvailabilityServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final String JDBC_URL = "jdbc:postgresql://localhost:5433/movieticketdb";
    private static final String JDBC_USER = "postgres";
    private static final String JDBC_PASSWORD = "vishal888";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setContentType("application/json");

        String showIdStr = request.getParameter("showId");
        if (showIdStr == null || showIdStr.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\":\"Show ID is required.\"}");
            return;
        }

        int showId;
        try {
            showId = Integer.parseInt(showIdStr);
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\":\"Invalid Show ID.\"}");
            return;
        }

        List<SeatDetails> seatDetailsList = new ArrayList<>();
        TheaterDetails theaterDetails = new TheaterDetails();
        try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD)) {
            String query = """
                    SELECT t.theater_name, t.address, m.movie_name, sc.screen_name, sc.gold_rows, sc.gold_columns, sc.silver_rows, sc.silver_columns,
                           s.seat_id, s.row_number, s.column_number, s.tier, s.seat_label,
                           CASE WHEN bs.seat_id IS NULL THEN TRUE ELSE FALSE END AS is_available
                    FROM Seats s
                    LEFT JOIN BookedSeats bs ON s.seat_id = bs.seat_id AND bs.show_id = ?
                    JOIN Screens sc ON s.screen_id = sc.screen_id
                    JOIN Theaters t ON sc.theater_id = t.theater_id
                    JOIN ShowTimes st ON sc.screen_id = st.screen_id
                    JOIN Movies m ON st.movie_id = m.id
                    WHERE st.show_id = ?
                    """;

            try (PreparedStatement stmt = conn.prepareStatement(query)) {
                stmt.setInt(1, showId);
                stmt.setInt(2, showId);
                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        if (theaterDetails.getTheaterName() == null) {
                            theaterDetails.setTheaterName(rs.getString("theater_name"));
                            theaterDetails.setAddress(rs.getString("address"));
                            theaterDetails.setMovieName(rs.getString("movie_name"));
                            theaterDetails.setScreenName(rs.getString("screen_name"));
                            theaterDetails.setGoldRows(rs.getInt("gold_rows"));
                            theaterDetails.setGoldColumns(rs.getInt("gold_columns"));
                            theaterDetails.setSilverRows(rs.getInt("silver_rows"));
                            theaterDetails.setSilverColumns(rs.getInt("silver_columns"));
                        }
                        SeatDetails details = new SeatDetails();
                        details.setSeatId(rs.getInt("seat_id"));
                        details.setRowNumber(rs.getInt("row_number"));
                        details.setColumnNumber(rs.getInt("column_number"));
                        details.setTier(rs.getString("tier"));
                        details.setSeatLabel(rs.getString("seat_label"));
                        details.setAvailable(rs.getBoolean("is_available"));
                        seatDetailsList.add(details);
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\":\"Database error occurred.\"}");
            return;
        }

        int goldRows = theaterDetails.getGoldRows();
        int goldColumns = theaterDetails.getGoldColumns();
        int silverRows = theaterDetails.getSilverRows();
        int silverColumns = theaterDetails.getSilverColumns();
        int totalGoldBookedSeats = (int) seatDetailsList.stream().filter(seat -> seat.getTier().equals("gold") && !seat.isAvailable()).count();
        int totalSilverBookedSeats = (int) seatDetailsList.stream().filter(seat -> seat.getTier().equals("silver") && !seat.isAvailable()).count();

StringBuilder jsonResponse = new StringBuilder("{");
jsonResponse.append("\"theater_name\":\"").append(theaterDetails.getTheaterName()).append("\",")
            .append("\"address\":\"").append(theaterDetails.getAddress()).append("\",")
            .append("\"movie_name\":\"").append(theaterDetails.getMovieName()).append("\",")
            .append("\"screen_name\":\"").append(theaterDetails.getScreenName()).append("\",")
            .append("\"gold_rows\":").append(goldRows).append(",")
            .append("\"gold_columns\":").append(goldColumns).append(",")
            .append("\"silver_rows\":").append(silverRows).append(",")
            .append("\"silver_columns\":").append(silverColumns).append(",")
            .append("\"total_gold_booked_seats\":").append(totalGoldBookedSeats).append(",")
            .append("\"total_silver_booked_seats\":").append(totalSilverBookedSeats).append(",")
            .append("\"seats\":[");
for (int i = 0; i < seatDetailsList.size(); i++) {
    SeatDetails details = seatDetailsList.get(i);
    jsonResponse.append("{")
                .append("\"seat_id\":").append(details.getSeatId()).append(",")
                .append("\"row_number\":").append(details.getRowNumber()).append(",")
                .append("\"column_number\":").append(details.getColumnNumber()).append(",")
                .append("\"tier\":\"").append(details.getTier()).append("\",")
                .append("\"seat_label\":\"").append(details.getSeatLabel()).append("\",")
                .append("\"is_available\":").append(details.isAvailable())
                .append("}");
    if (i < seatDetailsList.size() - 1) {
        jsonResponse.append(",");
    }
}
jsonResponse.append("]}");

response.getWriter().write(jsonResponse.toString());
    }

    private static class SeatDetails {
        private int seatId;
        private int rowNumber;
        private int columnNumber;
        private String tier;
        private String seatLabel;
        private boolean isAvailable;

        public int getSeatId() {
            return seatId;
        }

        public void setSeatId(int seatId) {
            this.seatId = seatId;
        }

        public int getRowNumber() {
            return rowNumber;
        }

        public void setRowNumber(int rowNumber) {
            this.rowNumber = rowNumber;
        }

        public int getColumnNumber() {
            return columnNumber;
        }

        public void setColumnNumber(int columnNumber) {
            this.columnNumber = columnNumber;
        }

        public String getTier() {
            return tier;
        }

        public void setTier(String tier) {
            this.tier = tier;
        }

        public String getSeatLabel() {
            return seatLabel;
        }

        public void setSeatLabel(String seatLabel) {
            this.seatLabel = seatLabel;
        }

        public boolean isAvailable() {
            return isAvailable;
        }

        public void setAvailable(boolean isAvailable) {
            this.isAvailable = isAvailable;
        }
    }

    private static class TheaterDetails {
        private String theaterName;
        private String address;
        private String movieName;
        private String screenName;
        private int goldRows;
        private int goldColumns;
        private int silverRows;
        private int silverColumns;

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

        public String getMovieName() {
            return movieName;
        }

        public void setMovieName(String movieName) {
            this.movieName = movieName;
        }

        public String getScreenName() {
            return screenName;
        }

        public void setScreenName(String screenName) {
            this.screenName = screenName;
        }

        public int getGoldRows() {
            return goldRows;
        }

        public void setGoldRows(int goldRows) {
            this.goldRows = goldRows;
        }

        public int getGoldColumns() {
            return goldColumns;
        }

        public void setGoldColumns(int goldColumns) {
            this.goldColumns = goldColumns;
        }

        public int getSilverRows() {
            return silverRows;
        }

        public void setSilverRows(int silverRows) {
            this.silverRows = silverRows;
        }

        public int getSilverColumns() {
            return silverColumns;
        }

        public void setSilverColumns(int silverColumns) {
            this.silverColumns = silverColumns;
        }
    }
}