export class Loger {
  static sucess(message: string) {
    console.log(`\x1b[32m%s\x1b[0m`, message);
  }
  static error(message: string) {
    console.log(`\x1b[31m%s\x1b[0m`, message);
  }
  static warning(message: string) {
    console.log(`\x1b[33m%s\x1b[0m`, message);
  }
}
