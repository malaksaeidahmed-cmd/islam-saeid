// ============================================================
// Draft Manager — Auto-save every 30 seconds
// ============================================================

export class DraftManager {
  constructor(options) {
    this.getFormData = options.getFormData;       // () => Object
    this.getDraftId = options.getDraftId;         // () => string | null
    this.setDraftId = options.setDraftId;         // (id) => void
    this.onSaveSuccess = options.onSaveSuccess;   // (id, timestamp) => void
    this.onSaveError = options.onSaveError;       // (error) => void
    this.onStatusChange = options.onStatusChange; // ('saving' | 'saved' | 'idle' | 'error') => void
    this.intervalMs = options.intervalMs || 30000;
    this.saveFn = options.saveFn;                 // async (draftId, data) => newId

    this.timer = null;
    this.lastSavedHash = null;
    this.isSaving = false;
    this.isDirty = false;
    this.enabled = false;
  }

  // Compute simple hash to detect changes
  hash(data) {
    try {
      return JSON.stringify(data);
    } catch (_) {
      return String(Date.now());
    }
  }

  markDirty() {
    if (!this.enabled) return;
    this.isDirty = true;
    if (this.onStatusChange) this.onStatusChange('dirty');
  }

  start() {
    if (this.enabled) return;
    this.enabled = true;
    this.timer = setInterval(() => this.tick(), this.intervalMs);
    console.log('[DraftManager] Started (interval:', this.intervalMs, 'ms)');
  }

  stop() {
    this.enabled = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    console.log('[DraftManager] Stopped');
  }

  async tick() {
    if (!this.enabled || this.isSaving) return;
    if (!this.isDirty) return;

    const data = this.getFormData ? this.getFormData() : null;
    if (!data) return;

    // Skip empty drafts (no title & no content)
    const hasContent = (data.title && data.title.trim()) ||
                       (data.content && data.content.trim()) ||
                       (data.excerpt && data.excerpt.trim());
    if (!hasContent) return;

    const currentHash = this.hash(data);
    if (currentHash === this.lastSavedHash) {
      this.isDirty = false;
      return;
    }

    await this.saveNow(data, currentHash);
  }

  async saveNow(data = null, hash = null) {
    if (this.isSaving) return;
    this.isSaving = true;
    if (this.onStatusChange) this.onStatusChange('saving');

    try {
      const draftId = this.getDraftId ? this.getDraftId() : null;
      const formData = data || (this.getFormData ? this.getFormData() : {});
      const currentHash = hash || this.hash(formData);

      const newId = await this.saveFn(draftId, formData);
      if (newId && this.setDraftId) this.setDraftId(newId);

      this.lastSavedHash = currentHash;
      this.isDirty = false;

      if (this.onSaveSuccess) this.onSaveSuccess(newId, Date.now());
      if (this.onStatusChange) this.onStatusChange('saved');
      console.log('[DraftManager] Saved draft:', newId);
    } catch (err) {
      console.error('[DraftManager] Save error:', err);
      if (this.onSaveError) this.onSaveError(err);
      if (this.onStatusChange) this.onStatusChange('error');
    } finally {
      this.isSaving = false;
    }
  }

  // Force save immediately (e.g. before leaving page)
  forceSave() {
    const data = this.getFormData ? this.getFormData() : null;
    if (!data) return;
    return this.saveNow(data);
  }

  // Reset hash (after manual clear/save)
  resetHash() {
    this.lastSavedHash = null;
    this.isDirty = false;
    if (this.onStatusChange) this.onStatusChange('idle');
  }
}
