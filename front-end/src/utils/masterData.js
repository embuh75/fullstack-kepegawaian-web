import { masterData } from "../api/pegawai";

export const getMapel = async () => {
  try {
    const res = await masterData.getMapel();
    return res;
  } catch (err) {
    console.err(err);
  }
};

export const getJabatan = async () => {
  try {
    const res = await masterData.getJabatan();
    return res;
  } catch (err) {
    console.err(err);
  }
};

// PEGAWAI role only allows "Belum_Menikah" / "Menikah" per validator
// (schema also defines "Duda" but it is rejected by express-validator
// on create — kept here but flagged)
export const status = [
  { value: "Belum_Menikah", label: "Belum Menikah" },
  { value: "Menikah", label: "Menikah" },
  // { value: "Duda", label: "Duda" }, // ditolak oleh validator backend saat create
];

export const gender = [
  { value: "L", label: "Laki-laki" },
  { value: "P", label: "Perempuan" },
];
