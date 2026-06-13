const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

//data
const { mapel, jabatan, roles, rootUser, permission } = require("../public/data");

async function seed() {
  console.log("🌱 Seeding database...\n");

  // PERMISSIONS
  for (const p of permission) {
    await prisma.permission.upsert({
      where: { nama: p.nama },
      update: {},
      create: p,
    });
  }
  console.log(`✅ ${permission.length} permission dibuat`);

  // ROLES
  const adminRole = await prisma.role.upsert({
    where: { nama: "ADMIN" },
    update: {},
    create: { nama: "ADMIN", deskripsi: "Administrator" },
  });
  const managerRole = await prisma.role.upsert({
    where: { nama: "MANAGER" },
    update: {},
    create: { nama: "MANAGER", deskripsi: "Manager" },
  });
  const pegawaiRole = await prisma.role.upsert({
    where: { nama: "PEGAWAI" },
    update: {},
    create: { nama: "PEGAWAI", deskripsi: "Pegawai" },
  });
  console.log("✅ 3 roles dibuat");

  const allPerms = await prisma.permission.findMany();
  const p = (nama) => allPerms.find((x) => x.nama === nama);

  for (const perm of allPerms) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: adminRole.id, permissionId: perm.id },
      },
      update: {},
      create: { roleId: adminRole.id, permissionId: perm.id },
    });
  }
  for (const nama of [
    "pegawai:read",
    "pegawai:update",
    "jabatan:read",
    "departemen:read",
    "user:read",
  ]) {
    const perm = p(nama);
    if (perm)
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: managerRole.id,
            permissionId: perm.id,
          },
        },
        update: {},
        create: { roleId: managerRole.id, permissionId: perm.id },
      });
  }
  for (const nama of ["pegawai:read", "jabatan:read", "departemen:read"]) {
    const perm = p(nama);
    if (perm)
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: pegawaiRole.id,
            permissionId: perm.id,
          },
        },
        update: {},
        create: { roleId: pegawaiRole.id, permissionId: perm.id },
      });
  }
  console.log("✅ Role permissions dikonfigurasi");

  // mapel & Jabatan
  for (const m of mapel) {
    await prisma.mataPelajaran.upsert({
      where: { kode: m.kode },
      update: {},
      create: m,
    });
  }
  console.log(`${mapel.length} mapel dibuat`);

  for (const j of jabatan) {
    await prisma.jabatan.upsert({
      where: { kode: j.kode },
      update: {},
      create: j,
    });
  }
  console.log(`${jabatan.length} jabatan dibuat`);

  // Users
  const hashed = await bcrypt.hash(rootUser.password, 12);
  await prisma.user.upsert({
    where: { username: rootUser.username },
    update: {},
    create: {
      username: rootUser.username,
      email: rootUser.email,
      password: hashed,
      roleId: adminRole.id,
    },
  });
  console.log(`Root User dibuat (${rootUser.username} / ${rootUser.password})`);
  console.log("\n🎉 Seeding selesai!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
