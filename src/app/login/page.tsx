'use client'

import { useState } from 'react'
import { login, signup } from "../actions/auth"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSignup = async (formData: FormData) => {
    const result = await signup(formData)

    if ('error' in result && result.error) {
      setSuccess(null)
      setError(result.error)
    } else if ('success' in result && result.success) {
      setError(null)
      setSuccess(typeof result.success === 'string' ? result.success : 'Signup successful!')
    }
  }

  const handleLogin = async (formData: FormData) => {
    const result = await login(formData)

    if (result?.error) {
      setSuccess(null)
      setError(result.error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
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
          <form
            className="space-y-4"
            // action={async (formData) => {
            //   // You could differentiate based on a hidden field if needed
            //   // Or use 2 forms instead of one shared one
            // }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            {/* Show messages */}
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

<div className="flex flex-col space-y-2 pt-4">
              <Button
                type="submit"
                formAction={handleLogin}
                className="w-full"
              >
                Log in
              </Button>
              <Button
                type="submit"
                formAction={handleSignup}
                variant="outline"
                className="w-full"
              >
                Sign up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
