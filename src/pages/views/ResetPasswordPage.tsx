// src/pages/ResetPasswordPage.tsx

import React, { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import axios from "axios"
import styled from "styled-components"
import ReuseHeader from "@/components/ReuseHeader"
import TextField from "@/components/TextField"
import { RoutePath } from "@/types/route-path"
import Button from "@/components/Button"

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const navigate = useNavigate()
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [newPasswordError, setNewPasswordError] = useState<string>("")
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setError("Invalid password reset link.")
    }
    // Optional: Verify token with backend
    // verifyToken();
  }, [token])

  // Optional: Verify token with backend
  const verifyToken = async () => {
    try {
      const response = await axios.post("/user/password/verify_token", {
        token,
      })
      if (response.data.statusCode !== 0) {
        setError(response.data.error || "Invalid token.")
      }
    } catch (err) {
      setError("Failed to verify token.")
    }
  }

  return (
    <Container>
      <ReuseHeader
        title="비밀번호 재설정"
        onBack={() => navigate(RoutePath.Login)}
      />
      <Label>새로운 비밀번호</Label>
      <TextField
        type="text"
        name="email_id"
        placeholder="영문 대/소문자, 숫자, 특수문자 조합하여 8~16자"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        $isError={newPasswordError !== ""}
        errorMessage={newPasswordError}
      />
      <Label>새로운 비밀번호 확인</Label>
      <TextField
        type="password"
        name="password"
        placeholder="영문 대/소문자, 숫자, 특수문자 조합하여 8~16자"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        $isError={confirmPasswordError !== ""}
        errorMessage={confirmPasswordError}
      />
      <Button type="submit" disabled={!isButtonEnabled} $variant="red">
        비밀번호 재설정
      </Button>
    </Container>
  )
}

export default ResetPasswordPage

const Container = styled.div`
  padding: 4.4rem 0;
  display: flex;
  flex-direction: column;
`

const Label = styled.p`
  margin: 0 0 0.8rem 0.4rem;
  color: var(--primary-color);
  font-size: var(--font-bodyL-size);
  font-weight: var(--font-weight-medium);
`
