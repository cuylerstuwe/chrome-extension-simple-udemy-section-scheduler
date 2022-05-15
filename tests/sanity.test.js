// Sanity tests to assert that Javascript and Jest are as quirky as expected (and that special features enabled by Babel are working).

describe("Sanity Tests", () => {
    test("NaN !== NaN?", () => expect(NaN === NaN).toBeFalsy());

    test("Is optional chaining recognized?", () => {

        const twoLevelObj = { first: { second: {data: 1} } };
        
        // Sanity check to make sure that our object and its defined tiers actually exist,
        // and can access data the same as with normal dot notation.
        expect(twoLevelObj?.first?.second?.data).toBe(1);

        // With optional chaining, accessing "fourth" doesn't throw an error, despite "third" being undefined.
        expect(twoLevelObj?.first?.second?.third?.fourth).toBeUndefined();

        // Without optional chaining, accessing "fourth" throws an error, because "third" is undefined (leading to undefined.fourth).
        expect(() => twoLevelObj.first.second.third.fourth).toThrowError();
    });
});