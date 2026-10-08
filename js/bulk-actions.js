// ============================================================
// Bulk Actions — إدارة جماعية للمقالات
// ============================================================

export class BulkSelection {
  constructor(onChange) {
    this.selected = new Set();
    this.onChange = onChange;
  }

  toggle(id) {
    if (this.selected.has(id)) this.selected.delete(id);
    else this.selected.add(id);
    this.onChange(this.getSelection());
  }

  isSelected(id) {
    return this.selected.has(id);
  }

  clear() {
    this.selected.clear();
    this.onChange(this.getSelection());
  }

  selectAll(ids) {
    this.selected = new Set(ids);
    this.onChange(this.getSelection());
  }

  getSelection() {
    return Array.from(this.selected);
  }

  count() {
    return this.selected.size;
  }
}

export async function bulkDelete(ids, deleteFn) {
  const results = { success: 0, failed: 0, errors: [] };
  for (const id of ids) {
    try {
      await deleteFn(id);
      results.success++;
    } catch (err) {
      results.failed++;
      results.errors.push({ id, error: err.message });
    }
  }
  return results;
}

export async function bulkUpdate(ids, updateFn, data) {
  const results = { success: 0, failed: 0, errors: [] };
  for (const id of ids) {
    try {
      await updateFn(id, data);
      results.success++;
    } catch (err) {
      results.failed++;
      results.errors.push({ id, error: err.message });
    }
  }
  return results;
}
