import 'whatwg-fetch';
import '@testing-library/jest-dom';

// Mock FileReader
class MockFileReader {
  readAsDataURL(blob) {
    setTimeout(() => {
      this.onload({ target: { result: 'data:image/png;base64,mockBase64Data' } });
    }, 0);
  }
}

// Mock window.URL.createObjectURL
window.URL.createObjectURL = jest.fn(() => 'mock-url');

// Replace the global FileReader with our mock
global.FileReader = MockFileReader;

// Mock window.alert
global.alert = jest.fn();

// Setup fetch mock
global.fetch = jest.fn();