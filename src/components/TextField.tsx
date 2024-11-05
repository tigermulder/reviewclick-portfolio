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
}: TextFieldProps) => (
  <TextFieldContainer $marginBottom={$marginBottom} $marginTop={$marginTop}>
    <InputWrapper $isError={$isError}>
      <StyledInput
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        $isError={$isError}
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

const InputWrapper = styled.div<{ $isError?: boolean }>`
  display: flex;
  align-items: center;
  border: 1px solid ${({ $isError }) => ($isError ? "red" : "#ddd")};
  background: ${({ $isError }) => ($isError ? "var(--prim-L20)" : "inherit")};
  border-radius: 5px;
  transition: border-color 0.2s ease;
  overflow: hidden;
`

const StyledInput = styled.input<{ $isError?: boolean }>`
  width: 65.5%;
  flex: 1;
  padding: 1.2rem;
  border: none;
  font-size: 14px;
  outline: none;
  background: ${({ $isError }) => ($isError ? "var(--prim-L20)" : "inherit")};
`

const SuffixContainer = styled.div<{ $width: string }>`
  width: ${({ $width }) => $width};
  height: 100%;
  overflow: hidden;
`

const Suffix = styled.div`
  color: #415058;
  font-size: 1.4rem;
  font-weight: 500;
  word-wrap: break-word;
`

const ErrorDescription = styled.p`
  text-align: left;
  color: var(--revu-color);
  font-size: 1.2rem;
  margin-top: 0.5rem;
`

const SuccessDescription = styled.p`
  text-align: left;
  color: var(--success-color);
  font-size: 1.2rem;
  margin-top: 0.5rem;
`
