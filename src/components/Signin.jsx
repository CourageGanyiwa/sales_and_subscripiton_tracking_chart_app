import { useAuth } from "../context/AuthContext";
import { useActionState } from "react";

export default function Signin() {
  const { signInUser } = useAuth();
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const email = formData.get("email");
      const password = formData.get("password");

      const {
        success,
        data,
        error: signInError,
      } = await signInUser(email, password);

      if (signInError) return new Error(signInError);

      if (success && data?.session) return null;

      return null;
    },
    null
  );

  return (
    <>
      <div>
        <h1 className="landing-header">Paper Like A Boss</h1>
        <div className="sign-form-container flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
          <form
            action={submitAction}
            aria-label="Sign in form"
            aria-describedby="form-description"
            className="sm:mx-auto sm:w-full sm:max-w-sm"
          >
            <div id="form-description" className="sr-only">
              Use this form to sign in to your account. Enter your email and
              password.
            </div>

            <h2 className="form-title">Sign in</h2>
            <p>
              Don't have an account yet? {/*<Link className="form-link">*/}
              Sign up
              {/*</Link>*/}
            </p>

            <label htmlFor="email">Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              id="email"
              placeholder=""
              required
              aria-required="true"
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? "signin-error" : undefined}
              disabled={isPending}
            />

            <label htmlFor="password">Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              id="password"
              placeholder=""
              required
              aria-required="true"
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? "signin-error" : undefined}
              disabled={isPending}
            />

            <button type="submit" className="form-button" aria-busy={isPending}>
              {isPending ? "Signing in " : "Sign In"}
            </button>

            {error && (
              <div
                id="signin-error"
                role="alert"
                className="sign-form-error-message"
              >
                {error.message}
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
