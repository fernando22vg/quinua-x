import { Sector, Isotope, SatelliteLayer } from "./types";

export const INITIAL_SECTORS: Sector[] = [
  {
    id: 1,
    name: "Sector 1: Lake Titicaca Littoral",
    location: "Copacabana Basin (16.16° S, 69.02° W)",
    moisture: 38,
    cropHealth: 92,
    nitrogen15: +1.2,
    oxygen18: -5.8,
    deuterium: -35.2,
    soilType: "Alluvial sandy loam with lacustrine sediment",
    elevation: 3812,
    cropStatus: "OPTIMAL",
    alerts: ["Water table recharge active from lake drift"]
  },
  {
    id: 2,
    name: "Sector 2: Uyuni Salar Periphery",
    location: "Llica Outskirts (19.84° S, 67.57° W)",
    moisture: 21,
    cropHealth: 71,
    nitrogen15: +14.6,
    oxygen18: -1.3,
    deuterium: -26.5,
    soilType: "Saline-sodic clay silt with high lithium trace",
    elevation: 3660,
    cropStatus: "CAUTION",
    alerts: ["High salinity salt-crust expansion warning"]
  },
  {
    id: 3,
    name: "Sector 3: Oruro Meadowlands",
    location: "Challapata Flats (18.90° S, 66.77° W)",
    moisture: 32,
    cropHealth: 88,
    nitrogen15: +6.1,
    oxygen18: -4.0,
    deuterium: -31.0,
    soilType: "Volcanic ash sand with rich humic content",
    elevation: 3730,
    cropStatus: "OPTIMAL",
    alerts: []
  },
  {
    id: 4,
    name: "Sector 4: Calmarka High-Altiplano Steppe",
    location: "Calmarka sector (16.90° S, 68.12° W)",
    moisture: 18,
    cropHealth: 64,
    nitrogen15: +12.4,
    oxygen18: -4.2,
    deuterium: -32.1,
    soilType: "Rocky calcic frigid andosol",
    elevation: 3950,
    cropStatus: "CRITICAL",
    alerts: [
      "IRRIGATION NEEDED IN SECTOR 4"
    ]
  },
  {
    id: 5,
    name: "Sector 5: Yungas Sub-Tropical Zone",
    location: "Coroico (16.18° S, 67.72° W)",
    moisture: 65,
    cropHealth: 85,
    nitrogen15: +4.2,
    oxygen18: -8.5,
    deuterium: -45.0,
    soilType: "Humus-rich clay loam",
    elevation: 1750,
    cropStatus: "OPTIMAL",
    alerts: []
  },
  {
    id: 6,
    name: "Sector 6: Santa Cruz Agricultural Zone",
    location: "Montero (17.33° S, 63.25° W)",
    moisture: 55,
    cropHealth: 90,
    nitrogen15: +2.1,
    oxygen18: -6.0,
    deuterium: -40.0,
    soilType: "Alluvial plains",
    elevation: 300,
    cropStatus: "OPTIMAL",
    alerts: ["Monitor for pesticide runoff"]
  },
  {
    id: 7,
    name: "Sector 7: Cochabamba Valley",
    location: "Sacaba (17.40° S, 66.04° W)",
    moisture: 42,
    cropHealth: 80,
    nitrogen15: +5.5,
    oxygen18: -5.1,
    deuterium: -38.5,
    soilType: "Fertile loam",
    elevation: 2560,
    cropStatus: "CAUTION",
    alerts: ["Mild drought stress detected"]
  },
  {
    id: 8,
    name: "Sector 8: Tarija Valley",
    location: "Tarija (21.53° S, 64.73° W)",
    moisture: 40,
    cropHealth: 88,
    nitrogen15: +3.8,
    oxygen18: -4.8,
    deuterium: -36.0,
    soilType: "Calcareous loam",
    elevation: 1850,
    cropStatus: "OPTIMAL",
    alerts: []
  }
];

export const ISOTOPES: Isotope[] = [
  {
    id: "N15",
    symbol: "15N",
    fullName: "Nitrogen-15",
    protons: 7,
    neutrons: 8,
    electrons: 7,
    status: "Stable Isotope",
    description: "Stable isotopic nitrogen used to trace chemical pathways of synthesized fertilizers versus biological microbial nitrogen capture. It reveals exactly how much applied nitrogen resides in root tissue.",
    agronomicalPurpose: "Measures fertilizer use efficiency (FUE), tracking the specific absorption speed of nitrogen feeds vs atmospheric biological fixation.",
    nuclearFormula: "^{15}_{7}N",
    halfLife: "Non-Radioactive / Indefinitely Stable"
  },
  {
    id: "O18",
    symbol: "18O",
    fullName: "Oxygen-18",
    protons: 8,
    neutrons: 10,
    electrons: 8,
    status: "Stable Isotope",
    description: "An oxygen isotopic ratio that footprints solar evapotranspiration. Water containing 16O evaporates quicker, leaving the liquid soil matrix enriched with 18O under physical moisture strain.",
    agronomicalPurpose: "Differentiates unproductive evaporative loss from plant-channeled transpiration, mapping localized irrigation efficiency micro-metrics.",
    nuclearFormula: "^{18}_{8}O",
    halfLife: "Non-Radioactive / Indefinitely Stable"
  },
  {
    id: "H2",
    symbol: "2H / D",
    fullName: "Deuterium / Hydrogen-2",
    protons: 1,
    neutrons: 1,
    electrons: 1,
    status: "Stable Isotope",
    description: "Heavy hydrogen isotope providing a source fingerprint for agricultural aquifers. Helps agronomy scientists trace whether crops are retrieving moisture from shallow rainfall or deep ancient aquifers.",
    agronomicalPurpose: "Traces subterranean aquifer depth consumption and defines precise seasonal water recharging loops across Altiplano terrains.",
    nuclearFormula: "^{2}_{1}H",
    halfLife: "Non-Radioactive / Indefinitely Stable"
  },
  {
    id: "C13",
    symbol: "13C",
    fullName: "Carbon-13",
    protons: 6,
    neutrons: 7,
    electrons: 6,
    status: "Stable Isotope",
    description: "A carbon stable variant reflecting daily leaf stomatal aperture constraint. Highly water-stressed Royal Quinoa closes its stomata, reducing discrimination against 13CO2, leaving a legacy d13C record.",
    agronomicalPurpose: "Identifies long-term drought resilience index, stress duration, and photosynthetic pathway stomatal closure intervals under extreme arid wind cycles.",
    nuclearFormula: "^{13}_{6}C",
    halfLife: "Non-Radioactive / Indefinitely Stable"
  }
];

export const SATELLITE_LAYERS: SatelliteLayer[] = [
  {
    id: "visible",
    name: "True-Color ESA sentinel-2",
    opacity: 0.9,
    colorHex: "#10b981",
    caption: "Sentinel-2 satellite imagery of soil, crop growth, and water distribution, updated yesterday."
  },
  {
    id: "isotope",
    name: "Nitrogen-15 Drift Vector Heatmap",
    opacity: 0.85,
    colorHex: "#e11d48",
    caption: "Dynamic color mapping displaying enriched 15N fertilizer absorption vectors across the crop bed."
  },
  {
    id: "moisture",
    name: "Soil Moisture Hydro-Anomalies (d18O)",
    opacity: 0.8,
    colorHex: "#2563eb",
    caption: "Isotopic liquid vapor depletion index highlighting hyper-evaporation zones requiring high-priority drip-line coverage."
  }
];

export const GALLERY_MOCK_IMAGES = {
  landscape: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEnN_4XdKXKqrzA8B9ge5uAHc2h2rV3iL7Fm6H77DItblqgJYoqku7OzMZ9MpV5-xP5h_Ln1IKiBU-W8CCUzX9zdxRbtf8rBl-EbPQRIHX9maBo3tXrwV2vhnckZbUxM8wE3MwyTwhdm6EaKlhsZ4Za9xC9bR8qJWQ-XBwOBgSobSJNdcTMOZ8MTeaS5yUWz9WhIl-IDZiHWJp463q8sXIkEaoQyWf05WefgmL3Ul3U6xEUPFIax3RifSsBQCZ6i8uLIEDF20NLDI",
  mobile_app: "https://lh3.googleusercontent.com/aida-public/AB6AXuCu82T7C-6DwCglRiiG_vjxijM2jtWxvSdJHbeFOlWwuxxIc-1AN0Rv75zs4VIaDoAXNNtxP9woj5REh15LQxBuxjvLTO4F-0VqCdV-BGLtX_fIWS9CIVERxvhCaSwdCd4YK7kIlw1lwJ0aGdlwtctvMngsuzo3f0nxrwwceEaMbaFav0pggaTS64s1bHFdPKDV5UIzn42stwf9RSVKjvOFSL79Nd57l9v8FyK54_XRLyWNacrSgcAZE6UXgh9iZoV2bumAbKeqJZ0",
  neon_atom: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0cjz0hEUo11fb2CgIBy-7kICmW9b4_TnrlgjVG1amK_1gJepJkrUUqicL_5NZHT76P4oH2ugs5xyfBIU8fcVzBU4BwUmizWBMfb6HzNVUWLY47R7L2jajZKtAnQcUUoB1Y24FxrxUP68Dndaj1VVkUMuvDdxZ45xtGnCIuYGwr_kjGUgpR28y5r9el8PCSishJLGiBwsDqGoeFZBg0RdnVNrKkfXfzo_Hb68bpWsxFE5UOaJkVsUisxyC83RT9SiBTE9ZB7zcRoQ",
  satellite_fields: "https://lh3.googleusercontent.com/aida-public/AB6AXuBznBffoIGYgVtJqdDOifuaEbcTUnnI8i9MNwau1igf3Ll326VKRVwmQk8K39q-JbwI-S70eajTxM_Qhh5lHBHFX_I8Rn8t2M9jx_WiUcsJ0iPmIFdNqHxgz6ExvbGaR6tNFVbHCr7w1Fh1lhOaC_roDYmBOR_NL-ZLVXDpcaD4e9q_J5Kcxm_iZs_M71jNeBswho7rlAtLCAbPsWBpLKun3fkDbcQ7XkCPmziEej3SjUz5LolkRFIimI_0vg8ook_8jZiWMdhtCLI"
};
