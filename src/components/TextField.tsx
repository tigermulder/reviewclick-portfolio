import { TextFieldProps } from "@/types/component-types/text-field-type"
import styled from "styled-components"

const TextField = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  suffix,
  $isError,
  $marginBottom,
  $marginTop,
  $suffixWidth = "31%",
  errorMessage,
  successMessage,
  disabled,
}: TextFieldProps) => (
  <TextFieldContainer $marginBottom={$marginBottom} $marginTop={$marginTop}>
    <InputWrapper $isError={$isError} $disabled={disabled}>
      <StyledInput
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        $isError={$isError}
        disabled={disabled}
      />
      {suffix && (
        <SuffixContainer $width={$suffixWidth}>
          <Suffix>{suffix}</Suffix>
        </SuffixContainer>
      )}
    </InputWrapper>
    {errorMessage && <ErrorDescription>{errorMessage}</ErrorDescription>}
    {!errorMessage && successMessage && (
      <SuccessDescription>{successMessage}</SuccessDescription>
    )}
  </TextFieldContainer>
)

export default TextField

const TextFieldContainer = styled.div<{
  $marginBottom?: string
  $marginTop?: string
}>`
  margin-bottom: ${({ $marginBottom }) => $marginBottom || "0.8rem"};
  ${({ $marginTop }) => $marginTop && `margin-top: ${$marginTop};`}
`

const InputWrapper = styled.div<{ $isError?: boolean; $disabled?: boolean }>`
  display: flex;
  align-items: center;
  border: 1px solid
    ${({ $isError, $disabled }) =>
      $isError ? "red" : $disabled ? "var(--N40)" : "var(--Silver)"};
  background: ${({ $isError, $disabled }) =>
    $isError ? "var(--L20)" : $disabled ? "inherit" : "inherit"};
  border-radius: 5px;
  transition: border-color 0.2s ease-in-out;
  overflow: hidden;
  color: ${({ $isError, $disabled }) =>
    $isError
      ? "var(--RevBlack)"
      : $disabled
        ? "var(--N200)"
        : "var(--RevBlack)"};
`

const StyledInput = styled.input<{ $isError?: boolean }>`
  width: 65.5%;
  flex: 1;
  padding: 1.2rem;
  border: none;
  outline: none;
  background: ${({ $isError }) => ($isError ? "var(--L20)" : "inherit")};
`

const SuffixContainer = styled.div<{ $width: string }>`
  width: ${({ $width }) => $width};
  height: 100%;
  overflow: hidden;
`

const Suffix = styled.div`
  color: var(--N400);
  font-size: var(--font-body-size);
  font-weight: var(--font-light);
  word-wrap: break-word;
`

const ErrorDescription = styled.p`
  text-align: left;
  color: var(--L600);
  font-size: var(--caption-size);
  margin-top: 0.5rem;
`

const SuccessDescription = styled.p`
  text-align: left;
  color: var(--Success);
  font-size: var(--caption-size);
  margin-top: 0.5rem;
`
