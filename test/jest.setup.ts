// Reset all mocks after each test
afterEach(() => {
    jest.clearAllMocks();
});

// Cleanup after all tests in a file
afterAll(() => {
    jest.resetModules();
});
