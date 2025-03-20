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
