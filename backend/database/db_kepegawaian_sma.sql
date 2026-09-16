-- ============================================
-- SPMB SMA Muhammadiyah Sokaraja
-- Database Schema (Final Refactored)
-- Single Source of Truth
-- ============================================

CREATE DATABASE IF NOT EXISTS `db_kepegawaian_sma`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `db_kepegawaian_sma`;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- 1. Tabel: pengguna
-- ============================================
CREATE TABLE IF NOT EXISTS `pengguna` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nama` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `whatsapp` VARCHAR(20) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'siswa') NOT NULL DEFAULT 'siswa',
  `status_aktif` TINYINT(1) DEFAULT 1,
  `last_login_at` DATETIME NULL,
  `email_verified_at` DATETIME NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  
  INDEX `idx_role` (`role`),
  INDEX `idx_email` (`email`),
  INDEX `idx_status_aktif` (`status_aktif`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. Tabel: log_verifikasi
-- ============================================
CREATE TABLE IF NOT EXISTS `log_verifikasi` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `admin_id` INT NULL,
  `status_sebelum` VARCHAR(50) NOT NULL,
  `status_sesudah` VARCHAR(50) NOT NULL,
  `catatan` TEXT NULL,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` VARCHAR(255) NULL,
  
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT `fk_log_admin` FOREIGN KEY (`admin_id`) REFERENCES `pengguna` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. Tabel: login_attempts
-- ============================================
CREATE TABLE IF NOT EXISTS `login_attempts` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `ip_address` VARCHAR(45) NOT NULL,
  `attempted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`),
  INDEX `idx_ip` (`ip_address`),
  INDEX `idx_attempted_at` (`attempted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. Tabel: token_pengguna
-- ============================================
CREATE TABLE IF NOT EXISTS `token_pengguna` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(255) NOT NULL DEFAULT '0',
  `user_id` int NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `pengguna` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================
-- 5. Tabel: jabatans
-- ============================================
CREATE TABLE IF NOT EXISTS `jabatans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nama` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `kode` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `jabatans_kode_unique` (`kode`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. Tabel: mata_pelajarans
-- ============================================
CREATE TABLE IF NOT EXISTS `mata_pelajarans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `kode` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mata_pelajarans_kode_unique` (`kode`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. Tabel: pegawais
-- ============================================
CREATE TABLE IF NOT EXISTS `pegawais` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nama` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `foto` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nomor_ktp` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nomor_nbm` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tempat_lahir` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal_lahir` date NOT NULL,
  `jenis_kelamin` enum('L','P') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('Belum_Menikah','Menikah','Duda') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `alamat_rumah` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nomor_telephone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `alamat_email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pendidikan_terakhir` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nama_kampus` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jurusan` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tahun_lulus` year DEFAULT NULL,
  `jabatan` bigint unsigned NOT NULL,
  `mapel` bigint unsigned DEFAULT NULL,
  `nomor_bpjs` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kontak_darurat` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pegawais_nomor_ktp_unique` (`nomor_ktp`),
  UNIQUE KEY `pegawais_nomor_nbm_unique` (`nomor_nbm`),
  UNIQUE KEY `pegawais_alamat_email_unique` (`alamat_email`),
  UNIQUE KEY `pegawais_nomor_bpjs_unique` (`nomor_bpjs`),
  KEY `pegawais_jabatan_id_foreign` (`jabatan`) USING BTREE,
  KEY `pegawais_mapel_id_foreign` (`mapel`) USING BTREE,
  CONSTRAINT `pegawais_jabatan_id_foreign` FOREIGN KEY (`jabatan`) REFERENCES `jabatans` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pegawais_mapel_id_foreign` FOREIGN KEY (`mapel`) REFERENCES `mata_pelajarans` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Seed: Default Admin Account
-- ============================================
INSERT INTO `pengguna` (`nama`, `email`, `whatsapp`, `password`, `role`)
VALUES (
  'Administrator',
  'adminsma@gmail.com',
  '08123456789',
  '$2y$10$OeOySJqnrqShFOY5JotWk.CoNvbuK8fHzv1/.GvPZU9bZDK3S.wpq',
  'admin'
) ON DUPLICATE KEY UPDATE `id`=`id`;

SET FOREIGN_KEY_CHECKS = 1;
