import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: "Avenir Next", "Segoe UI", sans-serif;
    color: #102a43;
    background: linear-gradient(160deg, #f0f4f8 0%, #d9e2ec 100%);
    min-height: 100vh;
  }

  a {
    color: #0b7285;
    text-decoration: none;
  }

  button {
    font: inherit;
  }
`;
