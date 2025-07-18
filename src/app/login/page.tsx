'use client'

import { useState } from 'react'
import { login, signup } from "../actions/auth"
// import { login } from "../actions/auth"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState<"login" | "signup" | null>(null)

  const [formData, setFormData] = useState({ email: "", password: "" })


const handleTestLogin = () => {
  setFormData({
    email: "hellojyennie@gmail.com",
  password: "testing"
  })
}

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSignup = async () => {
  setLoading("signup")
  setError(null)
  setSuccess(null)

  try {
    const data = new FormData()
    data.append("email", formData.email)
    data.append("password", formData.password)

    const result = await signup(data)

    if (result?.error) {
      // Handle Supabase's "user already registered" wording
      if (result.error.includes("already registered")) {
        setError("This email is already registered. Try logging in instead.")
      } else {
        setError(result.error)
      }
    } else {
      setSuccess("Check your inbox to confirm your email before logging in.")
    }
  } catch {
    setError("Something went wrong. Please try again.")
  } finally {
    setLoading(null)
  }
}


  const handleLogin = async () => {
    setLoading("login")
    setError(null)
    setSuccess(null)

    const data = new FormData()
    data.append("email", formData.email)
    data.append("password", formData.password)

    const result = await login(data)
    setLoading(null)

    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess("Login successful!")
    }
  }

  return (
    <div className="w-full h-svh flex items-center justify-center">
      <Card className="w-full max-w-sm p-4 border-none shadow-none">
        <CardHeader>
          <img
            src="/Changemakrs-logo.png"
            alt="Changemakr Logo"
            width="500"
            height="500"
          />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Feedback */}
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <div className="flex flex-col space-y-2 pt-4">
              <Button
                type="button"
                onClick={handleLogin}
                className="w-full"
                disabled={loading === "login"}
              >
                {loading === "login" ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Log in"
                )}
                </Button> 
                <Button
  type="button"
  onClick={handleTestLogin}
  variant="outline"
  className="w-full text-sm"
>
  Use test account
</Button>
              <button
  type="button"
  onClick={handleSignup}
  className="text-sm font-medium text-gray-400 hover:underline disabled:opacity-50"
  disabled={loading === "signup"}
>
  {loading === "signup" ? (
    <div className="flex items-center space-x-2">
      <Loader2 className="animate-spin w-4 h-4" />
      <span>Signing up...</span>
    </div>
  ) : (
    "Sign up"
  )}
</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
