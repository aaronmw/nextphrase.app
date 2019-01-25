import styled from 'styled-components';

const CategoryLabel = styled.div`
  width: 100%;
  text-align: center;
  opacity: 0.6;
  font-size: 0.5rem;
  text-transform: lowercase;
  margin-bottom: 0.25rem;

  &:not(:first-child) {
    margin-top: 1rem;
  }
`;

export default CategoryLabel;
