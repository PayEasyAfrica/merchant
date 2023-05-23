export class Util {
  static classNames(...names: (string | undefined)[]) {
    return names.filter((name) => !!name).join(" ");
  }
}
