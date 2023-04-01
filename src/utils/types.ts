export function assertNever(shouldBeNever: never) {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(shouldBeNever)}`
  );
}
