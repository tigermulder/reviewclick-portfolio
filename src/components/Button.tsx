import { forwardRef } from "react"
import IconArrowGo from "assets/ico_arr_go.svg?url"
import SuccessIcon from "./SuccessIcon"
import FailedIcon from "./FailedIcon"
import IconCopy from "assets/ico-copy.svg"

import {
  ButtonProps,
  StyledButtonProps,
} from "@/types/component-types/button-type"
import styled, { css } from "styled-components"

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, disabled, $variant, type = "button", $marginTop, onClick },
    ref
  ) => (
    <StyledButton
      ref={ref} // Pass the ref to StyledButton
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
      {$variant !== "spinner" && children}
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
  border-radius: 8px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  ${({ $marginTop }) => $marginTop && `margin-top: ${$marginTop};`}

  ${({ $variant, disabled }) => {
    switch ($variant) {
      case "red":
        return css`
          background-color: ${disabled ? "#FCC0C2" : "var(--revu-color)"};
          color: white;
          border: none;
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
          color: var(--prim-L400);
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
      case "copy":
        return css`
          padding: 0;
          height: 3.3rem;
          font-size: var(--font-bodyM-size);
          font-weight: var(--font-bodyM-weight);
          line-height: var(--font-bodyM-line-height);
          letter-spacing: var(--font-bodyM-letter-spacing);
          background-color: var(--n40-color);
          color: var(--n500-color);
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
          &::before {
            content: "";
            display: block;
            background: url("${IconCopy}") no-repeat center / 100%;
            width: 1.3rem;
            height: 1.3rem;
            margin-right: 0.2rem;
          }
        `
      case "spinner":
        return css`
          background-color: var(--prim-L20);
          color: var(--prim-L400);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;

          &::after {
            content: "";
            width: 1.5rem;
            height: 1.5rem;
            border: 3px solid var(--prim-L400);
            border-top: 3px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `
      case "onboarding01":
        return css`
          width: 93%;
          height: 3.4rem;
          margin: 0 auto;
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
          height: 3.9rem;
          margin: 0 auto;
          background-color: var(--prim-L20);
          box-shadow: 0px 0px 12px 0px rgba(255, 119, 125, 0.6);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: var(--prim-L400);
          font-weight: var(--font-weight-medium);
        `
      default:
        return ""
    }
  }}
`
