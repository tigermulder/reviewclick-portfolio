import { forwardRef } from "react"
import IconArrowGo from "assets/ico_arr_go.svg?url"
import SuccessIcon from "./SuccessIcon"
import FailedIcon from "./FailedIcon"
import IconUpload from "assets/ico_upload.svg"

import {
  ButtonProps,
  StyledButtonProps,
} from "@/types/component-types/button-type"
import styled, { css, keyframes } from "styled-components"

// Spinner css
const fade = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`
const Spinner = styled.div`
  position: relative;
  width: 1.5rem;
  height: 1.5rem;
`
const Dot = styled.div`
  position: absolute;
  top: -0.3rem;
  left: 50%;
  width: 0.15rem;
  height: 0.6rem;
  background-color: var(--prim-L100);
  border-radius: 0.15rem;
  transform-origin: center 0.95rem;
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
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, disabled, $variant, type = "button", $marginTop, onClick },
    ref
  ) => (
    <StyledButton
      ref={ref}
      disabled={disabled || $variant === "spinner"}
      $variant={$variant}
      type={type}
      onClick={onClick}
      $marginTop={$marginTop}
    >
      {/* success와 failed일 경우 아이콘 렌더링 */}
      {$variant === "success" && (
        <SuccessIcon
          backgroundColor="var(--revu-color)"
          filter={true}
          filterColor="rgba(245, 46, 54, 0.3)"
        />
      )}
      {$variant === "failed" && (
        <FailedIcon backgroundColor="var(--primary-color)" filter={false} />
      )}
      {/* spinner 변형일 경우 Spinner 렌더링 */}
      {$variant === "spinner" ? (
        <Spinner>
          <Dot />
          <Dot />
          <Dot />
          <Dot />
          <Dot />
          <Dot />
          <Dot />
          <Dot />
        </Spinner>
      ) : (
        children
      )}
    </StyledButton>
  )
)

export default Button

const StyledButton = styled.button.attrs<StyledButtonProps>((props) => ({
  "data-variant": props.$variant,
  disabled: props.disabled,
}))<StyledButtonProps>`
  width: 100%;
  padding: 1.2rem;
  border-radius: 0.8rem;
  font-weight: var(--font-weight-bold);
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  ${({ $marginTop }) => $marginTop && `margin-top: ${$marginTop};`}

  ${({ $variant, disabled }) => {
    switch ($variant) {
      case "red":
        return css`
          background-color: ${disabled
            ? "var(--n40-color)"
            : "var(--revu-color)"};
          color: ${disabled ? "var(--n100-color)" : "var(--white)"};
          border: none;
          &:active {
            background-color: var(--darkred);
            color: rgba(255, 255, 255, 0.7);
            transform: scale(0.998);
          }
        `
      case "outlined":
        return css`
          background-color: transparent;
          color: var(--primary-color);
          border: 1px solid var(--n80-color);
        `
      case "join":
        return css`
          background-color: var(--white);
          color: ${disabled ? "var(--n200-color)" : "var(--primary-color)"};
          border: 1px solid var(--n80-color);
          font-weight: 500;
        `
      case "arrow":
        return css`
          background-color: var(--white);
          color: var(--prim-L100);
          border: 0.1rem solid var(--prim-L100);
          height: 3.8rem;
          font-size: var(--font-title-size);
          font-weight: var(--font-title-weight);
          line-height: var(--font-title-line-height);
          letter-spacing: var(--font-title-letter-spacing);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.2rem;
          color: var(--prim-L100);

          &::after {
            content: "";
            background: url("${IconArrowGo}") no-repeat center / 100%;
            width: 2rem;
            height: 2rem;
          }
        `
      case "grey":
        return css`
          background-color: var(--n40-color);
          color: var(--n400-color);
          border: none;
        `
      case "disable":
        return css`
          background-color: var(--white);
          color: var(--prim-L40);
          border: 1px solid var(--prim-L40);
        `
      case "pink":
        return css`
          background-color: var(--prim-L20);
          color: var(--prim-L500);
          border: none;
        `
      case "default":
        return css`
          padding: 0;
          height: 3.7rem;
          font-size: var(--font-bodyM-size);
          font-weight: var(--font-bodyM-weight);
          line-height: var(--font-bodyM-line-height);
          letter-spacing: var(--font-bodyM-letter-spacing);
          box-shadow: 0px 0px 10px rgba(246.44, 95.26, 102.39, 0.3);
          border: 1px solid var(--prim-L60);
          color: var(--revu-color);
          display: flex;
          align-items: center;
          justify-content: center;
          span {
            margin-left: 0.4rem;
            font-size: var(--font-callout-small-size);
            font-weight: var(--font-callout-small-weight);
            line-height: var(--font-callout-small-line-height);
            letter-spacing: var(--font-callout-small-letter-spacing);
          }
        `
      case "success":
        return css`
          padding: 0;
          height: 3.7rem;
          font-size: var(--font-bodyM-size);
          font-weight: var(--font-bodyM-weight);
          line-height: var(--font-bodyM-line-height);
          letter-spacing: var(--font-bodyM-letter-spacing);
          color: var(--revu-color);
          border: 1px solid var(--n80-color);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 0.6rem 0 var(--whitesmoke);
          gap: 0.4rem;
          span {
            margin-left: 0.4rem;
            font-size: var(--font-callout-small-size);
            font-weight: var(--font-callout-small-weight);
            line-height: var(--font-callout-small-line-height);
            letter-spacing: var(--font-callout-small-letter-spacing);
          }
        `
      case "failed":
        return css`
          padding: 0;
          height: 3.7rem;
          font-size: var(--font-bodyM-size);
          font-weight: var(--font-bodyM-weight);
          line-height: var(--font-bodyM-line-height);
          letter-spacing: var(--font-bodyM-letter-spacing);
          border: 1px solid var(--n80-color);
          color: var(--primary-color);
          box-shadow: 0 0 0.6rem 0 var(--whitesmoke);
          gap: 0.4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          span {
            margin-left: 0.4rem;
            font-size: var(--font-callout-small-size);
            font-weight: var(--font-callout-small-weight);
            line-height: var(--font-callout-small-line-height);
            letter-spacing: var(--font-callout-small-letter-spacing);
          }
        `
      case "spinner":
        return css`
          background-color: var(--prim-L20);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          ${Spinner}
          ${Dot}
        `
      case "onboarding01":
        return css`
          width: 93%;
          height: 3.6rem;
          margin: -6rem auto 0;
          font-size: 1.2rem;
          background-color: var(--revu-color);
          box-shadow: 0px 0px 12px 0px rgba(255, 165, 169, 0.6);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
        `
      case "onboarding02":
        return css`
          width: 85%;
          height: 3.6rem;
          margin: 0 auto;
          background-color: var(--prim-L20);
          box-shadow: 0px 0px 12px 0px rgba(255, 119, 125, 0.6);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: var(--prim-L500);
          font-weight: var(--font-weight-medium);
        `
      case "uploadImage":
        return css`
          background: var(--white);
          color: ${disabled ? "var(--n80-color)" : "var(--n600-color)"};
          font-size: 1.4rem;
          font-weight: var(--font-weight-medium);
          display: flex;
          align-items: center;
          justify-content: center;
          &::before {
            content: "";
            display: block;
            background: url("${IconUpload}") no-repeat center / 100%;
            filter: ${disabled
              ? "invert(100%) sepia(0%) saturate(0%) hue-rotate(179deg) brightness(100%) contrast(100%);"
              : "invert(8%) sepia(0%) saturate(0%) hue-rotate(163deg) brightness(100%) contrast(100%)"};
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
