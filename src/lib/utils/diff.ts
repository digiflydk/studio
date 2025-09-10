
// A very basic diff function to detect removed top-level keys
export function simpleDiff(base: Record<string, any>, patch: Record<string, any>) {
    const added: Record<string, any> = {};
    const removed: Record<string, any> = {};
    const changed: Record<string, any> = {};

    for (const key in patch) {
        if (!(key in base)) {
            added[key] = patch[key];
        } else if (JSON.stringify(base[key]) !== JSON.stringify(patch[key])) {
            changed[key] = patch[key];
        }
    }
    
    for (const key in base) {
        if (!(key in patch)) {
            removed[key] = base[key];
        }
    }

    return { added, removed, changed };
}
