import { useAuth } from "../context/AuthContext";

export default function Signin() {
  const { session } = useAuth();

  console.log(session);

  return (
    <>
      <div>
        <h1 className="landing-header">Paper Like A Boss</h1>
        <div className="sign-form-container flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
          <form
            //action=
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
              //aria-invalid=
              //aria-describedby=
              //disabled=
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
              //aria-invalid=
              //aria-describedby=
              //disabled=
            />

            <button
              type="submit"
              className="form-button"
              //className=
              //aria-busy=
            >
              Sign In
              {/*'Signing in...' when pending*/}
            </button>

            {/* Error message */}
          </form>
        </div>
      </div>
    </>
  );
}
