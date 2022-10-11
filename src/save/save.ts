import { saveAs } from "file-saver";
import { logText } from "../log";
import { Book, saveType } from "../main/Book";
import { Chapter } from "../main/Chapter";
import { Status } from "../main/main";
import { enableDebug } from "../setting";
import { SaveOptions } from "./options";
import { EPUB } from "./epub";
import { TXT } from "./txt";
import { Raw } from "./raw";
import { Json } from "./json";

export class SaveBook {
  private saveType: saveType;
  private txt: TXT;
  private epub: EPUB;
  private raw!: Raw;
  private json: Json;

  public constructor(book: Book, streamZip: boolean, options?: SaveOptions) {
    const _options = {};
    if (options !== undefined) {
      Object.assign(_options, options);
    }
    if (book.saveOptions !== undefined) {
      Object.assign(_options, book.saveOptions);
    }

    this.saveType = book.saveType;

    this.txt = new TXT(book, _options);
    this.epub = new EPUB(book, streamZip, _options);
    if (this.saveType.raw instanceof Object) {
      this.raw = new Raw(book);
    }
    this.json = new Json(book, _options);
  }

  private static saveLog() {
    saveAs(
      new Blob([logText], { type: "text/plain; charset=UTF-8" }),
      "debug.log"
    );
  }

  public async addChapter(chapter: Chapter) {
    await this.epub.addChapter(chapter);

    if (!enableDebug.value) {
      chapter.contentRaw = null;
      chapter.contentHTML = null;
      chapter.contentImages = null;
    }
    if (chapter.contentImages && chapter.contentImages.length !== 0) {
      for (const attachment of chapter.contentImages) {
        attachment.status = Status.saved;
        if (!enableDebug.value) {
          attachment.Blob = null;
        }
      }
    }
    chapter.status = Status.saved;
  }

  public async save() {
    if (this.saveType.txt) {
      this.saveTxt();
    }
    if (enableDebug.value) {
      SaveBook.saveLog();
    }
    if (this.saveType.epub) {
      await this.saveEpub();
    }
    if (this.saveType.raw instanceof Object) {
      await this.saveRaw();
    }
    if (this.saveType.json) {
      await this.saveJSON()
    }
  }

  private saveTxt() {
    this.txt.saveTxt();
  }

  private async saveEpub() {
    await this.epub.saveEpub();
  }

  private async saveRaw() {
    await this.raw.saveRaw();
  }

  private async saveJSON() {
    await this.json.saveJSON();
  }
}
