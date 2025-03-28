# GoCab API Documentation

## User API Endpoints

### Register User
**Endpoint:** `POST /user/register`

**Description:**  
Creates a new user account. The endpoint validates the input data and returns the created user object along with an authentication token upon successful registration.

**Request Body:**
```json
{
  "fullname": {
    "firstname": "John",     // Required, minimum 3 characters
    "lastname": "Doe"        // Optional, minimum 3 characters if provided
  },
  "email": "john.doe@example.com",  // Required, valid email format
  "password": "password123"         // Required, minimum 6 characters
}
```

**Response:**
- **Status 201 Created** - User successfully created
```json
{
  "user": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "_id": "user_id_here",
    // Other user fields (password excluded)
  },
  "token": "jwt_auth_token_here"
}
```

- **Status 400 Bad Request** - Validation error
```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    }
    // Other validation errors if present
  ]
}
```

**Validation Rules:**
- Email must be a valid email format
- Password must be at least 6 characters long
- First name must be at least 3 characters long
- Last name, if provided, should be at least 3 characters long

**Notes:**
- The password is hashed before storing in the database
- A JWT authentication token is generated and returned upon successful registration

### Login User
**Endpoint:** `POST /user/login`

**Description:**  
Authenticates a user with email and password, returning the user object along with an authentication token upon successful login.

**Request Body:**
```json
{
  "email": "john.doe@example.com",  // Required, valid email format
  "password": "password123"         // Required, minimum 6 characters
}
```

**Response:**
- **Status 200 OK** - Login successful
```json
{
  "user": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "_id": "user_id_here",
    // Other user fields (password excluded)
  },
  "token": "jwt_auth_token_here"
}
```

- **Status 400 Bad Request** - Validation error
```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    }
    // Other validation errors if present
  ]
}
```

- **Status 401 Unauthorized** - Authentication failed
```json
{
  "message": "Invalid email or Password"
}
```

**Validation Rules:**
- Email must be a valid email format
- Password must be at least 6 characters long

**Notes:**
- The password is compared securely with the hashed password in the database
- A JWT authentication token is generated and returned upon successful login

### Get User Profile
**Endpoint:** `GET /user/profile`

**Description:**  
Retrieves the profile information of the currently authenticated user.

**Authentication:**  
Requires a valid JWT token in the request, either as:
- `Authorization` header with format `Bearer <token>`
- `token` cookie

**Response:**
- **Status 200 OK** - Profile retrieved successfully
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "_id": "user_id_here",
  // Other user fields (password excluded)
}
```

- **Status 401 Unauthorized** - Invalid or missing authentication token
```json
{
  "message": "Unauthorized"
}
```

**Notes:**
- This endpoint requires authentication via the `authUser` middleware
- The user data is retrieved based on the ID extracted from the JWT token

### Logout User
**Endpoint:** `GET /user/logout`

**Description:**  
Logs out the currently authenticated user by clearing the authentication token cookie and blacklisting the token.

**Authentication:**  
Requires a valid JWT token in the request, either as:
- `Authorization` header with format `Bearer <token>`
- `token` cookie

**Response:**
- **Status 200 OK** - Logout successful
```json
{
  "message": "Logged Out"
}
```

- **Status 401 Unauthorized** - Invalid or missing authentication token
```json
{
  "message": "Unauthorized"
}
```

- **Status 500 Internal Server Error** - Error during logout process
```json
{
  "message": "Error logging out"
}
```

**Notes:**
- This endpoint requires authentication via the `authUser` middleware
- The token is added to a blacklist to prevent reuse
- Blacklisted tokens are automatically removed after 24 hours

## Captain API Endpoints

### Register Captain
**Endpoint:** `POST /captain/register`

**Description:**  
Creates a new captain account. The endpoint validates the input data and returns the created captain object along with an authentication token upon successful registration.

**Request Body:**
```json
{
  "fullname": {
    "firstname": "John",     // Required, minimum 3 characters
    "lastname": "Doe"        // Optional, minimum 3 characters if provided
  },
  "email": "john.doe@example.com",  // Required, valid email format
  "password": "password123",        // Required
  "vehicle": {
    "color": "Black",             // Required, minimum 3 characters
    "plate": "ABC-123",           // Required, minimum 3 characters, must be unique
    "vehicleType": "car",         // Required, one of: "motorcycle", "car", "auto"
    "capacity": 4                 // Required, minimum 1
  }
}
```

**Response:**
- **Status 200 OK** - Captain successfully created
```json
{
  "captain": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "vehicle": {
      "color": "Black",
      "plate": "ABC-123",
      "vehicleType": "car",
      "capacity": 4
    },
    "status": "inactive",
    "_id": "captain_id_here"
    // Other captain fields (password excluded)
  },
  "token": "jwt_auth_token_here"
}
```

- **Status 400 Bad Request** - Validation error
```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    }
    // Other validation errors if present
  ]
}
```

- **Status 400 Bad Request** - Captain already exists
```json
{
  "message": "Captain Already Exists"
}
```

**Validation Rules:**
- Email must be a valid email format and unique
- First name must be at least 3 characters long
- Last name, if provided, should be at least 3 characters long
- Vehicle color must be at least 3 characters long
- Vehicle plate must be at least 3 characters long and unique
- Vehicle type must be one of: "motorcycle", "car", "auto"
- Vehicle capacity must be at least 1

**Notes:**
- The password is hashed before storing in the database
- A JWT authentication token is generated and returned upon successful registration
- The captain status is set to "inactive" by default

### Login Captain
**Endpoint:** `POST /captain/login`

**Description:**  
Authenticates a captain with email and password, returning the captain object along with an authentication token upon successful login.

**Request Body:**
```json
{
  "email": "john.doe@example.com",  // Required, valid email format
  "password": "password123"         // Required, minimum 3 characters
}
```

**Response:**
- **Status 200 OK** - Login successful
```json
{
  "captain": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "vehicle": {
      "color": "Black",
      "plate": "ABC-123",
      "vehicleType": "car",
      "capacity": 4
    },
    "status": "inactive",
    "_id": "captain_id_here"
    // Other captain fields (password excluded)
  },
  "token": "jwt_auth_token_here"
}
```

- **Status 400 Bad Request** - Validation error
```json
{
  "errors": [
    {
      "msg": "Email must be valid",
      "path": "email",
      "location": "body"
    }
    // Other validation errors if present
  ]
}
```

- **Status 401 Unauthorized** - Authentication failed
```json
{
  "message": "Invalid email or password"
}
```

**Validation Rules:**
- Email must be a valid email format
- Password must be at least 3 characters long

**Notes:**
- The password is compared securely with the hashed password in the database
- A JWT authentication token is generated and returned upon successful login
- The token is also set as a cookie named 'token'

### Get Captain Profile
**Endpoint:** `GET /captain/profile`

**Description:**  
Retrieves the profile information of the currently authenticated captain.

**Authentication:**  
Requires a valid JWT token in the request, either as:
- `Authorization` header with format `Bearer <token>`
- `token` cookie

**Response:**
- **Status 200 OK** - Profile retrieved successfully
```json
{
  "captain": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "vehicle": {
      "color": "Black",
      "plate": "ABC-123",
      "vehicleType": "car",
      "capacity": 4
    },
    "status": "inactive",
    "location": {
      "lat": 12.345678,
      "lng": 98.765432
    },
    "_id": "captain_id_here"
    // Other captain fields (password excluded)
  }
}
```

- **Status 401 Unauthorized** - Invalid or missing authentication token
```json
{
  "message": "Unauthorized"
}
```

**Notes:**
- This endpoint requires authentication via the `authCaptain` middleware
- The captain data is retrieved based on the ID extracted from the JWT token

### Logout Captain
**Endpoint:** `GET /captain/logout`

**Description:**  
Logs out the currently authenticated captain by clearing the authentication token cookie and blacklisting the token.

**Authentication:**  
Requires a valid JWT token in the request, either as:
- `Authorization` header with format `Bearer <token>`
- `token` cookie

**Response:**
- **Status 200 OK** - Logout successful
```json
{
  "message": "Logged Out"
}
```

- **Status 401 Unauthorized** - Invalid or missing authentication token
```json
{
  "message": "Unauthorized"
}
```

- **Status 501 Not Implemented** - Error during logout process
```json
{
  "message": "Error logging Out"
}
```

**Notes:**
- This endpoint requires authentication via the `authCaptain` middleware
- The token is added to a blacklist to prevent reuse
- The token cookie is cleared from the client
