/**
 * Un `localStorage` de mémoire, pour les lots de tests qui s’exécutent hors
 * navigateur. `broken` simule un stockage refusé (navigation privée, quota).
 */
export class MemStorage {
  private map = new Map<string, string>();

  broken = false;

  getItem(key: string) {
    if (this.broken) throw new Error('accès interdit');
    return this.map.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    if (this.broken) throw new Error('quota dépassé');
    this.map.set(key, value);
  }

  removeItem(key: string) {
    this.map.delete(key);
  }

  clear() {
    this.map.clear();
  }
}
