type QuinoaGammaInput = {
    doseGy: number;
    mode?: "basic" | "expert";
};

type QuinoaGammaOutput = {
    doseGy: number;
    doseKGy: number;

    germination: {
        day7Pct: number;
        day15Pct: number;
    };

    growth: {
        rootLengthCm: number;
        seedlingHeightCm: number;
        survivalPct: number;
    };

    biologicalDamagePct: number;
    usefulMutationProbabilityPct: number;

    classification: {
        zone: "Control" | "Balanced mutation zone" | "High mutation / high damage" | "Lethal zone";
        risk: "Low" | "Moderate" | "High" | "Lethal";
        basicMessage: string;
        expertMessage: string;
    };

    interpretation: string;
    modelReference: string;
};

// Experimental data points for Quinoa cv. Pasankalla
const dataPoints = [
    {
        dose: 0,
        germ7: 100, germ15: 100,
        root: 7.23, height: 3.81,
        survival: 80,
        mutDiversity: 0, mutFreq: 0,
        interp: "Untreated control"
    },
    {
        dose: 150,
        germ7: 71, germ15: 99,
        root: 4.58, height: 3.05,
        survival: 53,
        mutDiversity: 100, mutFreq: 60,
        interp: "Broadest mutation spectrum and balanced breeding zone"
    },
    {
        dose: 250,
        germ7: 63, germ15: 99,
        root: 4.07, height: 2.73,
        survival: 28,
        mutDiversity: 85, mutFreq: 100,
        interp: "Highest mutation frequency but high biological damage"
    },
    {
        dose: 350,
        germ7: 52, germ15: 99,
        root: 2.80, height: 2.55,
        survival: 0,
        mutDiversity: 0, mutFreq: 0,
        interp: "Lethal zone / no useful surviving plants"
    }
];

function interpolate(x: number, x0: number, x1: number, y0: number, y1: number): number {
    return y0 + (x - x0) * (y1 - y0) / (x1 - x0);
}

export function calculateQuinoaGammaExperimentalModel(input: QuinoaGammaInput): QuinoaGammaOutput {
    let dose = Math.max(0, Math.min(350, input.doseGy));
    
    let p0 = dataPoints[0];
    let p1 = dataPoints[1];

    if (dose > 250) {
        p0 = dataPoints[2];
        p1 = dataPoints[3];
    } else if (dose > 150) {
        p0 = dataPoints[1];
        p1 = dataPoints[2];
    } else {
        p0 = dataPoints[0];
        p1 = dataPoints[1];
    }

    let germ7 = 0;
    let germ15 = 0;
    let root = 0;
    let height = 0;
    let survival = 0;
    let mutDiv = 0;
    let mutFreq = 0;

    if (dose === p0.dose) {
        germ7 = p0.germ7; germ15 = p0.germ15;
        root = p0.root; height = p0.height;
        survival = p0.survival; mutDiv = p0.mutDiversity; mutFreq = p0.mutFreq;
    } else if (dose === p1.dose) {
        germ7 = p1.germ7; germ15 = p1.germ15;
        root = p1.root; height = p1.height;
        survival = p1.survival; mutDiv = p1.mutDiversity; mutFreq = p1.mutFreq;
    } else {
        germ7 = interpolate(dose, p0.dose, p1.dose, p0.germ7, p1.germ7);
        germ15 = interpolate(dose, p0.dose, p1.dose, p0.germ15, p1.germ15);
        root = interpolate(dose, p0.dose, p1.dose, p0.root, p1.root);
        height = interpolate(dose, p0.dose, p1.dose, p0.height, p1.height);
        survival = interpolate(dose, p0.dose, p1.dose, p0.survival, p1.survival);
        mutDiv = interpolate(dose, p0.dose, p1.dose, p0.mutDiversity, p1.mutDiversity);
        mutFreq = interpolate(dose, p0.dose, p1.dose, p0.mutFreq, p1.mutFreq);
    }

    // clamping
    survival = Math.max(0, survival);

    const rootRatio = root / 7.23;
    const heightRatio = height / 3.81;
    const survivalRatio = survival / 80;

    const biologicalIntegrity = ((rootRatio + heightRatio + survivalRatio) / 3) * 100;
    let biologicalDamagePct = 100 - biologicalIntegrity;
    biologicalDamagePct = Math.max(0, Math.min(100, biologicalDamagePct));

    const survivalScore = (survival / 80) * 100;
    let usefulMutationProbability = 
        (0.35 * mutFreq) + 
        (0.25 * mutDiv) + 
        (0.30 * survivalScore) - 
        (0.20 * biologicalDamagePct);

    usefulMutationProbability = Math.max(0, Math.min(100, usefulMutationProbability));

    let zone: "Control" | "Balanced mutation zone" | "High mutation / high damage" | "Lethal zone" = "Control";
    let risk: "Low" | "Moderate" | "High" | "Lethal" = "Low";
    let basicMsg = "";
    let expertMsg = "";
    let interp = "";

    if (dose >= 350 || survival <= 5) {
        zone = "Lethal zone";
        risk = "Lethal";
        basicMsg = "This treatment level is too strong for quinoa. The model predicts that plants will not survive properly.";
        expertMsg = "The dose is in the lethal zone for Pasankalla-type quinoa. Experimental data reported 0% plant survival at 350 Gy.";
        interp = dataPoints[3].interp;
    } else if (dose >= 220) {
        zone = "High mutation / high damage";
        risk = "High";
        basicMsg = "This level can create more variation, but it also damages the plants strongly. It should only be used in controlled breeding trials.";
        expertMsg = "Around 250 Gy, mutation frequency is high, but survival and early growth are strongly reduced.";
        interp = dataPoints[2].interp;
    } else if (dose >= 100) {
        zone = "Balanced mutation zone";
        risk = "Moderate";
        basicMsg = "This is the most balanced zone for quinoa seed improvement. It may create useful variation while keeping moderate plant survival.";
        expertMsg = "Around 150 Gy, the mutation spectrum is broad and plant survival remains higher than at 250 Gy.";
        interp = dataPoints[1].interp;
    } else {
        zone = "Control";
        risk = "Low";
        basicMsg = "This level is close to untreated seed. It is safer, but it may not generate much useful variation.";
        expertMsg = "The dose is near the control zone. Expected mutation induction is low.";
        interp = dataPoints[0].interp;
    }

    return {
        doseGy: dose,
        doseKGy: dose / 1000,
        germination: {
            day7Pct: Math.round(germ7),
            day15Pct: Math.round(germ15)
        },
        growth: {
            rootLengthCm: Number(root.toFixed(2)),
            seedlingHeightCm: Number(height.toFixed(2)),
            survivalPct: Math.round(survival)
        },
        biologicalDamagePct: Math.round(biologicalDamagePct),
        usefulMutationProbabilityPct: Math.round(usefulMutationProbability),
        classification: {
            zone,
            risk,
            basicMessage: basicMsg,
            expertMessage: expertMsg
        },
        interpretation: interp,
        modelReference: "Gomez-Pando, L. R., & Eguiluz-de la Barra, A. (2013). Induced Mutations in Quinoa (Chenopodium quinoa Willd.). American Journal of Plant Sciences, 4, 671-679."
    };
}
