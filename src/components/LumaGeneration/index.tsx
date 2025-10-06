import React from 'react';
import { LumaGenerationHeader } from './LumaGenerationHeader';
import { LumaVideoForm } from './LumaVideoForm';
import { LumaImageForm } from './LumaImageForm';
import type { LumaGenerationProps } from './types';

export const LumaGeneration: React.FC<LumaGenerationProps> = ({
  lumaGenerationType,
  setLumaGenerationType,
  videoFormProps,
  imageFormProps,
}) => {
  return (
    <article className="card">
      <div className="card-header">
        <h3 className="card-title">Luma Dream Machine</h3>
      </div>
      <div className="card-body">
        {/* Generation Type Selector */}
        <LumaGenerationHeader
          lumaGenerationType={lumaGenerationType}
          setLumaGenerationType={setLumaGenerationType}
          lumaModel={lumaGenerationType === 'video' ? videoFormProps.lumaModel : imageFormProps.lumaModel}
          setLumaModel={lumaGenerationType === 'video' ? videoFormProps.setLumaModel : imageFormProps.setLumaModel}
        />

        <sp-divider size="medium"></sp-divider>

        {/* Conditional Form Rendering */}
        {lumaGenerationType === 'video' ? (
          <LumaVideoForm {...videoFormProps} />
        ) : (
          <LumaImageForm {...imageFormProps} />
        )}
      </div>
    </article>
  );
};

export default LumaGeneration;
