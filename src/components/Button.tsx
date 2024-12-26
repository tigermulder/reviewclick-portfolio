import { forwardRef } from "react"
import styled, { css, keyframes } from "styled-components"
import IconArrowGo from "assets/ico_arr_go.svg?url"
import IconUpload from "assets/ico_upload.svg"
import SuccessIcon from "./SuccessIcon"
import FailedIcon from "./FailedIcon"
import {
  ButtonProps,
  StyledButtonProps,
} from "@/types/component-types/button-type"

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      disabled,
      $variant,
      type = "button",
      $marginTop,
      $fontSize,
      $animation,
      onClick,
    },
    ref
  ) => (
    <StyledButton
      ref={ref}
      disabled={disabled || $variant === "spinner"}
      $variant={$variant}
      type={type}
      onClick={onClick}
      $marginTop={$marginTop}
      $fontSize={$fontSize}
      $animation={$animation}
    >
      {$variant === "success" && (
        <SuccessIcon
          backgroundColor="var(--L400)"
          filter={true}
          filterColor="rgba(245, 46, 54, 0.3)"
          aria-hidden="true"
        />
      )}
      {$variant === "failed" && (
        <FailedIcon
          backgroundColor="var(--RevBlack)"
          filter={false}
          aria-hidden="true"
        />
      )}
      {$variant === "spinner" ? (
        <Spinner role="status">
          {Array.from({ length: 8 }).map((_, i) => (
            <Dot key={i} />
          ))}
        </Spinner>
      ) : (
        children
      )}
    </StyledButton>
  )
)

export default Button

const fade = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`

const Spinner = styled.div`
  position: relative;
  width: 1.5rem;
  height: 1.5rem;
`

const Dot = styled.div`
  position: absolute;
  top: -0.2rem;
  left: 50%;
  width: 0.14rem;
  height: 0.52rem;
  background-color: var(--L100);
  border-radius: 0.15rem;
  transform-origin: center 0.85rem;
  animation: ${fade} 1s linear infinite;

  &:nth-child(1) {
    transform: rotate(0deg);
    animation-delay: 0s;
  }
  &:nth-child(2) {
    transform: rotate(45deg);
    animation-delay: -0.875s;
  }
  &:nth-child(3) {
    transform: rotate(90deg);
    animation-delay: -0.75s;
  }
  &:nth-child(4) {
    transform: rotate(135deg);
    animation-delay: -0.625s;
  }
  &:nth-child(5) {
    transform: rotate(180deg);
    animation-delay: -0.5s;
  }
  &:nth-child(6) {
    transform: rotate(225deg);
    animation-delay: -0.375s;
  }
  &:nth-child(7) {
    transform: rotate(270deg);
    animation-delay: -0.25s;
  }
  &:nth-child(8) {
    transform: rotate(315deg);
    animation-delay: -0.125s;
  }
`
const flexCenter = `
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledButton = styled.button<StyledButtonProps>`
  width: 100%;
  padding: 1.1rem;
  border-radius: 0.8rem;
  font-weight: var(--font-bold);
  font-size: ${({ $fontSize }) => $fontSize ?? "var(--font-body-size)"};
  ${({ $marginTop }) => $marginTop && `margin-top: ${$marginTop};`}
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  animation: ${({ $animation }) => ($animation ? $animation : "none")};

  ${({ $variant, disabled }) => {
    switch ($variant) {
      case "red":
        return css`
          background-color: ${disabled ? "var(--N40)" : "var(--L400)"};
          color: ${disabled ? "var(--N100)" : "white"};
          border: none;
          &:not(:disabled):active {
            background-color: var(--Darkred);
            color: rgba(255, 255, 255, 0.7);
            transform: scale(0.998);
          }
        `
      case "outlined":
        return css`
          background-color: white;
          color: var(--RevBlack);
          border: 1px solid var(--N80);
        `
      case "join":
        return css`
          background-color: white;
          color: ${disabled ? "var(--N200)" : "var(--RevBlack)"};
          border: 1px solid var(--N80);
          font-weight: var(--font-medium);
        `
      case "arrow":
        return css`
          background-color: white;
          color: var(--Purple);
          border: 0.1rem solid var(--Purple);
          height: 3.8rem;
          font-size: var(--font-body-size);
          ${flexCenter}
          gap: 0.2rem;

          &::after {
            content: "";
            background: url("${IconArrowGo}") no-repeat center / 100%;
            width: 2rem;
            height: 2rem;
          }
        `
      case "grey":
        return css`
          background-color: var(--N40);
          color: var(--N400);
          border: none;
        `
      case "disable":
        return css`
          background-color: white;
          color: var(--L40);
          border: 1px solid var(--L40);
        `
      case "pink":
        return css`
          background-color: var(--L20);
          color: var(--L400);
          border: none;
        `
      case "default":
        return css`
          padding: 0;
          height: 3.7rem;
          box-shadow: 0px 0px 10px rgba(246.44, 95.26, 102.39, 0.3);
          border: 1px solid var(--L60);
          color: var(--L400);
          ${flexCenter}
          span {
            margin-left: 0.4rem;
            font-size: var(--caption-small-size);
          }
        `
      case "success":
      case "failed":
        return css`
          padding: 0;
          height: 3.7rem;
          font-size: var(--font-body-size);
          border: 1px solid var(--N80);
          box-shadow: 0 0 0.6rem 0 var(--WSmoke);
          ${flexCenter}
          gap: 0.4rem;
          color: ${$variant === "success" ? "var(--L400)" : "var(--RevBlack)"};
          span {
            margin-left: 0.4rem;
            font-size: var(--caption-small-size);
          }
        `
      case "spinner":
        return css`
          background-color: var(--L20);
          border: none;
          ${flexCenter}
        `
      case "onboarding01":
        return css`
          width: 93%;
          height: 3.6rem;
          margin: -6rem auto 0;
          font-size: var(--caption-size);
          background-color: var(--L400);
          box-shadow: 0px 0px 12px 0px rgba(255, 165, 169, 0.6);
          color: white;
          border: none;
          ${flexCenter}
        `
      case "onboarding02":
        return css`
          width: 85%;
          height: 3.6rem;
          margin: 0 auto;
          background-color: var(--L20);
          box-shadow: 0px 0px 12px 0px rgba(255, 119, 125, 0.6);
          border: none;
          font-size: var(--font-h5-size);
          color: var(--L500);
          font-weight: var(--font-medium);
          ${flexCenter}
        `
      case "uploadImage":
        return css`
          background-color: white;
          color: ${disabled ? "var(--N80)" : "var(--N600)"};
          font-weight: var(--font-medium);
          ${flexCenter}
          &::before {
            content: "";
            display: block;
            background: url("${IconUpload}") no-repeat center / 100%;
            filter: ${disabled ? "invert(100%)" : "invert(8%)"};
            width: 2.1rem;
            height: 2.1rem;
            margin-right: 0.2rem;
          }
        `
      default:
        return ""
    }
  }}
`
