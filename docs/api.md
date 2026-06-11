 # API Documentation

 ## 1. Overview

 The system exposes a REST API built with Django REST Framework.
 The API provides access to sensor measurements stored in PostgreSQL.

 All endpoints return JSON responses.

 Base URL:

 ```
 /api/
 ```

 ---

 ## 2. Endpoints Overview

 | Endpoint | Method | Description |
 |----------|--------|-------------|
 | /health/ | GET | Service health check |
 | /measurements/ | GET | List latest measurements |
 | /measurements/latest/ | GET | Get latest measurement |
 | /measurements/history/ | GET | Filtered measurement history |

 ---
 
 ## 2a. Authentication
 
 The API is protected using **JWT (JSON Web Token)** authentication via Django REST Framework SimpleJWT.
 
 ### 🔑 Login endpoint
 
 ```
 POST /api/token/
 ```
 
 **Description:**
 Returns access and refresh tokens for authenticated users.
 
 **Request body:**
 
 ```json
 {
   "username": "admin",
   "password": "admin123"
 }
 ```
 
 **Response:**
 
 ```json
 {
   "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
   "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
 }
 ```
 
 ---
 
 ### 🔄 Refresh token
 
 ```
 POST /api/token/refresh/
 ```
 
 **Description:**
 Generates a new access token using refresh token.
 
 **Request body:**
 
 ```json
 {
   "refresh": "your_refresh_token"
 }
 ```
 
 **Response:**
 
 ```json
 {
   "access": "new_access_token"
 }
 ```
 
 ---
 
 ### 🛡️ Authorization header
 
 For all protected endpoints, include JWT token in request headers:
 
 ```
 Authorization: Bearer <access_token>
 ```
 
 **Example:**
 
 ```
 GET /api/measurements/
 Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
 ```
 
 ---
 
 ### 🔒 Security notes
 
 - Tokens expire after a limited time (configurable in settings)
 - Access token should be stored client-side (e.g. localStorage)
 - Refresh token should be used to maintain session
 - Unauthorized requests return `401 Unauthorized`
 
 ---

 ## 3. Health Check

 ### GET /api/health/

 **Description:**
 Returns API status.

 **Response:**

 ```
 {
   "status": "ok"
 }
 ```

 ---

 ## 4. List Measurements

 ### GET /api/measurements/?limit=20

 **Description:**
 Returns latest sensor measurements ordered by timestamp (descending).

 **Query Parameters:**

 | Parameter | Type | Description |
 |-----------|------|-------------|
 | limit     | int  | Number of records to return (default: 20) |

 **Response Example:**

 ```
 [
   {
     "id": 1,
     "device_id": "esp8266-18FE34DAC1EC",
     "sensor": "temperature",
     "value": 24.5,
     "unit": "C",
     "ts_ms": 1717761234567,
     "topic": "lab/group1/device/temperature"
   }
 ]
 ```

 ---

 ## 5. Latest Measurement

 ### GET /api/measurements/latest/

 **Description:**
 Returns the most recent measurement across all devices.

 **Response Example:**

 ```
 {
   "id": 10,
   "device_id": "esp8266-18FE34DAC1EC",
   "sensor": "pressure",
   "value": 1013.2,
   "unit": "Pa",
   "ts_ms": 1717761239999,
   "topic": "lab/group1/device/pressure"
 }
 ```

 **Errors:**

 - 404 → No measurements available

 ---

 ## 6. Measurement History

 ### GET /api/measurements/history/

 **Description:**
 Returns filtered historical measurements.

 **Query Parameters:**

 | Parameter  | Type   | Description |
 |------------|--------|-------------|
 | device_id  | string | Filter by device |
 | sensor     | string | Filter by sensor type |
 | limit      | int    | Number of results (default: 100) |

 **Example Request:**

 ```
 /api/measurements/history/?device_id=esp8266-18FE34DAC1EC&sensor=temperature&limit=50
 ```

 **Response Example:**

 ```
 [
   {
     "id": 1,
     "device_id": "esp8266-18FE34DAC1EC",
     "sensor": "temperature",
     "value": 23.8,
     "unit": "C",
     "ts_ms": 1717761200000,
     "topic": "lab/group1/device/temperature"
   }
 ]
 ```

 ---

 ## 7. Data Format

 All endpoints return data serialized from the `Measurement` model:

 - id: integer
 - device_id: string
 - sensor: string
 - value: float
 - unit: string
 - ts_ms: integer (epoch milliseconds)
 - topic: string

 ---

 ## 8. Notes

 - API is read-only (no POST endpoints exposed)
 - Filtering is done in database layer for efficiency
 - Timestamp format is consistent across system (ms since epoch)

 ---