"""
MONAI Medical Preprocessing & Augmentation Pipelines
"""
import numpy as np
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

def get_train_transforms():
    """
    Returns MONAI transform composition for the training partition.
    Includes domain-appropriate geometric and intensity augmentations.
    """
    return Compose([
        ScaleIntensityRanged(
            keys=["image"],
            a_min=0.0,
            a_max=255.0,
            b_min=0.0,
            b_max=1.0,
            clip=True
        ),
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

def get_eval_transforms():
    """
    Returns MONAI transform composition for validation and test partitions.
    Deterministic normalization only.
    """
    return Compose([
        ScaleIntensityRanged(
            keys=["image"],
            a_min=0.0,
            a_max=255.0,
            b_min=0.0,
            b_max=1.0,
            clip=True
        ),
        NormalizeIntensityd(
            keys=["image"],
            subtrahend=[0.485, 0.456, 0.406],
            divisor=[0.229, 0.224, 0.225],
            channel_wise=True
        ),
        ToTensord(keys=["image", "label"])
    ])
