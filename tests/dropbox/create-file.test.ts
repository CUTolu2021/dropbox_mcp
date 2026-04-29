import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { setupTestLogger, restoreConsole } from '../utils/test-logger.js';
import { testResultsTracker } from '../utils/test-results-tracker.js';
import { callMcpTool, encodeBase64 } from './test-helpers.js';

describe('Dropbox Create File Operations', () => {
  const FILE_NAME = 'dropbox/create-file.test.ts';

  beforeAll(() => {
    setupTestLogger();
  });

  afterAll(() => {
    restoreConsole();
  });

  beforeEach(() => {
    const testName = expect.getState().currentTestName;
    if (testName) {
      testResultsTracker.registerTest(testName, FILE_NAME);
    }
  });

  afterEach(() => {
    const testName = expect.getState().currentTestName;
    if (testName) {
      const isPassed = !expect.getState().currentTestName?.includes('failed');
      if (isPassed) {
        testResultsTracker.markTestPassed(testName, FILE_NAME);
      }
    }
  });

  it('should create a text file using utf8 content', async () => {
    const response = await callMcpTool('create_file', {
      path: '/proposals/summary.md',
      content: '# Proposal\nThis is plain text content.',
      encoding: 'utf8'
    });

    expect(response).toBeDefined();
    testResultsTracker.addTestDetails(expect.getState().currentTestName!, FILE_NAME, {
      path: '/proposals/summary.md',
      encoding: 'utf8'
    });
  });

  it('should create a binary file using base64 content', async () => {
    const response = await callMcpTool('create_file', {
      path: '/proposals/proposal.docx',
      content: encodeBase64('mock-docx-binary-content'),
      encoding: 'base64'
    });

    expect(response).toBeDefined();
    testResultsTracker.addTestDetails(expect.getState().currentTestName!, FILE_NAME, {
      path: '/proposals/proposal.docx',
      encoding: 'base64'
    });
  });
});
