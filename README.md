# API-veggie-place

GET: /
GET: /users - return all users
POST: /register {username, email, password} - register users in the database
POST: /login {username, password} - log in with the user account, returns a bearer token
GET: /users:id - returns the user logged in (must send bearer token in the header)
PATCH: /users:id {username, email, password} (optional) - change one or more attributes of the user (must send bearer token in the header)
