import IcoChkOff from "assets/ico_chk_off.svg?react"
import IcoChk from "assets/ico_chk.svg?react"
import {
  CheckboxProps,
  CheckboxCustomProps,
  CheckboxTextProps,
} from "@/types/component-types/check-box-type"
import styled from "styled-components"

const Checkbox = ({
  label,
  checked,
  onChange,
  $isTitle = false,
}: CheckboxProps) => {
  return (
    <CheckboxLabel $isTitle={$isTitle} checked={checked}>
      <CheckboxInput type="checkbox" checked={checked} onChange={onChange} />
      <CheckboxCustom checked={checked}>
        {$isTitle ? <IcoChk /> : <IcoChkOff />}
      </CheckboxCustom>
      <CheckboxText $isTitle={$isTitle} checked={checked}>
        {label}
      </CheckboxText>
    </CheckboxLabel>
  )
}

export default Checkbox

const CheckboxLabel = styled.label<{ $isTitle?: boolean; checked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  ${({ $isTitle, checked }) =>
    $isTitle &&
    `
    padding: 1.1rem 1.5rem;
    border: 1px solid ${checked ? "var(--revu-color)" : "var(--n80-color)"};
    border-radius: 0.5rem;
    background-color: ${
      checked ? "var(--light-primary-color)" : "var(--white)"
    };
    color: ${checked ? "var(--primary-color)" : "var(--n600-color)"};
    transition: border-color 0.14s ease-in-out;

    &:hover {
      border-color: ${checked ? "var(--revu-color)" : "var(--n80-color)"};
    }
    ${
      checked &&
      `
      border-color: var(--revu-color);
    `
    }
  `}
`

const CheckboxInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  z-index: 2;
`

const CheckboxCustom = styled.span<CheckboxCustomProps>`
  width: 2rem;
  height: 2rem;
  margin-right: 0.8rem;
  position: relative;

  svg {
    width: 2rem;
    height: 2rem;

    color: ${({ checked }) =>
      checked ? "var(--primary-color)" : "var(--whitesmoke)"};
    .all-check {
      color: ${({ checked }) =>
        checked ? "var(--revu-color)" : "var(--n100-color)"};
      transition: color 0.14s ease-in-out;
    }
    .check-fill {
      color: ${({ checked }) => (checked ? "var(--white)" : "var(--silver)")};
    }
  }
`

const CheckboxText = styled.span<Partial<CheckboxTextProps>>`
  font-size: ${({ $isTitle }) =>
    $isTitle ? "var(--font-title-size)" : "var(--font-caption-size)"};
  font-weight: ${({ $isTitle }) =>
    $isTitle ? "var(--font-title-weight)" : "normal"};
  line-height: ${({ $isTitle }) =>
    $isTitle ? "var(--font-title-line-height)" : "normal"};
  letter-spacing: ${({ $isTitle }) =>
    $isTitle ? "var(--font-title-letter-spacing)" : "normal"};
  color: ${({ $isTitle, checked }) =>
    $isTitle
      ? checked
        ? "var(--revu-color)"
        : "var(--n100-color)"
      : "var(--n600-color)"};
  transition: color 0.14s ease-in-out;
`
