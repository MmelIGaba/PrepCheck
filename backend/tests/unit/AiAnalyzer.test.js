const { parseCV } = require('../../utils/cvParser');
const fs = require('fs');

describe('CV Parser', () => {
  test('parse PDF correctly', async () => {
    const buffer = fs.readFileSync('./tests/fixtures/sample.pdf');
    const text = await parseCV({ buffer, mimetype: 'application/pdf' });
    expect(text).toMatch(/Experience|Education/);
  });

  test('parse DOCX correctly', async () => {
    const buffer = fs.readFileSync('./tests/fixtures/sample.docx');
    const text = await parseCV({ buffer, mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    expect(text).toMatch(/Experience|Education/);
  });

  test('throws error for unsupported file', async () => {
    await expect(parseCV({ buffer: Buffer.from(''), mimetype: 'text/plain' }))
      .rejects
      .toThrow('Unsupported file type');
  });
});

