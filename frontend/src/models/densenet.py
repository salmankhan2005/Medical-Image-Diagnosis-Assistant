"""
DenseNet-121 Architecture Definition with Transfer Learning for Diabetic Retinopathy
"""
import torch
import torch.nn as nn
import torchvision.models as models

def build_densenet121(num_classes: int = 5, pretrained: bool = True, dropout_rate: float = 0.3) -> nn.Module:
    """
    Constructs a DenseNet-121 architecture adapted for multi-class retinal fundus classification.
    
    Args:
        num_classes (int): Number of diagnostic severity categories (default: 5).
        pretrained (bool): Whether to load ImageNet pre-trained weights.
        dropout_rate (float): Dropout probability for the linear head regularizer.
        
    Returns:
        nn.Module: Configured PyTorch model.
    """
    weights = models.DenseNet121_Weights.DEFAULT if pretrained else None
    model = models.densenet121(weights=weights)
    
    in_features = model.classifier.in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=dropout_rate),
        nn.Linear(in_features, num_classes)
    )
    
    return model
