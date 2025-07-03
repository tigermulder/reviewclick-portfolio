import React, { Component, ReactNode } from "react"
import { ErrorBoundaryProps, ErrorBoundaryState } from "types/type"
import Error500Image from "assets/500error.png"
import Error404Image from "assets/404error.png"
import Button from "./Button"
import styled from "styled-components"

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  // 에러 발생 시 상태를 업데이트
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  // 에러 로깅 또는 추가 처리
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary에서 오류가 발생하였습니다:", error, errorInfo)
  }

  // 에러 메시지 렌더링
  renderErrorMessage(): ReactNode {
    if (this.state.error?.message.includes("404")) {
      // 404 에러 메시지
      return (
        <>
          입력한 주소가 정확한지
          <br />
          다시 한 번 확인해주세요.
        </>
      )
    } else if (this.state.error?.message.includes("401")) {
      // 401 인증에러 메시지
      return (
        <>
          세션이 만료되었거나 <br />
          접근 권한이 없는 페이지일 수 있어요.
        </>
      )
    } else {
      // 500 에러 메시지
      return (
        <>
          Wi-Fi 또는 셀룰러 데이터 연결을 확인한 후
          <br />
          다시 시도해주세요.
        </>
      )
    }
  }

  // 에러 타이틀 렌더링
  renderErrorTitle(): string {
    if (this.state.error?.message.includes("404")) {
      return " 찾을 수 없어요"
    } else if (this.state.error?.message.includes("401")) {
      return "잘못된 접근이에요"
    } else {
      return "네트워크가 불안정해요"
    }
  }

  // 에러 이미지 렌더링
  renderErrorImage(): string {
    if (
      this.state.error?.message.includes("404") ||
      this.state.error?.message.includes("401")
    ) {
      return Error404Image
    } else {
      return Error500Image
    }
  }

  // 이미지 스타일 적용
  getImageStyle(): React.CSSProperties {
    if (
      this.state.error?.message.includes("404") ||
      this.state.error?.message.includes("401")
    ) {
      return {
        width: "9rem",
        height: "auto",
        marginBottom: "2.9rem",
      }
    } else {
      return {
        width: "10rem",
        height: "auto",
        marginBottom: "2.7rem",
      }
    }
  }

  render() {
    if (this.state.hasError) {
      const errorTitle = this.renderErrorTitle()
      const errorImage = this.renderErrorImage()
      const imageStyle = this.getImageStyle()

      return (
        <ErrorContainer>
          <img src={errorImage} alt="에러 이미지" style={imageStyle} />
          <h2>{errorTitle}</h2>
          <ErrorMessage>{this.renderErrorMessage()}</ErrorMessage>
          <ButtonContainer>
            <Button onClick={() => window.location.reload()} $variant="pink">
              다시 시도
            </Button>
          </ButtonContainer>
        </ErrorContainer>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

const ErrorContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 1.5rem;
  text-align: center;
`

const ErrorMessage = styled.p`
  margin: 0.8rem 0 4rem;
  text-align: center;
  font-size: var(--font-body-size);
  color: var(--N200);
`

const ButtonContainer = styled.div`
  width: 50%;
`
