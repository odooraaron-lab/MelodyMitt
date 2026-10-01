import { redirect } from "next/navigation";
import { login } from "../actions";
import { isAdmin } from "@/lib/auth";
import { site } from "@/site.config";

export const metadata = { title: "Log in" };

type Props = { searchParams: Promise<{ error?: string }> };

export default async function Login({ searchParams }: Props) {
  if (await isAdmin()) redirect("/admin");
  const { error } = await searchParams;
  return (
    <div className="login">
      <form action={login}>
        <h1>{site.name}</h1>
        <p className="muted">Log in to manage listings and orders.</p>
        {error && (
          <p className="form-error" role="alert">
            That username or password isn't right.
          </p>
        )}
        <div className="field">
          <label htmlFor="username">Username</label>
          <input className="input" id="username" name="username" autoComplete="username" autoCapitalize="none" required />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input className="input" id="password" name="password" type="password" autoComplete="current-password" required />
        </div>
        <button className="btn" type="submit">
          Log in
        </button>
      </form>
    </div>
  );
}
