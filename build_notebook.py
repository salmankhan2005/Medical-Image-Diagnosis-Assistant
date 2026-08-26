import json
import os

def create_notebook():
    cells = []

    def add_markdown(content):
        lines = [l + "\n" for l in content.strip().splitlines()]
        if lines:
            lines[-1] = lines[-1].rstrip("\n")
        cells.append({
            "cell_type": "markdown",
            "metadata": {},
            "source": lines
        })

    def add_code(content):
        lines = [l + "\n" for l in content.strip().splitlines()]
        if lines:
            lines[-1] = lines[-1].rstrip("\n")
        cells.append({
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": lines
        })

    # =========================================================================
    # CELL 01: Markdown - Project Overview
    # =========================================================================
    add_markdown("""# [CELL 01] Medical Image Diagnosis Assistant: Diabetic Retinopathy Detection
**Author:** Candidate Submission  
**Domain:** Healthcare Computer Vision  
**Frameworks:** PyTorch, MONAI, Torchvision, Scikit-Learn  

---

### Project Overview
Diabetic Retinopathy (DR) is a leading cause of preventable blindness worldwide. Early identification of microvascular lesions in retinal fundus photography is vital for timely clinical intervention.

This project implements an end-to-end deep learning pipeline for multi-class classification of retinal fundus images across the 5 International Clinical Diabetic Retinopathy disease severity stages:
* **Stage 0 (No DR):** Normal retinal appearance with no detectable vascular abnormalities.
* **Stage 1 (Mild DR):** Presence of microaneurysms only.
* **Stage 2 (Moderate DR):** Microaneurysms, dot-and-blot hemorrhages, and hard exudates.
* **Stage 3 (Severe DR):** Marked intraretinal hemorrhages in 4 quadrants, venous beading in 2+ quadrants, or IRMA in 1+ quadrant (4-2-1 rule).
* **Stage 4 (Proliferative DR):** Neovascularization and/or vitreous/preretinal hemorrhage.

*Disclaimer: This project is developed as a decision-support research prototype and benchmark for medical image triage, not a standalone diagnostic device.*
""")

    # =========================================================================
    # CELL 02: Code - Environment Setup
    # =========================================================================
    add_code(r"""# [CELL 02] Environment Setup & Dependencies
import sys
import os
import time
import json
import random
import shutil
import subprocess
from collections import Counter

# Automatically ensure all required packages are present in the current Python environment
required_modules = {
    "pandas": "pandas",
    "sklearn": "scikit-learn",
    "monai": "monai",
    "pytorch_grad_cam": "grad-cam",
    "cv2": "opencv-python-headless",
    "seaborn": "seaborn",
    "PIL": "Pillow",
    "tqdm": "tqdm"
}

missing_packages = []
for mod, pkg in required_modules.items():
    try:
        __import__(mod)
    except ImportError:
        missing_packages.append(pkg)

if missing_packages:
    print(f"Installing missing dependencies: {', '.join(missing_packages)}...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", *missing_packages])
    print("Dependencies installed successfully.")
else:
    print("All core dependencies are satisfied.")

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import torchvision
import torchvision.models as models

import monai
from monai.transforms import (
    Compose,
    ScaleIntensityRanged,
    NormalizeIntensityd,
    RandRotated,
    RandFlipd,
    RandAdjustContrastd,
    RandGaussianNoised,
    ToTensord
)

import numpy as np
import pandas as pd
import sklearn
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_recall_fscore_support,
    confusion_matrix,
    classification_report,
    roc_auc_score,
    roc_curve,
    auc
)
from sklearn.preprocessing import label_binarize

from PIL import Image
import cv2
import matplotlib.pyplot as plt
import seaborn as sns
from tqdm.auto import tqdm

print("-" * 50)
print("System Configuration:")
print(f"Python: {sys.version.split()[0]}")
print(f"PyTorch: {torch.__version__}")
print(f"Torchvision: {torchvision.__version__}")
print(f"MONAI: {monai.__version__}")
print(f"CUDA Available: {torch.cuda.is_available()}")
if torch.cuda.is_available():
    print(f"GPU: {torch.cuda.get_device_name(0)} ({torch.cuda.get_device_properties(0).total_memory / (1024**3):.2f} GB VRAM)")
else:
    print("Running on CPU")
print("-" * 50)
""")

    # =========================================================================
    # CELL 03: Code - Configuration & Reproducibility
    # =========================================================================
    add_code(r"""# [CELL 03] Reproducibility & Central Configuration

def set_seed(seed=42):
    random.seed(seed)
    os.environ['PYTHONHASHSEED'] = str(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed(seed)
        torch.cuda.manual_seed_all(seed)
        torch.backends.cudnn.deterministic = True
        torch.backends.cudnn.benchmark = False

CONFIG = {
    "seed": 42,
    "device": "cuda" if torch.cuda.is_available() else "cpu",
    "num_classes": 5,
    "class_names": ["No_DR", "Mild", "Moderate", "Severe", "Proliferate_DR"],
    "class_mapping": {
        0: "No_DR",
        1: "Mild",
        2: "Moderate",
        3: "Severe",
        4: "Proliferate_DR"
    },
    "use_subset": True,
    "subset_size": 4000,
    "train_ratio": 0.70,
    "val_ratio": 0.15,
    "test_ratio": 0.15,
    "image_size": 224,
    "in_channels": 3,
    "model_name": "densenet121",
    "pretrained": True,
    "batch_size": 32,
    "num_workers": 0 if os.name == 'nt' else 2,
    "num_epochs": 15,
    "learning_rate": 3e-4,
    "backbone_lr": 3e-5,
    "weight_decay": 1e-4,
    "label_smoothing": 0.1,
    "early_stopping_patience": 5,
    "min_lr": 1e-6,
    "artifact_dir": "./artifacts",
    "model_path": "./artifacts/best_densenet121_dr.pth",
    "config_path": "./artifacts/config.json",
    "metrics_path": "./artifacts/evaluation_metrics.json"
}

os.makedirs(CONFIG["artifact_dir"], exist_ok=True)
set_seed(CONFIG["seed"])
print(f"Config initialized on device: {CONFIG['device']}")
""")

    # =========================================================================
    # CELL 04: Code - Dataset Discovery & Storage-Safe Strategy
    # =========================================================================
    add_code(r"""# [CELL 04] Dataset Path Resolution & Storage Check

total_disk, used_disk, free_disk = shutil.disk_usage("/")
print(f"Disk Status: {free_disk / (1024**3):.2f} GB free of {total_disk / (1024**3):.2f} GB total")

CANDIDATE_PATHS = [
    "/content/data/colored_images/colored_images",
    "/content/data/colored_images",
    "/content/data",
    r"E:\ml-asses\Diabetic Retinopathy 2015 Data Colored Resized",
    r"E:\ml-asses\colored_images\colored_images",
    r"E:\ml-asses\colored_images",
    "/content/drive/MyDrive/Diabetic Retinopathy 2015 Data Colored Resized",
    "/content/drive/MyDrive/colored_images",
    "./data/colored_images/colored_images",
    "./data/colored_images",
    "./data"
]

DATASET_ROOT = None
for path in CANDIDATE_PATHS:
    if os.path.exists(path):
        DATASET_ROOT = path
        print(f"Dataset root identified at: {DATASET_ROOT}")
        break

if DATASET_ROOT is None:
    DATASET_ROOT = "/content/data"
    os.makedirs(DATASET_ROOT, exist_ok=True)
    print(f"Using default directory: {DATASET_ROOT}")
""")

    # =========================================================================
    # CELL 05: Code - Dataset Scanning & Integrity Check
    # =========================================================================
    add_code(r"""# [CELL 05] Dataset Discovery and Validation

def load_dataset_metadata(root_dir):
    records = []
    class_map = {
        "no_dr": 0, "0": 0, "normal": 0,
        "mild": 1, "1": 1,
        "moderate": 2, "2": 2,
        "severe": 3, "3": 3,
        "proliferate_dr": 4, "proliferative_dr": 4, "4": 4, "pdr": 4
    }
    
    # 1. Search recursively for class subdirectories (supports nested folders like /content/data/colored_images/colored_images)
    found_class_dirs = {}
    for r, dirs, files in os.walk(root_dir):
        for d in dirs:
            key = d.lower().replace(" ", "_").replace("-", "_")
            if key in class_map:
                cls_idx = class_map[key]
                found_class_dirs[cls_idx] = os.path.join(r, d)
                
    if len(found_class_dirs) >= 3:
        print(f"Found {len(found_class_dirs)} class directories in {root_dir}.")
        for cls_idx, fpath in sorted(found_class_dirs.items()):
            for fname in os.listdir(fpath):
                if fname.lower().endswith(('.png', '.jpg', '.jpeg')):
                    records.append({
                        "image_path": os.path.join(fpath, fname),
                        "filename": fname,
                        "label": cls_idx,
                        "class_name": CONFIG["class_names"][cls_idx]
                    })
                    
    # 2. Fallback: CSV lookup if images are in a flat folder
    if len(records) == 0:
        csv_candidates = []
        for r, dirs, files in os.walk(root_dir):
            for f in files:
                if f.lower() in ["trainlabels.csv", "train.csv"]:
                    csv_candidates.append(os.path.join(r, f))
                    
        for csv_path in csv_candidates:
            df_csv = pd.read_csv(csv_path)
            img_col, lbl_col = df_csv.columns[0], df_csv.columns[1]
            csv_dir = os.path.dirname(csv_path)
            for _, row in df_csv.iterrows():
                img_id = str(row[img_col])
                label_val = int(row[lbl_col])
                for ext in ['.png', '.jpg', '.jpeg', '']:
                    cand_path = os.path.join(csv_dir, img_id + ext)
                    if os.path.exists(cand_path):
                        records.append({
                            "image_path": cand_path,
                            "filename": os.path.basename(cand_path),
                            "label": label_val,
                            "class_name": CONFIG["class_names"][label_val]
                        })
                        break
            if len(records) > 0:
                break
                
    df = pd.DataFrame(records)
    return df

raw_df = load_dataset_metadata(DATASET_ROOT)

if len(raw_df) == 0:
    print("Warning: No images found in dataset path. Initializing demonstration data...")
    os.makedirs("./data/sample", exist_ok=True)
    demo_records = []
    for cls_idx, cls_name in enumerate(CONFIG["class_names"]):
        c_dir = f"./data/sample/{cls_name}"
        os.makedirs(c_dir, exist_ok=True)
        for i in range(30):
            arr = np.random.randint(30, 220, (224, 224, 3), dtype=np.uint8)
            cv2.circle(arr, (112, 112), 95, (int(cls_idx*40), 120, 180), -1)
            p = os.path.join(c_dir, f"sample_{i}.png")
            cv2.imwrite(p, arr)
            demo_records.append({"image_path": p, "filename": f"sample_{i}.png", "label": cls_idx, "class_name": cls_name})
    raw_df = pd.DataFrame(demo_records)

print(f"Total images discovered: {len(raw_df):,}")
print("\nClass breakdown:")
print(raw_df['class_name'].value_counts())
""")

    # =========================================================================
    # CELL 06: Code - Exploratory Data Analysis (EDA)
    # =========================================================================
    add_code(r"""# [CELL 06] Exploratory Data Analysis (EDA)

# 1. Class distribution plot
fig, ax = plt.subplots(figsize=(8, 4.5))
palette = ["#2ecc71", "#3498db", "#f39c12", "#e67e22", "#e74c3c"]
class_counts = raw_df['class_name'].value_counts().reindex(CONFIG["class_names"])

sns.barplot(x=class_counts.index, y=class_counts.values, palette=palette, ax=ax)
ax.set_title("Class Distribution in Dataset", fontsize=13, fontweight='bold')
ax.set_xlabel("Diabetic Retinopathy Stage", fontsize=11)
ax.set_ylabel("Sample Count", fontsize=11)

for i, count in enumerate(class_counts.values):
    pct = count / len(raw_df) * 100
    ax.text(i, count + max(class_counts.values) * 0.015, f"{count:,}\n({pct:.1f}%)", 
            ha='center', va='bottom', fontsize=9)

plt.tight_layout()
plt.show()

# 2. Visual sample inspection across all 5 classes
fig, axes = plt.subplots(1, 5, figsize=(18, 4))
fig.suptitle("Sample Retinal Fundus Scans by Clinical Stage", fontsize=14, fontweight='bold')

for idx, cname in enumerate(CONFIG["class_names"]):
    samples = raw_df[raw_df['label'] == idx]
    if len(samples) > 0:
        img_path = samples.iloc[0]['image_path']
        img = Image.open(img_path).convert('RGB')
        axes[idx].imshow(img)
    axes[idx].set_title(f"Class {idx}: {cname}", fontsize=11)
    axes[idx].axis('off')

plt.tight_layout()
plt.show()

sample_img = Image.open(raw_df.iloc[0]['image_path'])
print(f"Native Resolution: {sample_img.size} | Mode: {sample_img.mode}")
""")

    # =========================================================================
    # CELL 07: Code - Data Cleaning & Stratified Subsetting
    # =========================================================================
    add_code(r"""# [CELL 07] Data Sanitization and Stratified Partitioning

def sanitize_and_subset(df, config):
    valid_records = []
    corrupt_count = 0
    
    for _, row in df.iterrows():
        path = row['image_path']
        if os.path.exists(path):
            try:
                with Image.open(path) as im:
                    im.verify()
                valid_records.append(row)
            except Exception:
                corrupt_count += 1
        else:
            corrupt_count += 1
            
    clean_df = pd.DataFrame(valid_records)
    print(f"Sanitization: {len(df):,} total -> {corrupt_count} dropped -> {len(clean_df):,} verified valid.")
    
    if config["use_subset"] and len(clean_df) > config["subset_size"]:
        subset_df, _ = train_test_split(
            clean_df,
            train_size=config["subset_size"],
            stratify=clean_df['label'],
            random_state=config["seed"]
        )
        print(f"Extracted stratified subset of {len(subset_df):,} images.")
        return subset_df.reset_index(drop=True)
    
    return clean_df.reset_index(drop=True)

processed_df = sanitize_and_subset(raw_df, CONFIG)
""")

    # =========================================================================
    # CELL 08: Code - Train / Validation / Test Split
    # =========================================================================
    add_code(r"""# [CELL 08] Train / Validation / Test Split (70% / 15% / 15%)

train_df, temp_df = train_test_split(
    processed_df,
    test_size=(CONFIG["val_ratio"] + CONFIG["test_ratio"]),
    stratify=processed_df['label'],
    random_state=CONFIG["seed"]
)

val_df, test_df = train_test_split(
    temp_df,
    test_size=0.50,
    stratify=temp_df['label'],
    random_state=CONFIG["seed"]
)

train_df = train_df.reset_index(drop=True)
val_df = val_df.reset_index(drop=True)
test_df = test_df.reset_index(drop=True)

print(f"Dataset Splits: Train={len(train_df):,} ({len(train_df)/len(processed_df)*100:.1f}%), "
      f"Val={len(val_df):,} ({len(val_df)/len(processed_df)*100:.1f}%), "
      f"Test={len(test_df):,} ({len(test_df)/len(processed_df)*100:.1f}%)")

split_table = pd.DataFrame({
    "Class": CONFIG["class_names"],
    "Train": [sum(train_df['label'] == i) for i in range(5)],
    "Val": [sum(val_df['label'] == i) for i in range(5)],
    "Test": [sum(test_df['label'] == i) for i in range(5)]
})
print("\nClass Distribution Across Partitions:")
print(split_table.to_string(index=False))
""")

    # =========================================================================
    # CELL 09: Code - MONAI Preprocessing Pipeline
    # =========================================================================
    add_code(r"""# [CELL 09] MONAI Medical Image Preprocessing and Augmentation Pipeline

# 1. Training Pipeline: Domain-appropriate augmentation + Normalization
train_transforms = Compose([
    ScaleIntensityRanged(keys=["image"], a_min=0.0, a_max=255.0, b_min=0.0, b_max=1.0, clip=True),
    RandRotated(keys=["image"], range_x=np.pi/12, prob=0.5, mode="bilinear"),
    RandFlipd(keys=["image"], spatial_axis=0, prob=0.5),
    RandFlipd(keys=["image"], spatial_axis=1, prob=0.5),
    RandAdjustContrastd(keys=["image"], prob=0.4, gamma=(0.8, 1.2)),
    RandGaussianNoised(keys=["image"], prob=0.3, mean=0.0, std=0.02),
    NormalizeIntensityd(
        keys=["image"],
        subtrahend=[0.485, 0.456, 0.406],
        divisor=[0.229, 0.224, 0.225],
        channel_wise=True
    ),
    ToTensord(keys=["image", "label"])
])

# 2. Validation & Test Pipeline: Deterministic Scaling and Normalization
eval_transforms = Compose([
    ScaleIntensityRanged(keys=["image"], a_min=0.0, a_max=255.0, b_min=0.0, b_max=1.0, clip=True),
    NormalizeIntensityd(
        keys=["image"],
        subtrahend=[0.485, 0.456, 0.406],
        divisor=[0.229, 0.224, 0.225],
        channel_wise=True
    ),
    ToTensord(keys=["image", "label"])
])

print("MONAI transform pipelines configured.")
""")

    # =========================================================================
    # CELL 10: Code - PyTorch DataLoaders
    # =========================================================================
    add_code(r"""# [CELL 10] PyTorch Dataset and DataLoader Construction

class FundusRetinopathyDataset(Dataset):
    def __init__(self, df, transform=None):
        self.df = df
        self.transform = transform

    def __len__(self):
        return len(self.df)

    def __getitem__(self, idx):
        row = self.df.iloc[idx]
        img = Image.open(row['image_path']).convert('RGB')
        img_np = np.array(img, dtype=np.float32)
        # Convert (H, W, C) -> (C, H, W) for native PyTorch & MONAI processing
        img_ch_first = np.transpose(img_np, (2, 0, 1))
        
        sample = {"image": img_ch_first, "label": int(row['label'])}
        if self.transform:
            sample = self.transform(sample)
            
        lbl = sample["label"]
        lbl_tensor = lbl if isinstance(lbl, torch.Tensor) else torch.tensor(lbl, dtype=torch.long)
        return sample["image"], lbl_tensor

train_dataset = FundusRetinopathyDataset(train_df, transform=train_transforms)
val_dataset = FundusRetinopathyDataset(val_df, transform=eval_transforms)
test_dataset = FundusRetinopathyDataset(test_df, transform=eval_transforms)

# Use single-process DataLoader (num_workers=0) to prevent Python 3.13 subprocess shutdown assertions
train_loader = DataLoader(
    train_dataset,
    batch_size=CONFIG["batch_size"],
    shuffle=True,
    num_workers=0,
    pin_memory=torch.cuda.is_available()
)

val_loader = DataLoader(
    val_dataset,
    batch_size=CONFIG["batch_size"],
    shuffle=False,
    num_workers=0,
    pin_memory=torch.cuda.is_available()
)

test_loader = DataLoader(
    test_dataset,
    batch_size=CONFIG["batch_size"],
    shuffle=False,
    num_workers=0,
    pin_memory=torch.cuda.is_available()
)

# Batch sanity check
batch_imgs, batch_lbls = next(iter(train_loader))
print(f"Batch Tensor Shapes: Images={batch_imgs.shape} | Labels={batch_lbls.shape}")
print(f"Batches: Train={len(train_loader)}, Val={len(val_loader)}, Test={len(test_loader)}")
""")

    # =========================================================================
    # CELL 11: Code - Class Imbalance Loss Weights
    # =========================================================================
    add_code(r"""# [CELL 11] Class Imbalance Mitigation: Inverse Frequency Loss Weighting

train_counts = np.bincount(train_df['label'].values, minlength=CONFIG["num_classes"])
total_samples = len(train_df)

# Inverse class frequency weighting: w_c = N / (K * N_c)
class_weights = total_samples / (CONFIG["num_classes"] * train_counts.astype(np.float32))
class_weights_tensor = torch.tensor(class_weights, dtype=torch.float32).to(CONFIG["device"])

print("Class Weight Factors:")
for idx, (name, cnt, w) in enumerate(zip(CONFIG["class_names"], train_counts, class_weights)):
    print(f"  Class {idx} ({name:14s}): Count={cnt:4d} ({cnt/total_samples*100:5.1f}%) | Weight={w:.3f}")

# Cross-entropy loss with class weighting and label smoothing
criterion = nn.CrossEntropyLoss(
    weight=class_weights_tensor,
    label_smoothing=CONFIG.get("label_smoothing", 0.1)
)
print("Weighted & Label-Smoothed Cross-Entropy Loss initialized.")
""")

    # =========================================================================
    # CELL 12: Code - Model Architecture (DenseNet-121)
    # =========================================================================
    add_code(r"""# [CELL 12] Model Architecture: DenseNet-121 Transfer Learning

def build_densenet_model(num_classes=5, pretrained=True):
    weights = models.DenseNet121_Weights.DEFAULT if pretrained else None
    model = models.densenet121(weights=weights)
    
    in_features = model.classifier.in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.3),
        nn.Linear(in_features, num_classes)
    )
    return model

model = build_densenet_model(num_classes=CONFIG["num_classes"], pretrained=CONFIG["pretrained"])
model = model.to(CONFIG["device"])

total_params = sum(p.numel() for p in model.parameters())
trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)

print(f"Model Architecture: DenseNet-121")
print(f"Total Parameters: {total_params:,} | Trainable: {trainable_params:,}")
print(f"Classification Head: {model.classifier}")
""")

    # =========================================================================
    # CELL 13: Code - Optimizer & Scheduler
    # =========================================================================
    add_code(r"""# [CELL 13] Optimizer and Learning Rate Scheduler Configuration

# Differential learning rates: fine-tune backbone gently while training classifier head
optimizer = optim.AdamW([
    {"params": model.features.parameters(), "lr": CONFIG.get("backbone_lr", 3e-5)},
    {"params": model.classifier.parameters(), "lr": CONFIG["learning_rate"]}
], weight_decay=CONFIG["weight_decay"])

scheduler = optim.lr_scheduler.CosineAnnealingLR(
    optimizer,
    T_max=CONFIG["num_epochs"],
    eta_min=CONFIG["min_lr"]
)

print(f"Optimizer: AdamW (Backbone LR: {CONFIG.get('backbone_lr', 3e-5)}, Head LR: {CONFIG['learning_rate']})")
print(f"Scheduler: CosineAnnealingLR (T_max={CONFIG['num_epochs']}, min_lr={CONFIG['min_lr']})")
""")

    # =========================================================================
    # CELL 14: Code - Training & Validation Loop
    # =========================================================================
    add_code(r"""# [CELL 14] Training & Validation Engine

def train_epoch(model, loader, criterion, optimizer, device, epoch, num_epochs):
    model.train()
    running_loss = 0.0
    preds_all, targets_all = [], []
    
    pbar = tqdm(loader, desc=f"Epoch {epoch:02d}/{num_epochs:02d} [Train]", leave=False)
    for images, labels in pbar:
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        
        running_loss += loss.item() * images.size(0)
        preds = torch.argmax(outputs, dim=1)
        preds_all.extend(preds.cpu().numpy())
        targets_all.extend(labels.cpu().numpy())
        
        current_acc = accuracy_score(targets_all, preds_all)
        pbar.set_postfix({"loss": f"{loss.item():.4f}", "acc": f"{current_acc*100:.1f}%"})
        
    epoch_loss = running_loss / len(loader.dataset)
    epoch_acc = accuracy_score(targets_all, preds_all)
    return epoch_loss, epoch_acc

def validate_epoch(model, loader, criterion, device, epoch, num_epochs):
    model.eval()
    running_loss = 0.0
    preds_all, targets_all = [], []
    
    pbar = tqdm(loader, desc=f"Epoch {epoch:02d}/{num_epochs:02d} [Val]  ", leave=False)
    with torch.no_grad():
        for images, labels in pbar:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)
            
            running_loss += loss.item() * images.size(0)
            preds = torch.argmax(outputs, dim=1)
            preds_all.extend(preds.cpu().numpy())
            targets_all.extend(labels.cpu().numpy())
            
            current_acc = accuracy_score(targets_all, preds_all)
            pbar.set_postfix({"loss": f"{loss.item():.4f}", "acc": f"{current_acc*100:.1f}%"})
            
    epoch_loss = running_loss / len(loader.dataset)
    epoch_acc = accuracy_score(targets_all, preds_all)
    return epoch_loss, epoch_acc

history = {"train_loss": [], "val_loss": [], "train_acc": [], "val_acc": [], "lr": []}
best_val_loss = float('inf')
patience_counter = 0
start_time = time.time()

print(f"Starting training on device: {CONFIG['device']} ({CONFIG['num_epochs']} epochs)...", flush=True)
print("=" * 75, flush=True)
print(f"{'Epoch':^7} | {'Train Loss':^12} | {'Train Acc':^10} | {'Val Loss':^12} | {'Val Acc':^10} | {'LR':^10}", flush=True)
print("-" * 75, flush=True)

for epoch in range(1, CONFIG["num_epochs"] + 1):
    current_lr = optimizer.param_groups[0]['lr']
    t_loss, t_acc = train_epoch(model, train_loader, criterion, optimizer, CONFIG["device"], epoch, CONFIG["num_epochs"])
    v_loss, v_acc = validate_epoch(model, val_loader, criterion, CONFIG["device"], epoch, CONFIG["num_epochs"])
    scheduler.step()
    
    history["train_loss"].append(t_loss)
    history["val_loss"].append(v_loss)
    history["train_acc"].append(t_acc)
    history["val_acc"].append(v_acc)
    history["lr"].append(current_lr)
    
    print(f"{epoch:^7d} | {t_loss:^12.4f} | {t_acc*100:^9.2f}% | {v_loss:^12.4f} | {v_acc*100:^9.2f}% | {current_lr:^10.2e}", flush=True)
    
    if v_loss < best_val_loss:
        best_val_loss = v_loss
        patience_counter = 0
        torch.save(model.state_dict(), CONFIG["model_path"])
        print(f"        -> Saved new best checkpoint (Val Loss: {v_loss:.4f})", flush=True)
    else:
        patience_counter += 1
        if patience_counter >= CONFIG["early_stopping_patience"]:
            print(f"\nEarly stopping triggered at epoch {epoch}.", flush=True)
            break

total_time = time.time() - start_time
print("=" * 75, flush=True)
print(f"Training completed in {total_time / 60:.2f} minutes.", flush=True)
""")

    # =========================================================================
    # CELL 15: Code - Training Curves
    # =========================================================================
    add_code(r"""# [CELL 15] Training Trajectory Visualization

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 4.5))

# Loss curve
ax1.plot(history['train_loss'], label='Train Loss', color='#2980b9', lw=2)
ax1.plot(history['val_loss'], label='Val Loss', color='#e74c3c', lw=2, linestyle='--')
ax1.set_title('Loss vs. Epochs', fontsize=12, fontweight='bold')
ax1.set_xlabel('Epoch', fontsize=10)
ax1.set_ylabel('Cross-Entropy Loss', fontsize=10)
ax1.grid(True, alpha=0.3)
ax1.legend()

# Accuracy curve
ax2.plot([a*100 for a in history['train_acc']], label='Train Accuracy', color='#27ae60', lw=2)
ax2.plot([a*100 for a in history['val_acc']], label='Val Accuracy', color='#f39c12', lw=2, linestyle='--')
ax2.set_title('Accuracy (%) vs. Epochs', fontsize=12, fontweight='bold')
ax2.set_xlabel('Epoch', fontsize=10)
ax2.set_ylabel('Accuracy (%)', fontsize=10)
ax2.grid(True, alpha=0.3)
ax2.legend()

plt.tight_layout()
plt.show()
""")

    # =========================================================================
    # CELL 16: Code - Test Evaluation & Multi-Class Metrics
    # =========================================================================
    add_code(r"""# [CELL 16] Test Set Evaluation and Classification Metrics

# Load best checkpoint
model.load_state_dict(torch.load(CONFIG["model_path"], map_location=CONFIG["device"]))
model.eval()

test_probs, test_preds, test_targets = [], [], []

# Test-Time Augmentation (TTA) for robust evaluation
with torch.no_grad():
    for images, labels in test_loader:
        images = images.to(CONFIG["device"])
        
        # Standard forward pass
        out_standard = model(images)
        # Horizontal flip TTA pass
        out_flipped = model(torch.flip(images, dims=[-1]))
        
        probs = torch.softmax((out_standard + out_flipped) / 2.0, dim=1)
        preds = torch.argmax(probs, dim=1)
        
        test_probs.extend(probs.cpu().numpy())
        test_preds.extend(preds.cpu().numpy())
        test_targets.extend(labels.numpy())

test_probs = np.array(test_probs)
test_preds = np.array(test_preds)
test_targets = np.array(test_targets)

# Metric Calculations
test_acc = accuracy_score(test_targets, test_preds)
precision, recall, f1, support = precision_recall_fscore_support(test_targets, test_preds, zero_division=0)
macro_p = np.mean(precision)
macro_r = np.mean(recall)
macro_f1 = np.mean(f1)

try:
    macro_auc = roc_auc_score(test_targets, test_probs, multi_class='ovr', average='macro')
except Exception:
    macro_auc = 0.0

# Clinical Binary Screening Benchmark: Referable DR (Stage >= 2)
ref_targets = (test_targets >= 2).astype(int)
ref_preds = (test_preds >= 2).astype(int)
ref_acc = accuracy_score(ref_targets, ref_preds)
ref_sens = np.sum((ref_preds == 1) & (ref_targets == 1)) / max(np.sum(ref_targets == 1), 1)

print("=" * 65)
print("TEST SET EVALUATION SUMMARY")
print("=" * 65)
print(f"5-Class Exact Severity Accuracy : {test_acc*100:.2f}%")
print(f"Macro Precision                 : {macro_p:.4f}")
print(f"Macro Recall (Sensitivity)      : {macro_r:.4f}")
print(f"Macro F1-Score                  : {macro_f1:.4f}")
print(f"Macro AUC-ROC (OvR)             : {macro_auc:.4f}")
print("-" * 65)
print(f"Clinical Referable DR Screening : {ref_acc*100:.2f}% (Target: >90%)")
print(f"Referable DR Clinical Recall    : {ref_sens*100:.2f}%")
print("=" * 65)
print(classification_report(test_targets, test_preds, target_names=CONFIG["class_names"], digits=4, zero_division=0))
""")

    # =========================================================================
    # CELL 17: Code - Confusion Matrix & One-vs-Rest Specificity
    # =========================================================================
    add_code(r"""# [CELL 17] Confusion Matrix and Per-Class Specificity

cm = confusion_matrix(test_targets, test_preds)

specificities = []
for i in range(CONFIG["num_classes"]):
    tp = cm[i, i]
    fp = cm[:, i].sum() - tp
    fn = cm[i, :].sum() - tp
    tn = cm.sum() - (tp + fp + fn)
    spec = tn / (tn + fp) if (tn + fp) > 0 else 0.0
    specificities.append(spec)

print("Per-Class Specificity (One-vs-Rest):")
for idx, (name, sp) in enumerate(zip(CONFIG["class_names"], specificities)):
    print(f"  Class {idx} ({name:14s}): Specificity = {sp*100:.2f}% (TN / (TN + FP))")
print(f"Macro Specificity: {np.mean(specificities)*100:.2f}%\n")

# Confusion Matrix Heatmap
plt.figure(figsize=(7.5, 6))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", 
            xticklabels=CONFIG["class_names"], yticklabels=CONFIG["class_names"])
plt.title("5-Class Confusion Matrix", fontsize=13, fontweight='bold')
plt.xlabel("Predicted Label", fontsize=11)
plt.ylabel("True Label", fontsize=11)
plt.tight_layout()
plt.show()
""")

    # =========================================================================
    # CELL 18: Code - Multi-Class ROC Curves
    # =========================================================================
    add_code(r"""# [CELL 18] Multi-Class One-vs-Rest ROC Curves

plt.figure(figsize=(8, 6))
colors = ["#2ecc71", "#3498db", "#f39c12", "#e67e22", "#e74c3c"]
targets_bin = label_binarize(test_targets, classes=list(range(CONFIG["num_classes"])))

for i in range(CONFIG["num_classes"]):
    if targets_bin[:, i].sum() > 0:
        fpr, tpr, _ = roc_curve(targets_bin[:, i], test_probs[:, i])
        cls_auc = auc(fpr, tpr)
        plt.plot(fpr, tpr, color=colors[i], lw=2, label=f"{CONFIG['class_names'][i]} (AUC = {cls_auc:.3f})")

plt.plot([0, 1], [0, 1], 'k--', lw=1.2, alpha=0.6, label='Random Chance')
plt.xlim([0.0, 1.0])
plt.ylim([0.0, 1.05])
plt.xlabel('False Positive Rate (1 - Specificity)', fontsize=11)
plt.ylabel('True Positive Rate (Sensitivity)', fontsize=11)
plt.title('One-vs-Rest ROC Curves', fontsize=13, fontweight='bold')
plt.legend(loc="lower right", fontsize=9)
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()
""")

    # =========================================================================
    # CELL 19: Code - Qualitative Error Analysis
    # =========================================================================
    add_code(r"""# [CELL 19] Error Analysis: High-Confidence Misclassifications

incorrect_idx = np.where(test_preds != test_targets)[0]
print(f"Total Test: {len(test_targets)} | Correct: {len(test_targets)-len(incorrect_idx)} | Misclassified: {len(incorrect_idx)}")

if len(incorrect_idx) > 0:
    confidences = [test_probs[i, test_preds[i]] for i in incorrect_idx]
    top_err_indices = np.argsort(confidences)[::-1][:4]
    
    fig, axes = plt.subplots(1, min(4, len(top_err_indices)), figsize=(16, 4))
    if len(top_err_indices) == 1:
        axes = [axes]
        
    for plot_idx, sub_idx in enumerate(top_err_indices):
        orig_i = incorrect_idx[sub_idx]
        row_data = test_df.iloc[orig_i]
        im = Image.open(row_data['image_path']).convert('RGB')
        
        true_name = CONFIG["class_names"][test_targets[orig_i]]
        pred_name = CONFIG["class_names"][test_preds[orig_i]]
        conf = test_probs[orig_i, test_preds[orig_i]] * 100
        
        axes[plot_idx].imshow(im)
        axes[plot_idx].set_title(f"True: {true_name}\nPred: {pred_name} ({conf:.1f}%)", fontsize=10, color='darkred')
        axes[plot_idx].axis('off')
        
    plt.suptitle("Representative Misclassified Retinal Images", fontsize=13, fontweight='bold')
    plt.tight_layout()
    plt.show()
""")

    # =========================================================================
    # CELL 20: Code - Grad-CAM Explainability
    # =========================================================================
    add_code(r"""# [CELL 20] Explainability: Grad-CAM Activation Visualizer

from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image

target_layers = [model.features.denseblock4]
cam = GradCAM(model=model, target_layers=target_layers)

def generate_cam_overlay(image_path):
    raw_img = Image.open(image_path).convert('RGB').resize((CONFIG["image_size"], CONFIG["image_size"]))
    rgb_float = np.float32(raw_img) / 255.0
    img_np = np.transpose(np.array(raw_img, dtype=np.float32), (2, 0, 1))
    
    data_dict = eval_transforms({"image": img_np, "label": 0})
    tensor_in = data_dict["image"].unsqueeze(0).to(CONFIG["device"])
    
    model.eval()
    with torch.no_grad():
        logits = model(tensor_in)
        probs = torch.softmax(logits, dim=1).cpu().numpy()[0]
        pred_c = int(np.argmax(probs))
        
    cam_map = cam(input_tensor=tensor_in, targets=None)[0, :]
    overlay = show_cam_on_image(rgb_float, cam_map, use_rgb=True)
    return raw_img, cam_map, overlay, pred_c, probs

# Visualize on test samples
sample_indices = [0, min(3, len(test_df)-1), min(6, len(test_df)-1)]
fig, axes = plt.subplots(len(sample_indices), 3, figsize=(12, 4 * len(sample_indices)))
fig.suptitle("Grad-CAM Visual Explanations (DenseBlock4 Activations)", fontsize=14, fontweight='bold')

for row_i, idx in enumerate(sample_indices):
    row_info = test_df.iloc[idx]
    raw_im, cam_map, overlay, pred_c, probs = generate_cam_overlay(row_info['image_path'])
    true_c = row_info['label']
    
    axes[row_i, 0].imshow(raw_im)
    axes[row_i, 0].set_title(f"True: {CONFIG['class_names'][true_c]}", fontsize=11)
    axes[row_i, 0].axis('off')
    
    axes[row_i, 1].imshow(cam_map, cmap='jet')
    axes[row_i, 1].set_title("Grad-CAM Heatmap", fontsize=11)
    axes[row_i, 1].axis('off')
    
    axes[row_i, 2].imshow(overlay)
    axes[row_i, 2].set_title(f"Pred: {CONFIG['class_names'][pred_c]} ({probs[pred_c]*100:.1f}%)", 
                             fontsize=11, color="green" if pred_c == true_c else "red")
    axes[row_i, 2].axis('off')

plt.tight_layout()
plt.show()
""")

    # =========================================================================
    # CELL 21: Code - Saliency Map Visualization
    # =========================================================================
    add_code(r"""# [CELL 21] Pixel Saliency Map Visualization

def compute_pixel_saliency(model, tensor_in, target_c):
    model.eval()
    tensor_in.requires_grad_()
    out = model(tensor_in)
    score = out[0, target_c]
    score.backward()
    saliency, _ = torch.max(tensor_in.grad.data.abs(), dim=1)
    return saliency[0].cpu().numpy()

sample_test_row = test_df.iloc[0]
sample_im = Image.open(sample_test_row['image_path']).convert('RGB').resize((224, 224))
img_np = np.transpose(np.array(sample_im, dtype=np.float32), (2, 0, 1))
data_dict = eval_transforms({"image": img_np, "label": sample_test_row['label']})
tensor_in = data_dict["image"].unsqueeze(0).to(CONFIG["device"])

sal_map = compute_pixel_saliency(model, tensor_in, sample_test_row['label'])

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9, 4))
ax1.imshow(sample_im)
ax1.set_title(f"Input: {CONFIG['class_names'][sample_test_row['label']]}")
ax1.axis('off')

ax2.imshow(sal_map, cmap='hot')
ax2.set_title("Pixel-Level Saliency Gradient")
ax2.axis('off')
plt.tight_layout()
plt.show()
""")

    # =========================================================================
    # CELL 22: Code - Single-Image Inference
    # =========================================================================
    add_code(r"""# [CELL 22] Single-Image Inference Pipeline

def predict_retinal_image(image_input):
    if isinstance(image_input, str):
        im = Image.open(image_input).convert('RGB').resize((CONFIG["image_size"], CONFIG["image_size"]))
    else:
        im = image_input.convert('RGB').resize((CONFIG["image_size"], CONFIG["image_size"]))
        
    rgb_f = np.float32(im) / 255.0
    img_np = np.transpose(np.array(im, dtype=np.float32), (2, 0, 1))
    data_dict = eval_transforms({"image": img_np, "label": 0})
    tensor_in = data_dict["image"].unsqueeze(0).to(CONFIG["device"])
    
    model.eval()
    with torch.no_grad():
        logits = model(tensor_in)
        probabilities = torch.softmax(logits, dim=1).cpu().numpy()[0]
        pred_idx = int(np.argmax(probabilities))
        pred_name = CONFIG["class_names"][pred_idx]
        confidence = probabilities[pred_idx] * 100
        
    cam_out = cam(input_tensor=tensor_in, targets=None)[0, :]
    overlay = show_cam_on_image(rgb_f, cam_out, use_rgb=True)
    
    fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(16, 4.5))
    ax1.imshow(im)
    ax1.set_title("Input Retinal Image")
    ax1.axis('off')
    
    ax2.imshow(overlay)
    ax2.set_title(f"Grad-CAM: {pred_name} ({confidence:.1f}%)")
    ax2.axis('off')
    
    ax3.barh(CONFIG["class_names"], probabilities * 100, color="#3498db")
    ax3.set_xlim([0, 100])
    ax3.set_xlabel("Probability (%)")
    ax3.set_title("Class Probability Distribution")
    for i, p in enumerate(probabilities * 100):
        ax3.text(p + 1, i, f"{p:.1f}%", va='center', fontsize=9)
        
    plt.tight_layout()
    plt.show()
    
    print(f"Prediction: {pred_name} | Confidence: {confidence:.2f}%")
    print(f"Action: {'Routine follow-up' if pred_idx == 0 else 'Refer for ophthalmology evaluation'}")

# Run inference test
predict_retinal_image(test_df.iloc[0]['image_path'])
""")

    # =========================================================================
    # CELL 23: Code - Model Export & Reload Verification
    # =========================================================================
    add_code(r"""# [CELL 23] Model Export and Reload Verification

# 1. Save state dictionary
torch.save(model.state_dict(), CONFIG["model_path"])
print(f"Model saved to: {CONFIG['model_path']}")

# 2. Save config and metrics
with open(CONFIG["config_path"], "w") as f:
    json.dump(CONFIG, f, indent=4)

metrics_summary = {
    "test_accuracy": float(test_acc),
    "macro_precision": float(macro_p),
    "macro_recall": float(macro_r),
    "macro_f1": float(macro_f1),
    "macro_auc": float(macro_auc),
    "specificities": {name: float(sp) for name, sp in zip(CONFIG["class_names"], specificities)}
}
with open(CONFIG["metrics_path"], "w") as f:
    json.dump(metrics_summary, f, indent=4)

# 3. Reload and verify output consistency
reloaded_model = build_densenet_model(num_classes=CONFIG["num_classes"], pretrained=False)
reloaded_model.load_state_dict(torch.load(CONFIG["model_path"], map_location=CONFIG["device"]))
reloaded_model.to(CONFIG["device"])
reloaded_model.eval()

dummy_in = torch.randn(1, 3, 224, 224).to(CONFIG["device"])
with torch.no_grad():
    orig_out = model(dummy_in)
    reloaded_out = reloaded_model(dummy_in)
    
max_diff = torch.max(torch.abs(orig_out - reloaded_out)).item()
print(f"Reload verification max logit difference: {max_diff:.8f}")
assert max_diff < 1e-5, "Reloaded model outputs differ from in-memory model!"
print("Model export and reload verified successfully.")
""")

    # =========================================================================
    # CELL 24: Code - Performance & Latency Benchmarking
    # =========================================================================
    add_code(r"""# [CELL 24] Inference Latency and Model Footprint Benchmarking

def benchmark_model(model, device, n_runs=50):
    model.eval()
    dummy = torch.randn(1, 3, 224, 224).to(device)
    
    # Warmup
    with torch.no_grad():
        for _ in range(10):
            _ = model(dummy)
            
    latencies = []
    with torch.no_grad():
        for _ in range(n_runs):
            t0 = time.perf_counter()
            _ = model(dummy)
            if device == 'cuda':
                torch.cuda.synchronize()
            t1 = time.perf_counter()
            latencies.append((t1 - t0) * 1000)
            
    file_size_mb = os.path.getsize(CONFIG["model_path"]) / (1024**2)
    print(f"Model Parameters:     {total_params:,}")
    print(f"Checkpoint File Size: {file_size_mb:.2f} MB")
    print(f"Mean Latency:         {np.mean(latencies):.2f} ms (+/- {np.std(latencies):.2f} ms)")
    print(f"Inference Throughput: {1000 / np.mean(latencies):.1f} FPS")

benchmark_model(model, CONFIG["device"])
""")

    # =========================================================================
    # CELL 25: Markdown - Ethical Considerations & Limitations
    # =========================================================================
    add_markdown("""## [CELL 25] Ethical Considerations and Clinical Limitations

### 1. Data Privacy and Governance
* Retinal photographs are sensitive biomedical data. All images must be de-identified and stripped of protected health information (PHI) in accordance with HIPAA/GDPR before ingestion.
* Institutional review board (IRB) compliance and patient consent protocols must govern clinical data aggregation.

### 2. Clinical Impact of Prediction Errors
* **False Negatives:** In DR screening, failing to flag severe non-proliferative or proliferative DR (Classes 3 and 4) risks delaying laser photocoagulation or anti-VEGF therapy, potentially leading to irreversible visual impairment. The inverse class weighting strategy is explicitly chosen to maximize sensitivity for sight-threatening pathology.
* **False Positives:** Misclassifying normal retinas as diseased increases clinical burden and patient anxiety, but carries lower clinical harm than missed severe cases.

### 3. Technical Limitations
* **Domain Shift:** Retinal images collected across different fundus camera optics (e.g., Topcon vs. Zeiss vs. Canon) exhibit domain variations in illumination, color balance, and field-of-view (45° vs. 50°).
* **Grad-CAM Resolution:** Grad-CAM provides coarse localization of salient regions and should be interpreted as decision support rather than precise microaneurysm/hemorrhage boundary segmentation.
""")

    # =========================================================================
    # CELL 26: Markdown - Technical Report
    # =========================================================================
    add_markdown("""## [CELL 26] Technical Summary & Architecture

### Methodology Overview
1. **Preprocessing:** Standardized RGB retinal scans transformed using MONAI (`ScaleIntensityRanged`, `NormalizeIntensityd`).
2. **Augmentation:** Domain-appropriate geometric rotations ($\pm 15^\circ$), reflections, contrast adjustments, and low-amplitude Gaussian noise.
3. **Architecture:** DenseNet-121 initialized with ImageNet weights. The dense connectivity structure enables feature reuse across all layers, facilitating the capture of both fine microvascular structures (early layers) and large exudative lesions (deep layers).
4. **Optimization:** AdamW optimizer ($\eta = 10^{-4}$, weight decay $= 10^{-4}$) with Cosine Annealing learning rate schedule and inverse class frequency weighted cross-entropy loss to address severe class imbalance.
5. **Explainability:** Grad-CAM activation maps computed on `features.denseblock4` to provide visual decision attribution.
""")

    notebook_json = {
        "cells": cells,
        "metadata": {
            "accelerator": "GPU",
            "colab": {
                "provenance": []
            },
            "kernelspec": {
                "display_name": "Python 3",
                "name": "python3"
            },
            "language_info": {
                "name": "python"
            }
        },
        "nbformat": 4,
        "nbformat_minor": 0
    }

    return notebook_json

if __name__ == "__main__":
    nb = create_notebook()
    output_path = r"E:\ml-asses\medical_image_diagnosis_assistant.ipynb"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(nb, f, indent=2)
    print(f"Generated clean master notebook at: {output_path}")
    print(f"Total Cells: {len(nb['cells'])}")
