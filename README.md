# API-veggie-place <br/>

GET: /<br/>
GET: /users - return all users<br/>
POST: /register {username, email, password} - register users in the database<br/>
POST: /login {username, password} - log in with the user account, returns a bearer token<br/>
GET: /users:id - returns the user logged in (must send bearer token in the header)<br/>
PATCH: /users:id {username, email, password} (optional) - change one or more attributes of the user (must send bearer token in the header)
