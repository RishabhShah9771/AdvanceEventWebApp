import { redirect } from "react-router-dom";
import AuthForm from "../components/AuthForm";

// AuthenticationPage component renders the authentication form
function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

// Action function to handle authentication form submission
export async function action({ request }) {
  // Parse the URL to get the 'mode' query parameter (either 'login' or 'signup')
  const searchParamsUrl = new URL(request.url).searchParams;
  const mode = searchParamsUrl.get("mode") || "login";

  // Validate the mode; throw an error if it's not supported
  if (mode !== "login" && mode !== "signup") {
    throw new Response(JSON.stringify({ message: "Unsupported mode." }), {
      status: 422,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Extract form data (email and password) from the request
  const data = await request.formData();
  const authData = {
    email: data.get("email"),
    password: data.get("password"),
  };

  // Send a POST request to the backend API for login or signup
  const response = await fetch("http://localhost:8080/" + mode, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(authData),
  });

  // If the response status is 422 (validation error) or 401 (unauthorized), return the response as is
  if (response.status === 422 || response.status === 401) {
    return response;
  }
  // If the response is not OK (other errors), throw a generic authentication error
  if (!response.ok) {
    throw new Response(
      JSON.stringify({ message: "Could not authenticate user." }),
      {
        status: 500,
      }
    );
  }

  // Parse the response JSON to get the authentication token
  const responseData = await response.json();
  const token = responseData.token;

  // Store the token in localStorage for client-side authentication
  localStorage.setItem("token", token);

  // Set the token expiration time to 1 hour from now and store it in localStorage
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);
  localStorage.setItem("expiration", expiration.toISOString());

  // Redirect the user to the home page after successful authentication
  return redirect("/");
}
