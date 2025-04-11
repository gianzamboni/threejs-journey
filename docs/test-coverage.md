# Test Coverage for ThreeJS Journey

This project uses Vitest with the v8 coverage provider to generate test coverage reports. The coverage configuration helps ensure that our code is adequately tested.

## Running Test Coverage

There are two ways to run test coverage:

### One-time Coverage Report

To generate a single coverage report:

```bash
npm run test:coverage
```

This will run all tests once and generate a coverage report in the terminal and in the `coverage` directory.

### Watch Mode Coverage 

For development, you can run coverage in watch mode:

```bash
npm run test:coverage:watch
```

This will continuously watch your files for changes and update the coverage report accordingly.

## Viewing Coverage Reports

After running the coverage command, you can find the reports in several formats:

1. **Text output in the terminal**: Summary statistics are shown directly in the console.

2. **HTML report**: Open `coverage/index.html` in your web browser for a detailed interactive report.

3. **JSON report**: Available at `coverage/coverage-final.json` for integration with other tools.

## Coverage Thresholds

We've set the following minimum coverage thresholds:

- Statements: 80%
- Branches: 80% 
- Functions: 80%
- Lines: 80%

If coverage falls below these thresholds, the test command will fail.

## What to Cover

Focus on testing:

1. Public API methods and behaviors
2. Edge cases and error conditions
3. Complex business logic

Remember that 100% coverage doesn't mean your code is bug-free. Aim for meaningful tests rather than just high coverage numbers.

## Excluded Files

Some files are excluded from coverage calculations:

- Node modules
- Test setup files
- Test files themselves (*.test.ts)
- Type definition files (*.d.ts)
- Type definition directories

## Tips for Improving Coverage

1. Start with the most critical parts of your application
2. Use TDD (Test-Driven Development) when adding new features
3. When fixing bugs, add tests that would have caught the bug
4. Group related tests with describe blocks for better organization
5. Use parameterized tests for similar test cases with different inputs 