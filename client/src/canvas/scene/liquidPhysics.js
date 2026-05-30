// Shared mutable state for liquid physics (plain object, no Valtio — perf critical, per-frame updates)
export const liquidPhysics = {
  tiltZ: 0, // Tilt from horizontal (azimuthal) rotation
  tiltX: 0, // Tilt from vertical (polar) rotation
};
