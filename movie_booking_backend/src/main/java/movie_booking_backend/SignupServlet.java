package movie_booking_backend;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.*;
import java.sql.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@WebServlet("/signup")
public class SignupServlet extends HttpServlet {
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

    // Helper method to hash the password using SHA-256
    private String hashPassword(String password) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hashedBytes = digest.digest(password.getBytes());
        StringBuilder hexString = new StringBuilder();
        for (byte b : hashedBytes) {
            hexString.append(String.format("%02x", b));
        }
        return hexString.toString();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setContentType("text/plain");

        // Read the request body (which is JSON as a string)
        StringBuilder jsonInput = new StringBuilder();
        String line;
        try (BufferedReader reader = request.getReader()) {
            while ((line = reader.readLine()) != null) {
                jsonInput.append(line);
            }
        }

        // Extract username, email, passwordHash, and phoneNumber from the JSON body manually
        String username = null;
        String email = null;
        String password = null;
        String phoneNumber = null;

        try {
            String json = jsonInput.toString();
            // Extract data from the raw JSON string manually
            if (json.contains("\"username\"") && json.contains("\"email\"") && json.contains("\"password\"") && json.contains("\"phoneNumber\"")) {
                username = json.split("\"username\"")[1].split(":")[1].split("\"")[1];
                email = json.split("\"email\"")[1].split(":")[1].split("\"")[1];
                password = json.split("\"password\"")[1].split(":")[1].split("\"")[1];
                phoneNumber = json.split("\"phoneNumber\"")[1].split(":")[1].split("\"")[1];
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("Invalid JSON format");
            return;
        }

        if (username == null || email == null || password == null || phoneNumber == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("Missing fields");
            return;
        }

        // Hash the input password
        String hashedPassword = null;
        try {
            hashedPassword = hashPassword(password);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Error hashing password: " + e.getMessage());
            return;
        }

        // Insert user into the database
        try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD)) {
            String sql = "INSERT INTO Users (username, email, password_hash, phone_number, role) VALUES (?, ?, ?, ?, 'user')";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, username);
            stmt.setString(2, email);
            stmt.setString(3, hashedPassword);
            stmt.setString(4, phoneNumber);

            stmt.executeUpdate();
            response.getWriter().println("User registered successfully.");
        } catch (SQLException e) {
            if (e.getSQLState().equals("23505")) { // SQLSTATE for unique violation (duplicate key)
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().println("Email already exists");
            } else {
                e.printStackTrace();
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().println("Error: " + e.getMessage());
            }
        }
    }
}
