import { saveAs } from "file-saver";
import { log } from "../log";
import { Book } from "../main/Book";
import { Options, SaveOptions } from "./options";

export class Json extends Options {
  private readonly book: Book;
  private readonly saveFileNameBase: string;

  public constructor(book: Book, options?: SaveOptions) {
    super();
    this.book = book;
    this.saveFileNameBase = `[${this.book.author}]${this.book.bookname}`;

    if (options) {
      Object.assign(this, options);
    }
  }

  public saveJSON() {
    log.info("[save]保存JSON文件");
    // 设置换行符为 CRLF，兼容旧版本Windows。
    const savedText = JSON.stringify(this.book, null, '  ');
    saveAs(
      new Blob([savedText], { type: "text/plain;charset=utf-8" }),
      `${this.saveFileNameBase}.json`
    );
  }
}
