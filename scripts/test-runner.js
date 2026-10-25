// Standalone Node.js Test Runner for CreatorFlow Critical Workflows
import { runCriticalWorkflowTests } from '../src/tests/workflow.test.ts';

try {
  const result = runCriticalWorkflowTests();
  if (result.passed === result.total) {
    console.log('All automated critical workflow assertions succeeded.');
    process.exit(0);
  } else {
    console.error(`Failed ${result.total - result.passed} tests.`);
    process.exit(1);
  }
} catch (e) {
  console.error('Error executing test suite:', e);
  process.exit(1);
}
