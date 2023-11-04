type Data = Record<string, unknown>;
type Appendable = string | number | any[] | Record<string, unknown>;

const isNode = (): boolean => typeof window === "undefined";

export default class JSONStore {
  private path: string;
  private data: Data;

  constructor(path: string) {
    this.path = path;
    this.data = {};
    this.load();
  }

  remove(key: string): void {
    delete this.data[key];
  }

  clear(): void {
    this.data = {};
  }

  async destroy(): Promise<void> {
    if (isNode()) {
      try {
        const fs = await import("fs");
        await fs.promises.truncate(this.path, 0);
      } catch (err) {
        console.error("Error truncating file:", err);
        throw err; // Rethrow the error after logging (or handle it as needed)
      }
    } else {
      return Promise.resolve().then(() => {
        try {
          localStorage.removeItem(this.path);
        } catch (err) {
          console.error("Error removing from localStorage:", err);
          throw err; // Again, handle or rethrow the error as appropriate
        }
      });
    }
  }

  has(key: string): boolean {
    return key in this.data;
  }

  set(key: string, value: any): void {
    this.data[key] = value;
  }

  append(key: string, value: Appendable): void {
    if (key in this.data) {
      const existingValue = this.data[key];

      if (typeof existingValue !== typeof value) {
        throw new Error(
          `Type mismatch: cannot append ${typeof value} to ${typeof existingValue}`
        );
      }

      if (Array.isArray(existingValue) && Array.isArray(value)) {
        this.data[key] = existingValue.concat(value);
      } else if (
        typeof existingValue === "object" &&
        typeof value === "object"
      ) {
        this.data[key] = { ...existingValue, ...value };
      } else if (
        typeof existingValue === "string" &&
        typeof value === "string"
      ) {
        this.data[key] = existingValue + value;
      } else if (
        typeof existingValue === "number" &&
        typeof value === "number"
      ) {
        this.data[key] = existingValue + value;
      } else {
        throw new Error(`Cannot append: Unsupported type for append operation`);
      }
    } else {
      this.data[key] = value;
    }
  }

  get(key: string): any {
    return this.data[key];
  }

  async load(): Promise<void> {
    if (isNode()) {
      // Dynamically import 'fs' module only if in Node.js environment.
      const fs = await import("fs");
      try {
        const rawData = fs.readFileSync(this.path, { encoding: "utf8" });
        this.data = JSON.parse(rawData);
      } catch (err) {
        console.log("Creating new store");
        this.save();
      }
    } else {
      // Use localStorage in a browser environment
      const rawData = localStorage.getItem(this.path);
      this.data = rawData ? JSON.parse(rawData) : {};
    }
  }

  async save(): Promise<void> {
    if (isNode()) {
      // Dynamically import 'fs' module only if in Node.js environment.
      const fs = await import("fs");
      fs.writeFileSync(this.path, JSON.stringify(this.data, null, 2), {
        encoding: "utf8",
      });
    } else {
      // Use localStorage in a browser environment
      localStorage.setItem(this.path, JSON.stringify(this.data));
    }
  }
  download(): void {
    if (isNode()) {
      throw new Error(
        "Download method is not available in Node.js environment"
      );
    }

    const dataStr = JSON.stringify(this.data, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Create a new anchor element dynamically
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", url);
    downloadAnchorNode.setAttribute("download", this.path.endsWith(".json") ? this.path : this.path + ".json");

    // Append anchor to the body, trigger download, and then remove the anchor
    document.body.appendChild(downloadAnchorNode); // Required for Firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
}
