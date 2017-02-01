import styled from "styled-components";

const Header = styled.div`
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  justify-content: space-around;
  height: 50px;
  background-color: ${props => props.theme.primary};
  border: 1px solid ${props => props.theme.secondary};
  color: ${props => props.theme.secondary};
`;

export default Header;
