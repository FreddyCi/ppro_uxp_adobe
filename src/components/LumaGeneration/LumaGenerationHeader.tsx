import React from 'react';
import type { LumaGenerationHeaderProps } from './types';

export const LumaGenerationHeader: React.FC<LumaGenerationHeaderProps> = ({
  lumaGenerationType,
  setLumaGenerationType,
  lumaModel,
  setLumaModel,
}) => {
  return (
    <div className="generation-form">
      <div className="dropdown-row">
        <div className="dropdown-col">
          <label className="form-label">Generation Type</label>
          <sp-picker
            // @ts-expect-error - UXP component property
            size="m"
            onChange={(e: any) => {
              const newType = e.target.value as 'video' | 'image';
              setLumaGenerationType(newType);
              
              // Auto-switch model when changing generation type
              if (newType === 'video') {
                setLumaModel('ray-2');
              } else {
                setLumaModel('photon-1');
              }
            }}
          >
            <sp-menu slot="options">
              <sp-menu-item value="video">Video Generation</sp-menu-item>
              <sp-menu-item value="image">Image Generation</sp-menu-item>
            </sp-menu>
          </sp-picker>
        </div>
        
        <div className="dropdown-col">
          <label className="form-label">Select Model</label>
          <sp-picker
            // @ts-expect-error - UXP component property
            size="m"
            onChange={(e: any) => {
              setLumaModel(e.target.value);
            }}
          >
            <sp-menu slot="options">
              <sp-menu-item value="luma-ray">Luma Ray (Recommended)</sp-menu-item>
              <sp-menu-item value="luma-dream-1.7">Luma Dream Machine 1.7</sp-menu-item>
              <sp-menu-item value="luma-dream-1.6">Luma Dream Machine 1.6</sp-menu-item>
              <sp-menu-item value="luma-dream-1.5">Luma Dream Machine 1.5</sp-menu-item>
              <sp-menu-item value="luma-photon-flash-1">Luma Photon Flash (Fast)</sp-menu-item>
              <sp-menu-item value="luma-photon-1">Luma Photon</sp-menu-item>
            </sp-menu>
          </sp-picker>
        </div>
      </div>
    </div>
  );
};
