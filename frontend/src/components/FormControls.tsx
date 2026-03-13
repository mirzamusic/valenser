import styled from "styled-components";

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
`;

export const Input = styled.input`
  width: 100%;
  border: 1px solid #bcccdc;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 16px;
`;

export const Button = styled.button`
  width: 100%;
  border: 0;
  background: #0b7285;
  color: #fff;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

export const ErrorText = styled.p`
  margin: 0 0 12px;
  color: #c92a2a;
`;

export const SuccessText = styled.p`
  margin: 0 0 12px;
  color: #2b8a3e;
`;
