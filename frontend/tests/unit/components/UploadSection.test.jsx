import { render, screen, fireEvent } from '@testing-library/react';
import UploadSection from '../../../src/components/UploadSection';

describe('UploadSection', () => {
  test('renders upload instructions', () => {
    render(<UploadSection onUpload={() => {}} loading={false} error={null} />);
    expect(screen.getByText(/Drop your CV here/i)).toBeInTheDocument();
  });

  test('displays error message', () => {
    render(<UploadSection onUpload={() => {}} loading={false} error="Upload failed" />);
    expect(screen.getByText(/Upload failed/i)).toBeInTheDocument();
  });

  test('validates file type', () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    window.alert = jest.fn();

    render(<UploadSection onUpload={() => {}} loading={false} error={null} />);
    const input = screen.getByRole('textbox', { hidden: true });
    fireEvent.change(input, { target: { files: [file] } });

    expect(window.alert).toHaveBeenCalledWith('Please upload a PDF or DOCX file');
  });
});

