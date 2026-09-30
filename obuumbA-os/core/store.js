import fs from "fs/promises";
import path from "path";

export class JsonStore {
  constructor(file) { this.file=file; }
  async init() {
    await fs.mkdir(path.dirname(this.file), {recursive:true});
    try { await fs.access(this.file); }
    catch { await fs.writeFile(this.file, JSON.stringify([], null, 2)); }
  }
  async all() { await this.init(); return JSON.parse(await fs.readFile(this.file, "utf8")); }
  async replace(items) { await this.init(); await fs.writeFile(this.file, JSON.stringify(items, null, 2)); return items; }
  async insert(item) { const items=await this.all(); items.unshift(item); await this.replace(items); return item; }
  async update(id, patch) {
    const items=await this.all(); const i=items.findIndex(x=>x.id===id);
    if(i<0) return null; items[i]={...items[i],...patch,updatedAt:new Date().toISOString()};
    await this.replace(items); return items[i];
  }
}
