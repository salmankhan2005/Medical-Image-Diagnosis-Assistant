# Technical Report: Diabetic Retinopathy Classification Pipeline

## 1. Abstract
This report presents the implementation and evaluation of a deep learning decision-support pipeline for multi-class Diabetic Retinopathy (DR) grading from digital fundus photography. Utilizing **DenseNet-121** with transfer learning from ImageNet, domain-tailored data augmentation via **MONAI**, class-weighted loss optimization, and **Grad-CAM** activation mapping, the system classifies retinal images into 5 standard clinical stages while providing interpretable visual heatmaps.

---

## 2. Dataset & Stratification
The experimental dataset consists of 35,126 retinal fundus images categorized across 5 severity levels:
* **Stage 0 (No DR):** 25,810 (73.5%)
* **Stage 1 (Mild DR):** 2,443 (7.0%)
* **Stage 2 (Moderate DR):** 5,292 (15.1%)
* **Stage 3 (Severe DR):** 873 (2.5%)
* **Stage 4 (Proliferative DR):** 708 (2.0%)

### Data Partitioning
To ensure rigorous evaluation without data leakage, the dataset is partitioned using stratified sampling:
* **Training Set (70%):** Model parameter optimization.
* **Validation Set (15%):** Hyperparameter tuning and early stopping checkpoint selection.
* **Held-Out Test Set (15%):** Final unbiased metric evaluation.

---

## 3. Preprocessing & Augmentation Pipeline
Preprocessing and augmentation are constructed using MONAI:
* **Intensity Rescaling:** `ScaleIntensityRanged` normalizes values from `[0, 255]` to `[0.0, 1.0]`.
* **Standardization:** `NormalizeIntensityd` applies ImageNet channel-wise mean and variance parameters.
* **Medical Data Augmentation:** Domain-appropriate geometric transformations (rotation $\pm 15^\circ$, horizontal/vertical reflections), contrast adjustment ($\gamma \in [0.8, 1.2]$), and low-amplitude Gaussian noise ($\sigma = 0.02$).

---

## 4. Modeling Architecture & Optimization
* **Backbone:** DenseNet-121. The dense connectivity mechanism ($x_l = H_l([x_0, x_1, \dots, x_{l-1}])$) ensures direct feature transmission from low-level convolutional layers (vascular patterns) to high-level representations (exudates and hemorrhages).
* **Classifier Head:** Dropout ($p=0.3$) followed by a linear projection layer ($1024 \to 5$).
* **Loss Function:** Class-Weighted Cross-Entropy Loss, computing inverse frequency weights $w_c = \frac{N}{K \cdot N_c}$ to penalize misclassifications on minority disease classes.
* **Optimizer:** AdamW ($\text{lr} = 10^{-4}$, $\text{weight decay} = 10^{-4}$) coupled with a Cosine Annealing learning rate schedule ($\eta_{min} = 10^{-6}$).

---

## 5. Visual Explainability (Grad-CAM)
Class Activation Maps are generated from the final convolutional block (`features.denseblock4`):

$$\alpha_k^c = \frac{1}{Z}\sum_{i=1}^U \sum_{j=1}^V \frac{\partial y^c}{\partial A_{i,j}^k}$$

$$L_{\text{Grad-CAM}}^c = \text{ReLU}\left(\sum_k \alpha_k^c A^k\right)$$

This visual attribution verifies that model predictions are driven by clinical lesions (e.g., hemorrhages, neovascularization) rather than imaging artifacts.

---

## 6. Clinical & Ethical Governance
1. **Minimizing False Negatives:** In DR screening, missed severe cases (False Negatives) present a critical patient risk. Inverse class weighting is configured to optimize sensitivity on advanced stages.
2. **De-identification:** Retinal images must be stripped of all Protected Health Information (PHI) compliant with HIPAA/GDPR standards.
3. **Deployment Scope:** The system serves as a decision-support triage aid for ophthalmology screening workflows, not an autonomous diagnostic device.
