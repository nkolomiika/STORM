type NamedHost = { id: number; host: string; origin?: string };

/** Индекс потомков и вложенных хостов за O(число меток + число связей).
 * Сохраняет порядок входного списка и прежнюю семантику: все уровни потомков,
 * сравнение без учёта регистра; служебный IP-хост не делает строку вложенной.
 */
export function buildHostIndex<T extends NamedHost>(hosts: readonly T[]) {
  const byName = new Map<string, T[]>();
  const descendants = new Map<number, T[]>();
  const nestedIds = new Set<number>();
  for (const host of hosts) {
    const name = host.host.toLowerCase();
    const group = byName.get(name) ?? [];
    group.push(host);
    byName.set(name, group);
  }
  for (const host of hosts) {
    const name = host.host.toLowerCase();
    for (let dot = name.indexOf("."); dot !== -1; dot = name.indexOf(".", dot + 1)) {
      for (const parent of byName.get(name.slice(dot + 1)) ?? []) {
        if (parent.id === host.id) continue;
        const children = descendants.get(parent.id) ?? [];
        children.push(host);
        descendants.set(parent.id, children);
        if (parent.origin !== "ip") nestedIds.add(host.id);
      }
    }
  }
  return { descendants, nestedIds };
}
