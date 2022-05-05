import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import {MemoryRouter} from "react-router-dom";

test('renders the tomify logo', () => {
  render(<MemoryRouter>
    <App/>
  </MemoryRouter>);
  const logo = screen.getByAltText("tomify-logo");
  expect(logo).toBeInTheDocument();
});
