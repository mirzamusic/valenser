import { Link } from "react-router-dom";
import styled from "styled-components";

type PageLayoutProps = {
  title: string;
  children: React.ReactNode;
};

const Wrapper = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
`;

const Card = styled.section`
  width: 100%;
  max-width: 460px;
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 14px 35px rgba(16, 42, 67, 0.15);
`;

const Title = styled.h1`
  margin: 0 0 20px;
  font-size: 28px;
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
`;

export function PageLayout({ title, children }: PageLayoutProps): JSX.Element {
  return (
    <Wrapper>
      <Card>
        <Title>{title}</Title>
        {children}
        <Row>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/reset-password">Reset Password</Link>
        </Row>
      </Card>
    </Wrapper>
  );
}
