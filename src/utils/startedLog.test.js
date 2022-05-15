jest.spyOn(global.console, "log").mockImplementation();

test("When the startedLog module is imported, it logs 'Started.' to the console as a side-effect.", async () => {
    // ES-style static imports in a test file are hoisted by Jest, unless they're mocked.
    // startedLog is therefore imported dynamically, as we want to make sure we install the spy on console.log before startedLog runs it as a side-effect of being imported.
    await import("./startedLog");
    expect(console.log).toBeCalledWith("Started.");
});