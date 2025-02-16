type UniversityColorMap = {
    [university: string]: string;
};

const universityColors: UniversityColorMap = {
    // Alberta
    "University of Alberta": "#2ecc71",       // Vibrant green
    "University of Calgary": "#e74c3c",         // Vibrant red
    "University of Lethbridge": "#9b59b6",      // Vibrant purple
    "Athabasca University": "#3498db",          // Vibrant blue
    "Mount Royal University": "#e67e22",        // Vibrant orange
    "MacEwan University": "#1abc9c",            // Vibrant teal
  
    // Ontario
    "University of Toronto": "#f39c12",         // Vibrant amber
    "York University": "#8e44ad",               // Vibrant violet
    "University of Waterloo": "#27ae60",        // Vibrant green
    "Western University": "#2980b9",            // Vibrant blue
    "McMaster University": "#c0392b",           // Vibrant red
    "Queen's University": "#d35400",            // Vibrant orange
    "Carleton University": "#e74c3c",           // Vibrant red
    "University of Ottawa": "#16a085",          // Vibrant greenish teal
    "Toronto Metropolitan University": "#f1c40f", // Vibrant yellow
    "University of Guelph": "#2ecc71",           // Vibrant green
    "Brock University": "#3498db",              // Vibrant blue
    "Wilfrid Laurier University": "#9b59b6",      // Vibrant purple
    "University of Windsor": "#e67e22",         // Vibrant orange
    "Trent University": "#1abc9c",              // Vibrant teal
    "Ontario Tech University": "#f39c12",       // Vibrant amber
    "Laurentian University": "#27ae60",         // Vibrant green
    "Nipissing University": "#2980b9",           // Vibrant blue
    "Algoma University": "#c0392b",              // Vibrant red
  
    // Quebec
    "McGill University": "#e74c3c",             // Vibrant red
    "Université de Montréal": "#3498db",        // Vibrant blue
    "Concordia University": "#2ecc71",          // Vibrant green
    "Université Laval": "#e67e22",              // Vibrant orange
    "Université du Québec à Montréal": "#f1c40f", // Vibrant yellow
    "Université de Sherbrooke": "#1abc9c",      // Vibrant teal
    "Bishop's University": "#9b59b6",            // Vibrant purple
    "Université du Québec à Trois-Rivières": "#d35400", // Vibrant orange-red
    "Université du Québec à Chicoutimi": "#16a085", // Vibrant teal
    "Université du Québec à Rimouski": "#27ae60", // Vibrant green
  
    // British Columbia
    "University of British Columbia": "#2980b9", // Vibrant blue
    "Simon Fraser University": "#c0392b",       // Vibrant red
    "University of Victoria": "#2ecc71",        // Vibrant green
    "University of Northern British Columbia": "#1abc9c", // Vibrant teal
    "Thompson Rivers University": "#8e44ad",    // Vibrant violet
    "Royal Roads University": "#f39c12",        // Vibrant amber
    "Kwantlen Polytechnic University": "#f1c40f", // Vibrant yellow
  
    // Manitoba
    "University of Manitoba": "#27ae60",        // Vibrant green
    "University of Winnipeg": "#e74c3c",        // Vibrant red
    "Brandon University": "#3498db",            // Vibrant blue
  
    // Saskatchewan
    "University of Saskatchewan": "#2ecc71",    // Vibrant green
    "University of Regina": "#9b59b6",          // Vibrant purple
  
    // Nova Scotia
    "Dalhousie University": "#2980b9",           // Vibrant blue
    "Saint Mary's University": "#1abc9c",       // Vibrant teal
    "Acadia University": "#e74c3c",              // Vibrant red
    "Cape Breton University": "#f1c40f",        // Vibrant yellow
    "Mount Saint Vincent University": "#e67e22",// Vibrant orange
    "St. Francis Xavier University": "#8e44ad", // Vibrant violet
  
    // New Brunswick
    "University of New Brunswick": "#3498db",   // Vibrant blue
    "St. Thomas University": "#27ae60",         // Vibrant green
    "Mount Allison University": "#2ecc71",      // Vibrant green
    "Université de Moncton": "#e67e22",         // Vibrant orange
  
    // Newfoundland and Labrador
    "Memorial University of Newfoundland": "#c0392b", // Vibrant red
  
    // Prince Edward Island
    "University of Prince Edward Island": "#16a085",  // Vibrant teal
  
    // Yukon
    "Yukon University": "#8e44ad",              // Vibrant violet
  
    // Default entry for any others
    "Other": "#f1c40f"                          // Vibrant yellow
  };

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const cleanedHex = hex.replace("#", "");
    if (cleanedHex.length !== 6) return null;
    const r = parseInt(cleanedHex.substring(0, 2), 16);
    const g = parseInt(cleanedHex.substring(2, 4), 16);
    const b = parseInt(cleanedHex.substring(4, 6), 16);
    return { r, g, b };
}

/**
 * Converts r, g, b values to a hex color string.
 */
function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (value: number) => {
        const hex = value.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Converts an RGB color value to HSL.
 * Returns h in [0, 360), s and l in [0, 1].
 */
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === rNorm) {
            h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        } else if (max === gNorm) {
            h = (bNorm - rNorm) / d + 2;
        } else {
            h = (rNorm - gNorm) / d + 4;
        }
        h *= 60;
    }
    return { h, s, l };
}

/**
 * Converts an HSL color value to RGB.
 * Expects h in [0, 360), s and l in [0, 1] and returns r, g, b in [0, 255].
 */
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    let r: number, g: number, b: number;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p: number, q: number, t: number): number => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h / 360 + 1 / 3);
        g = hue2rgb(p, q, h / 360);
        b = hue2rgb(p, q, h / 360 - 1 / 3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

export function blendColors(
    universities: string
): string {
    let totalR = 0,
        totalG = 0,
        totalB = 0;
    let count = 0;

    // Convert the input string to an array by splitting at "%" signs
    const universityList = universities.split('%');

    for (const uni of universityList) {
        // Use the university's color, or default to "Other" if not found
        const hex = universityColors[uni] || universityColors["Other"];
        const rgb = hexToRgb(hex);
        if (rgb) {
            totalR += rgb.r;
            totalG += rgb.g;
            totalB += rgb.b;
            count++;
        }
    }

    // If no universities were provided, return the default "Other" color.
    if (count === 0) {
        return universityColors["Other"];
    }

    // Average each color channel.
    const avgR = Math.round(totalR / count);
    const avgG = Math.round(totalG / count);
    const avgB = Math.round(totalB / count);

    let { h, s, l } = rgbToHsl(avgR, avgG, avgB);

    // Increase saturation to make the color more vibrant.
    // Here we boost the saturation by 50%, capping at 1.
    const vibrancyFactor = 1.5;
    s = Math.min(1, s * vibrancyFactor);

    // Convert the vibrant HSL color back to RGB.
    const vibrantRgb = hslToRgb(h, s, l);
    return rgbToHex(vibrantRgb.r, vibrantRgb.g, vibrantRgb.b);
}
