"""
Explainability Module: Grad-CAM Activation Visualizer for Retinal Pathology
"""
import torch
import numpy as np
from PIL import Image
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image

class RetinalGradCAM:
    """
    Wrapper for generating Grad-CAM overlays on DenseNet-121 architectures.
    """
    def __init__(self, model, target_layer=None):
        self.model = model
        self.model.eval()
        if target_layer is None:
            # Default to the final DenseBlock in DenseNet-121
            self.target_layer = [model.features.denseblock4]
        else:
            self.target_layer = [target_layer]
            
        self.cam = GradCAM(model=self.model, target_layers=self.target_layer)
        
    def generate_heatmap(self, input_tensor, rgb_img_float):
        """
        Generates 2D activation heatmap and color overlay on original image.
        
        Args:
            input_tensor: PyTorch tensor (1, C, H, W)
            rgb_img_float: Numpy float array [0, 1] of shape (H, W, 3)
            
        Returns:
            tuple: (grayscale_cam, overlay_image)
        """
        grayscale_cam = self.cam(input_tensor=input_tensor, targets=None)[0, :]
        overlay = show_cam_on_image(rgb_img_float, grayscale_cam, use_rgb=True)
        return grayscale_cam, overlay
