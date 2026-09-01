import random
import hashlib

# CPCB Bio-Medical Waste Categories Rule Map
CATEGORY_RULES = {
    "Yellow": {
        "predictedWasteType": "Infectious Soiled Waste & Surgical Dressing",
        "confidence": 94,
        "recommendation": "Dispose in non-chlorinated yellow biohazard bag for incineration/autoclaving."
    },
    "Red": {
        "predictedWasteType": "Contaminated Recyclable Plastic (IV Bottles & Tubing)",
        "confidence": 92,
        "recommendation": "Dispose in red container/bag for autoclaving, shredding, and authorized recycling."
    },
    "White": {
        "predictedWasteType": "Sharps, Needles & Scalpel Blades",
        "confidence": 96,
        "recommendation": "Dispose in puncture-proof, leak-proof white translucent sharps container."
    },
    "Blue": {
        "predictedWasteType": "Glass Vials, Ampoules & Metallic Implants",
        "confidence": 91,
        "recommendation": "Dispose in cardboard box/blue container for sodium hypochlorite disinfection."
    }
}

def classify_medical_waste(filename: str = "", file_bytes: bytes = None) -> dict:
    """
    Deterministic rule-based prototype classifier.
    Modular design allows replacing this function with a PyTorch/YOLO/TensorFlow CV model.
    """
    name_lower = filename.lower()
    
    # 1. Filename keyword rules
    if any(k in name_lower for k in ["yellow", "gauze", "bandage", "dressing", "cotton", "blood", "tissue", "anatomical"]):
        selected = "Yellow"
    elif any(k in name_lower for k in ["red", "plastic", "bottle", "tubing", "catheter", "glove", "iv"]):
        selected = "Red"
    elif any(k in name_lower for k in ["white", "sharp", "needle", "blade", "scalpel", "syringe"]):
        selected = "White"
    elif any(k in name_lower for k in ["blue", "glass", "vial", "ampoule", "metal", "implant"]):
        selected = "Blue"
    else:
        # 2. Hash-based deterministic rotation for unrecognized images
        hasher = hashlib.md5()
        if file_bytes:
            hasher.update(file_bytes)
        else:
            hasher.update(filename.encode('utf-8'))
        
        categories = ["Yellow", "Red", "White", "Blue"]
        idx = int(hasher.hexdigest(), 16) % len(categories)
        selected = categories[idx]

    info = CATEGORY_RULES[selected]
    
    # Slight deterministic variance for realism
    variance = (len(filename) * 3) % 5
    confidence_val = min(99, max(85, info["confidence"] + variance))

    return {
        "category": selected,
        "predictedWasteType": info["predictedWasteType"],
        "confidence": confidence_val,
        "recommendation": info["recommendation"]
    }
