# Demo - Next and Express

A simple full-stack application using Next.js and Express.js. Using mock data from JSONPlaceholder converted to a format suitable for PostgreSQL.

Copilot commit message prompt: "Could you please help me write a point-form list for a commit message of the changes made in these files?"

## Features

- Front-end
  - UI built with Next.js
  - Simple pages for sign-in, sign-up, and profile
  - Home page displays all posts
  - User can go to profile page to see their posts, as well as create new posts
- Back-end
  - PostgreSQL database hosted on Supabase
  - REST API built with Express.js
  - Authentication
  - Packages used:
    - `cors`: for handling CORS (when fetching from client components, server components ok without)
    - `dotenv`: for environment variables
    - `morgan`: http request logger middleware
    - `helmet`: setting various HTTP headers for security
    - `drizzle-orm`: for database interactions
    - `pg`: PostgreSQL client for Node.js
    - `bcryptjs`: for hashing passwords
    - `zod`: for input validation
    - `jsonwebtoken`: for creating and verifying JSON Web Tokens (JWTs)

## 1. User Registration Flow (High-Level)

1. Frontend Action: The user fills out the registration form (email, password) on your Next.js app and submits it.

2. API Request (Frontend to Backend): Next.js sends an API request (e.g., POST /api/users/sign-up) to your Express.js backend with the user's email and password in the request body.

3. Input Validation (Backend): The Express.js backend receives the request. This is where you'll use Zod to validate that the email is in a correct format and the password meets your minimum requirements (length, complexity).

4. Password Hashing (Backend): If validation passes, the backend uses a library like bcrypt.js to hash the user's plain-text password. Crucially, you never store the plain-text password.

5. Database Storage (Backend to Supabase/PostgreSQL): The backend then inserts the new user's email and the hashed password into your users table in the PostgreSQL database (via Drizzle).

6. Response (Backend to Frontend):

- If the user is successfully created, the backend sends a success response (e.g., 201 Created status with a simple success message).
- If there's an error (e.g., email already exists, database error), the backend sends an appropriate error response (e.g., 409 Conflict, 500 Internal Server Error).

7. Frontend Handling: Next.js receives the response. If successful, it might display a success message and then automatically redirect the user to the login page or even log them in immediately (which would then follow the login flow below).

## 2. User Login Flow (High-Level)

1. Frontend Action: The user fills out the login form (email, password) on your Next.js app and submits it.

2. API Request (Frontend to Backend): Next.js sends an API request (e.g., POST /api/users/sign-in) to your Express.js backend with the user's email and password.

3. Input Validation (Backend): The Express.js backend validates the input using Zod.

4. User Lookup (Backend to Supabase/PostgreSQL): The backend queries your users table to find the user by their email address.

5. Password Comparison (Backend):

If the user is found, the backend retrieves the stored hashed password.

It then uses bcrypt.js (or similar) to compare the plain-text password provided by the user with the stored hashed password. bcrypt.js will handle the re-hashing and comparison securely.

6. Authentication Decision & Session/Token Generation (Backend):

If the passwords match (authentication successful): This is where session management comes in. You will generate something that proves the user is logged in.

Option A: JSON Web Token (JWT) - Recommended for your setup.

The backend creates a JWT, which is a digitally signed, compact, URL-safe means of representing claims (like user ID, roles, expiration time). It does not store session state on the server.

The JWT is signed with a secret key known only to your backend.

The backend then sends this JWT back to the Next.js frontend, typically as an HttpOnly cookie or within the response body.

Option B: Session ID with express-session.

The backend creates a unique session ID and stores it (along with user data) in a session store (e.g., in memory, or a database like Redis/PostgreSQL).

The backend sends this session ID back to the frontend, exclusively as an HttpOnly cookie. The browser automatically sends this cookie with subsequent requests.

If passwords don't match or the user isn't found (authentication failed), the backend sends an error response (e.g., 401 Unauthorized).

7. Response (Backend to Frontend):

If successful, the backend sends a success response (e.g., 200 OK) and includes the JWT (either in an HttpOnly cookie or in the response body) or sets the session cookie.

It might also send back non-sensitive user details (e.g., username, user ID) for immediate display.

8. Frontend Handling:

If using JWT (HttpOnly Cookie): The browser automatically receives and manages the HttpOnly cookie. Next.js doesn't directly access it. All subsequent requests to your backend will automatically include this cookie.

If using JWT (in response body): Next.js receives the JWT in the response body. It should then securely store this JWT (e.g., in localStorage or better yet, manually set it in an HttpOnly cookie from the frontend if not already).

If using express-session: The browser receives and manages the HttpOnly session cookie automatically.

Regardless of the method, Next.js updates its internal application state (e.g., using React Context, a state management library like Zustand, or simply useState in a parent component) to reflect that the user is now logged in. This state change will trigger UI updates (e.g., showing a "Welcome, [Username]!" message, displaying private links, redirecting to the user's dashboard).

## How Next.js Knows the User is Signed In / Subsequent Requests

For HttpOnly Cookies (recommended for both JWTs and express-session):

Once the backend sends an HttpOnly cookie (containing either the session ID or the JWT), the browser automatically attaches this cookie to all subsequent requests made to the same domain (your Express.js backend).

Your Next.js frontend doesn't need to explicitly "know" or access the cookie's content directly on the client side. It just makes API calls.

On the backend, your Express.js app will have middleware that automatically parses this cookie.

If using express-session, the middleware uses the session ID to retrieve user data from the session store.

If using JWT, the middleware verifies the JWT's signature and expiration, extracting the user information embedded within it.

If the session/JWT is valid, the backend knows who the user is and can proceed with the request. If invalid or missing, it sends an 401 Unauthorized response.

For JWTs in localStorage (less secure, but common for SPAs):

Next.js explicitly retrieves the JWT from localStorage and includes it in the Authorization header of all protected API requests (e.g., Authorization: Bearer <your_jwt>).

The Express.js backend then extracts the JWT from the header, verifies it, and identifies the user.

## Protecting Routes and Data

Frontend (Next.js):

For pages that require authentication (e.g., "My Posts", "Create New Post"), you'll use client-side logic (e.g., in a useEffect hook, or a custom hook for authentication) to check if the user is logged in (based on your internal Next.js auth state). If not, you redirect them to the login page.

For server-side rendered pages or API routes within Next.js (e.g., using getServerSideProps or middleware.ts), you can also check for the presence and validity of the authentication cookie before rendering or processing requests.

Backend (Express.js):

This is the most critical layer of protection. For any API endpoint that requires a logged-in user (e.g., GET /api/user/posts, POST /api/posts/new), you'll implement middleware.

This middleware will:

Check for the presence of the session cookie or JWT in the request.

Validate the session ID against your session store (for express-session) or verify the JWT's signature and expiration (for jsonwebtoken).

If valid, it will attach the user's ID or relevant user data to the request object (req.user = ...) and pass control to the next handler.

If invalid or missing, it will immediately send a 401 Unauthorized response.
