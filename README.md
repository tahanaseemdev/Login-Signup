# Login/Signup Module with Authentication and Email Verification

This project is a complete login and signup module with database integration. It includes features such as email verification using OTP, session management for secure login, and password recovery via a unique token-based link. The system is built using **Node.js**, **Express**, **MongoDB**, and **express-session**.

## Features

1. **Signup with OTP Verification**:
   - Users can sign up by providing their details.
   - OTP (One-Time Password) is sent to the user's email for verification.
   - Temporary user accounts are created until the OTP is validated.

2. **Login with Session Management**:
   - Users can log in using their email and password.
   - Sessions are managed using `express-session` and stored in MongoDB.

3. **Access Control**:
   - Dashboard and other protected routes are accessible only to logged-in users.

4. **Forgot Password**:
   - Users can request a password reset link.
   - A unique token is generated and sent to their registered email.
   - Password reset functionality includes token expiration handling.

5. **Logout**:
   - Securely destroy user sessions upon logout.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Session Store**: MongoDB Sessions using `connect-mongodb-session`
- **Email Service**: Nodemailer with Gmail

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file and add the following:
   ```env
   DB_URI=your_mongodb_connection_string
   EMAIL_ADDRESS=your_email_address
   PASSWORD=your_email_password # Note: This is not your Gmail account password but the app passkey generated through your Gmail account.
   SESSION_SECRET=your_secret_key
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Frontend Setup:
   Ensure the frontend runs on `http://localhost:5173` to comply with the configured CORS settings.

## API Endpoints

### User Routes (`/api/users`)
- `POST /create` - Create a new user with OTP verification.
- `POST /validateOtp` - Validate OTP and activate the user account.
- `POST /login` - Login with email and password.
- `GET /checkSession` - Check if the user session is active.
- `POST /logout` - Logout the user and destroy the session.
- `POST /forgotPassword` - Request a password reset link.
- `POST /changePassword` - Change the user's password using the reset token.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
