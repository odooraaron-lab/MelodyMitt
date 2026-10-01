import { redirect } from "next/navigation";
import { login } from "../actions";
import { isAdmin } from "@/lib/auth";
import { site } from "@/site.config";
import { StudioArtwork } from "./StudioArtwork";

export const metadata = { title: "Log in" };

type Props = { searchParams: Promise<{ error?: string }> };

export default async function Login({ searchParams }: Props) {
  if (await isAdmin()) redirect("/admin");
  const { error } = await searchParams;
  return (
    <main className="studio">
      <div className="studio-inner">
        <figure className="frame">
          <StudioArtwork />
        </figure>

        <form action={login} className="wall-label">
          <div className="label-head">
            <p className="label-artist">{site.name}</p>
            <p className="label-title">The studio, {new Date().getFullYear()}</p>
            <p className="label-medium">Log in to list new pieces and look after orders.</p>
          </div>

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
    </main>
  );
}
