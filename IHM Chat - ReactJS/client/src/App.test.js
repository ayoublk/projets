import React from 'react';
import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';
import App from './App';
import {expect} from 'chai'

/*test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});*/


it('render without crashing', () => {
	const div = document.createElement('div')
	ReactDOM.render(<App/>, div)
})

it('')
