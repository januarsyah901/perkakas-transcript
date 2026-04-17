# Perkakas YT

Tools untuk transkripsi YouTube dengan AI.

## Versioning & Release Management

Proyek ini menggunakan sistem versioning otomatis yang terintegrasi dengan git.

### Command Versioning

Tersedia 3 command untuk versioning:

#### 1. Major Version (X.0.0)
Untuk perubahan besar yang tidak backward compatible.
```bash
npm run version:major -- "Deskripsi perubahan besar"
```

#### 2. Minor Version (0.X.0)
Untuk fitur baru yang backward compatible.
```bash
npm run version:minor -- "Deskripsi fitur baru"
```

#### 3. Patch Version (0.0.X)
Untuk bug fixes dan improvement kecil.
```bash
npm run version:patch -- "Deskripsi fix"
```

### Contoh Penggunaan

```bash
# Release bug fix v1.0.1
npm run version:patch -- "Fix: transcript parsing issue"

# Release fitur baru v1.1.0
npm run version:minor -- "Add: support for playlist transcription"

# Release breaking change v2.0.0
npm run version:major -- "Refactor: new API structure for better performance"
```

### Apa yang dilakukan secara otomatis?

Setiap command versioning akan:
1. ✅ Update version di `package.json`
2. ✅ Create entry di `CHANGELOG.md`
3. ✅ Create release note di `RELEASES.md`
4. ✅ Commit perubahan dengan git
5. ✅ Create git tag (v1.0.1, v1.1.0, dst)

### Push ke Repository

Setelah menjalankan command versioning, push perubahan ke repository:

```bash
# Push commits dan tags
git push origin main --tags
```

Atau jika hanya push tanpa tags:
```bash
git push origin main
```

### Melihat Release History

- **CHANGELOG.md** - Detailed changelog dengan tanggal
- **RELEASES.md** - Release notes yang lebih readable

### Current Version

Version saat ini dapat dilihat di `package.json` atau dengan command:
```bash
npm pkg get version
```

---

**Setup awal sudah selesai!** Mulai gunakan command versioning di atas untuk mengelola release project.
