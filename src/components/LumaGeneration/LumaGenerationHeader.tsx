import React from 'react';
import type { LumaGenerationHeaderProps } from './types';

export const LumaGenerationHeader: React.FC<LumaGenerationHeaderProps> = ({
  lumaGenerationType,
  setLumaGenerationType,
  lumaModel,
  setLumaModel,
}) => {
  return (
    <div className="form-group">
      <label className="form-label">Generation Type</label>
      <sp-picker
        // @ts-expect-error - UXP component property
        size="m"
        style={{ width: '100%' }}
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
          <sp-menu-item value="video">
            Video Generation
          </sp-menu-item>
          <sp-menu-item value="image">
            Image Generation
          </sp-menu-item>
        </sp-menu>
      </sp-picker>
    </div>
  );
};
