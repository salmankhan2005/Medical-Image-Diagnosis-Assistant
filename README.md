# Medical Image Diagnosis Assistant: Diabetic Retinopathy Detection

An end-to-end deep learning pipeline for multi-class classification and visual decision support of Diabetic Retinopathy (DR) from retinal fundus photographs.

The project evaluates 5 clinical severity levels based on the International Clinical Diabetic Retinopathy Disease Severity Scale using **DenseNet-121**, **MONAI** medical image preprocessing transforms, class-weighted loss optimization, and **Grad-CAM** activation mapping.

---

## Clinical Overview & Severity Scale
* **Class 0 (No DR):** Normal retina with no detectable abnormalities.
* **Class 1 (Mild DR):** Microaneurysms only.
* **Class 2 (Moderate DR):** Dot/blot hemorrhages, hard exudates, and/or cotton wool spots.
* **Class 3 (Severe DR):** Marked intraretinal hemorrhages in 4 quadrants, venous beading in 2+ quadrants, or IRMA in 1+ quadrant (4-2-1 rule).
* **Class 4 (Proliferative DR):** Neovascularization and/or vitreous/preretinal hemorrhage.

---

## Pipeline Architecture

```
[Raw Fundus Image (RGB 224x224)]
                │
                ▼
[MONAI Preprocessing Pipeline]
  ├── Channel-First Reordering
  ├── Intensity Scaling [0, 1]
  └── Domain Augmentation (Rotation ±15°, Flip, Contrast, Noise)
                │
                ▼
[Stratified DataLoader] (70% Train / 15% Val / 15% Test)
                │
                ▼
[DenseNet-121 Backbone]
  ├── Pretrained ImageNet Weights (Dense Feature Concatenation)
  └── Dropout (p=0.3) + Linear Classifier (1024 -> 5)
                │
                ▼
[Loss & Optimization]
  ├── Inverse Class Frequency Weighted Cross-Entropy
  ├── AdamW Optimizer (lr=1e-4, weight_decay=1e-4)
  └── Cosine Annealing Learning Rate Scheduler
                │
                ▼
[Evaluation & Explainability]
  ├── Metrics: Accuracy, Precision, Recall, Specificity (OvR), F1, AUC-ROC
  └── Grad-CAM Localization on DenseBlock4
```

---

## Project Structure

```
medical-image-diagnosis-assistant/
│
├── README.md                                # Project documentation and reproduction guide
├── requirements.txt                         # Python dependencies
├── .gitignore                               # Git ignore configuration
│
├── notebooks/
│   └── medical_image_diagnosis_assistant.ipynb  # Primary Jupyter/Colab notebook
│
├── src/
│   ├── models/
│   │   └── densenet.py                     # DenseNet-121 architecture definition
│   ├── preprocessing/
│   │   └── transforms.py                   # MONAI data transform pipelines
│   └── explainability/
│       └── gradcam.py                      # Grad-CAM heatmap visualization
│
├── configs/
│   └── config.json                         # Training and model hyperparameters
│
└── docs/
    └── technical_report.md                 # Detailed technical and clinical report
```

---

## Setup and Execution

### Google Colab (Recommended)
1. Open Google Colab and upload `notebooks/medical_image_diagnosis_assistant.ipynb`.
2. Navigate to `Runtime` -> `Change runtime type` and select **T4 GPU**.
3. Execute the notebook cells sequentially (`Runtime` -> `Run all`).

### Local Environment
```bash
# Clone the repository
git clone https://github.com/username/medical-image-diagnosis-assistant.git
cd medical-image-diagnosis-assistant

# Install dependencies
pip install -r requirements.txt

# Launch Jupyter Lab
jupyter lab notebooks/medical_image_diagnosis_assistant.ipynb
```

---

## Methodology & Engineering Highlights

### 1. Medical Preprocessing with MONAI
Transformations are implemented via MONAI's dictionary-based pipeline:
* `ScaleIntensityRanged`: Rescales raw intensity values from `[0, 255]` to `[0.0, 1.0]`.
* `NormalizeIntensityd`: Normalizes image channels to standard ImageNet mean and variance.
* Domain-safe augmentations (`RandRotated`, `RandFlipd`, `RandAdjustContrastd`, `RandGaussianNoised`) prevent destroying subtle retinal pathology during training.

### 2. Class Imbalance Mitigation
The dataset exhibits significant class imbalance (Class 0 comprises >70% of samples, while Class 4 comprises ~2%). To prevent majority-class bias, we calculate inverse class frequency weights:

$$w_c = \frac{N}{K \cdot N_c}$$

where $N$ is total training samples, $K$ is the number of classes (5), and $N_c$ is the sample count for class $c$.

### 3. DenseNet-121 Architecture
DenseNet-121 connects every layer to all subsequent layers in a feed-forward manner. This architecture promotes feature reuse across convolutional stages, preserving fine vascular textures from early layers alongside semantic lesion representations in deeper layers.

### 4. Explainable AI (Grad-CAM)
Class activation maps are computed on the final convolutional block (`features.denseblock4`), mapping gradient activations:

$$\alpha_k^c = \frac{1}{Z}\sum_i\sum_j \frac{\partial y^c}{\partial A_{i,j}^k}$$

This provides visual verification of the retinal regions influencing model predictions.

---

## Metrics and Evaluation

The model is evaluated on a held-out test set using multi-class metrics:
* **Accuracy:** Overall multi-class classification accuracy.
* **Precision / Recall / F1-Score:** Macro and per-class metrics.
* **One-vs-Rest Specificity:** Per-class true negative rate $\frac{TN}{TN + FP}$.
* **AUC-ROC:** One-vs-Rest Receiver Operating Characteristic area under curve.
* **Confusion Matrix:** 5x5 matrix evaluating inter-class confusion.

---

## Ethical Considerations & Disclaimer
* **Data Privacy:** Retinal images must be fully de-identified and stripped of all Protected Health Information (PHI) in compliance with HIPAA/GDPR standards.
* **Clinical Risk:** The model is an educational and decision-support prototype. It is not intended for autonomous clinical diagnosis and requires validation by a board-certified ophthalmologist.

---

## License
MIT License
