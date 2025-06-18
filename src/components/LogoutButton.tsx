"use client";
import { logout } from "../app/actions/auth";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
      >
        Log out
      </button>
    </form>
  );
}
