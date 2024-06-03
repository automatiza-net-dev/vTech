import { injectable } from "inversify";

@injectable()
export class makeApiURL {
  make(path: string) {
    return `${process.env.NEXT_PUBLIC_API}/${path}`;
  }
}